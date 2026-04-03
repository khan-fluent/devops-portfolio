variable "alert_email" {
  description = "Email address for alarm notifications"
  type        = string
}

variable "ecs_cluster_name" {
  description = "ECS cluster name"
  type        = string
}

variable "ecs_service_name" {
  description = "ECS service name"
  type        = string
}

variable "rds_instance_id" {
  description = "RDS instance identifier"
  type        = string
}

variable "autoscaling_group_name" {
  description = "EC2 Auto Scaling Group name"
  type        = string
}

variable "ec2_instance_id" {
  description = "EC2 instance ID for auto-recovery"
  type        = string
}
