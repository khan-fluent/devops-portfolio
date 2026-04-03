#!/bin/bash
set -euo pipefail

REGION="us-east-1"
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
BUCKET_NAME="devops-portfolio-tfstate-${ACCOUNT_ID}"

echo "==> Creating S3 state bucket: ${BUCKET_NAME}"
aws s3api create-bucket \
  --bucket "$BUCKET_NAME" \
  --region "$REGION"

echo "==> Enabling versioning"
aws s3api put-bucket-versioning \
  --bucket "$BUCKET_NAME" \
  --versioning-configuration Status=Enabled

echo "==> Blocking public access"
aws s3api put-public-access-block \
  --bucket "$BUCKET_NAME" \
  --public-access-block-configuration \
    BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true

echo ""
echo "Done! Add this to your terraform backend config:"
echo ""
echo "  backend \"s3\" {"
echo "    bucket       = \"${BUCKET_NAME}\""
echo "    key          = \"terraform.tfstate\""
echo "    region       = \"${REGION}\""
echo "    use_lockfile = true"
echo "  }"
