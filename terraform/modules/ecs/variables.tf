variable "cluster_name" {
  description = "Name of the ECS cluster"
  type        = string
}

variable "ecr_repository_url" {
  description = "URL of the ECR repository"
  type        = string
}

variable "container_port" {
  description = "Port the container listens on"
  type        = number
  default     = 80
}

variable "vpc_id" {
  description = "VPC ID"
  type        = string
}

variable "subnet_ids" {
  description = "Subnet IDs for the ASG"
  type        = list(string)
}

variable "security_group_ids" {
  description = "Security group IDs for the EC2 instances"
  type        = list(string)
}

variable "db_host" {
  description = "RDS instance hostname"
  type        = string
}

variable "db_port" {
  description = "RDS instance port"
  type        = string
}

variable "db_name" {
  description = "Database name"
  type        = string
}

variable "db_username" {
  description = "Database username"
  type        = string
}

variable "db_secret_arn" {
  description = "ARN of the Secrets Manager secret containing the master password"
  type        = string
}

variable "contact_email" {
  description = "Email address for contact form notifications"
  type        = string
}
