output "ecr_repository_url" {
  description = "URL of the ECR repository"
  value       = module.ecr.repository_url
}

output "ecs_cluster_name" {
  description = "Name of the ECS cluster"
  value       = module.ecs.cluster_name
}

output "ecs_service_name" {
  description = "Name of the ECS service"
  value       = module.ecs.service_name
}

output "rds_endpoint" {
  description = "RDS instance endpoint"
  value       = module.rds.db_host
}

output "web_security_group_id" {
  description = "Security group ID for the web tier"
  value       = module.networking.web_security_group_id
}
