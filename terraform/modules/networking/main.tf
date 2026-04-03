data "aws_vpc" "default" {
  default = true
}

data "aws_subnets" "default" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }

  filter {
    name   = "default-for-az"
    values = ["true"]
  }
}

# ---------- Web / ECS security group ----------
resource "aws_security_group" "web" {
  name        = "devops-portfolio-web"
  description = "Allow HTTP, HTTPS, and SSH inbound traffic"
  vpc_id      = data.aws_vpc.default.id

  # App port — only port exposed to the internet
  ingress {
    description = "App"
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # No SSH — use SSM Session Manager instead
  # No HTTP/80 — app runs on 3000
  # No HTTPS/443 — handled at Cloudflare/CDN layer later

  # Outbound — needed for ECR pulls, Secrets Manager, CloudWatch
  egress {
    description = "All outbound"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# ---------- RDS security group ----------
resource "aws_security_group" "rds" {
  name        = "devops-portfolio-rds"
  description = "Allow PostgreSQL from web security group only"
  vpc_id      = data.aws_vpc.default.id

  # Only accept connections from the ECS security group
  ingress {
    description     = "PostgreSQL from web tier"
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.web.id]
  }

  egress {
    description = "All outbound"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
