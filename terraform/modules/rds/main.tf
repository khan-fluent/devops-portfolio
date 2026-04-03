resource "aws_db_subnet_group" "this" {
  name       = "devops-portfolio"
  subnet_ids = var.subnet_ids
}

resource "aws_db_instance" "this" {
  identifier = "devops-portfolio"

  engine         = "postgres"
  engine_version = "16"
  instance_class = "db.t3.micro"

  allocated_storage = 20
  storage_type      = "gp2"

  db_name  = var.db_name
  username = var.db_username

  manage_master_user_password = true

  db_subnet_group_name   = aws_db_subnet_group.this.name
  vpc_security_group_ids = var.security_group_ids

  multi_az            = false
  publicly_accessible = false
  skip_final_snapshot = true

  backup_retention_period = 0
}

