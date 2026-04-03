# ---------- SNS Topic for Alerts ----------

resource "aws_sns_topic" "alerts" {
  name = "devops-portfolio-alerts"
}

resource "aws_sns_topic_subscription" "email" {
  topic_arn = aws_sns_topic.alerts.arn
  protocol  = "email"
  endpoint  = var.alert_email
}

# ---------- EC2 CPU Alarm ----------

resource "aws_cloudwatch_metric_alarm" "ec2_cpu_high" {
  alarm_name          = "devops-portfolio-ec2-cpu-high"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "CPUUtilization"
  namespace           = "AWS/EC2"
  period              = 300
  statistic           = "Average"
  threshold           = 80
  alarm_description   = "EC2 CPU > 80% for 10 minutes"
  alarm_actions       = [aws_sns_topic.alerts.arn]
  ok_actions          = [aws_sns_topic.alerts.arn]

  dimensions = {
    AutoScalingGroupName = var.autoscaling_group_name
  }
}

# ---------- RDS CPU Alarm ----------

resource "aws_cloudwatch_metric_alarm" "rds_cpu_high" {
  alarm_name          = "devops-portfolio-rds-cpu-high"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "CPUUtilization"
  namespace           = "AWS/RDS"
  period              = 300
  statistic           = "Average"
  threshold           = 80
  alarm_description   = "RDS CPU > 80% for 10 minutes"
  alarm_actions       = [aws_sns_topic.alerts.arn]
  ok_actions          = [aws_sns_topic.alerts.arn]

  dimensions = {
    DBInstanceIdentifier = var.rds_instance_id
  }
}

# ---------- RDS Free Storage Alarm ----------

resource "aws_cloudwatch_metric_alarm" "rds_storage_low" {
  alarm_name          = "devops-portfolio-rds-storage-low"
  comparison_operator = "LessThanThreshold"
  evaluation_periods  = 1
  metric_name         = "FreeStorageSpace"
  namespace           = "AWS/RDS"
  period              = 300
  statistic           = "Average"
  threshold           = 2000000000 # 2GB
  alarm_description   = "RDS free storage < 2GB"
  alarm_actions       = [aws_sns_topic.alerts.arn]

  dimensions = {
    DBInstanceIdentifier = var.rds_instance_id
  }
}

# ---------- RDS Database Connections Alarm ----------

resource "aws_cloudwatch_metric_alarm" "rds_connections_high" {
  alarm_name          = "devops-portfolio-rds-connections-high"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "DatabaseConnections"
  namespace           = "AWS/RDS"
  period              = 300
  statistic           = "Average"
  threshold           = 50
  alarm_description   = "RDS connections > 50 (max ~85 for t3.micro)"
  alarm_actions       = [aws_sns_topic.alerts.arn]

  dimensions = {
    DBInstanceIdentifier = var.rds_instance_id
  }
}

# ---------- ECS Running Task Count Alarm ----------

resource "aws_cloudwatch_metric_alarm" "ecs_no_running_tasks" {
  alarm_name          = "devops-portfolio-ecs-no-tasks"
  comparison_operator = "LessThanThreshold"
  evaluation_periods  = 1
  metric_name         = "RunningTaskCount"
  namespace           = "ECS/ContainerInsights"
  period              = 60
  statistic           = "Average"
  threshold           = 1
  alarm_description   = "No ECS tasks running — service is down"
  alarm_actions       = [aws_sns_topic.alerts.arn]

  dimensions = {
    ClusterName = var.ecs_cluster_name
    ServiceName = var.ecs_service_name
  }
}

# ---------- EC2 Auto-Recovery ----------

resource "aws_cloudwatch_metric_alarm" "ec2_auto_recovery" {
  alarm_name          = "devops-portfolio-ec2-auto-recover"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  evaluation_periods  = 2
  metric_name         = "StatusCheckFailed_System"
  namespace           = "AWS/EC2"
  period              = 60
  statistic           = "Maximum"
  threshold           = 1
  alarm_description   = "Auto-recover EC2 if system status check fails"
  alarm_actions       = ["arn:aws:automate:us-east-1:ec2:recover", aws_sns_topic.alerts.arn]

  dimensions = {
    InstanceId = var.ec2_instance_id
  }
}
