terraform {
  required_version = ">= 1.10"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket       = "devops-portfolio-tfstate-282353614364"
    key          = "dev/terraform.tfstate"
    region       = "us-east-1"
    use_lockfile = true
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project = "devops-portfolio"
    }
  }
}

module "networking" {
  source = "../../modules/networking"
}

module "ecr" {
  source = "../../modules/ecr"

  repository_name = var.ecr_repository_name
}

module "rds" {
  source = "../../modules/rds"

  db_name    = var.db_name
  db_username = var.db_username

  subnet_ids         = module.networking.subnet_ids
  security_group_ids = [module.networking.rds_security_group_id]
}

module "ecs" {
  source = "../../modules/ecs"

  cluster_name       = var.ecs_cluster_name
  ecr_repository_url = module.ecr.repository_url
  container_port     = 3000

  vpc_id             = module.networking.vpc_id
  subnet_ids         = module.networking.subnet_ids
  security_group_ids = [module.networking.web_security_group_id]

  db_host       = module.rds.db_host
  db_port       = module.rds.db_port
  db_name       = var.db_name
  db_username   = var.db_username
  db_secret_arn = module.rds.master_user_secret_arn

  contact_email = var.contact_email
}

module "ses" {
  source = "../../modules/ses"

  email = var.contact_email
}

module "monitoring" {
  source = "../../modules/monitoring"

  alert_email            = var.contact_email
  ecs_cluster_name       = module.ecs.cluster_name
  ecs_service_name       = module.ecs.service_name
  rds_instance_id        = "devops-portfolio"
  autoscaling_group_name = module.ecs.autoscaling_group_name
  ec2_instance_id        = data.aws_instances.ecs.ids[0]
}

data "aws_instances" "ecs" {
  filter {
    name   = "tag:Name"
    values = ["devops-portfolio-ecs-instance"]
  }

  filter {
    name   = "instance-state-name"
    values = ["running"]
  }
}
