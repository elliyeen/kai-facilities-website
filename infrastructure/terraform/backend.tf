terraform {
  backend "s3" {
    bucket         = "kai-facilities-terraform-state"
    key            = "kai-facilities/production/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "kai-facilities-terraform-locks"
  }
}
