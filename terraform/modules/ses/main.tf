resource "aws_ses_email_identity" "contact" {
  email = var.email
}
