variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "ecr_repository_name" {
  description = "Name of the ECR repository"
  type        = string
  default     = "devops-portfolio"
}

variable "ecs_cluster_name" {
  description = "Name of the ECS cluster"
  type        = string
  default     = "devops-portfolio"
}

variable "db_name" {
  description = "PostgreSQL database name"
  type        = string
  default     = "devops_portfolio"
}

variable "db_username" {
  description = "PostgreSQL master username"
  type        = string
  default     = "dbadmin"
}

variable "contact_email" {
  description = "Email address for contact form and alert notifications"
  type        = string
  default     = "khanfluent@outlook.com"
}
