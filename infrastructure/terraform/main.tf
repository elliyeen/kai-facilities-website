terraform {
  required_version = ">= 1.6"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = var.app_name
      Environment = var.environment
      ManagedBy   = "terraform"
    }
  }
}

module "networking" {
  source      = "./modules/networking"
  app_name    = var.app_name
  environment = var.environment
}

module "ecr" {
  source      = "./modules/ecr"
  app_name    = var.app_name
  environment = var.environment
}

module "ecs" {
  source                = "./modules/ecs"
  app_name              = var.app_name
  environment           = var.environment
  container_port        = var.container_port
  desired_count         = var.desired_count
  task_cpu              = var.task_cpu
  task_memory           = var.task_memory
  aws_region            = var.aws_region
  ecr_repository_url    = module.ecr.repository_url
  vpc_id                = module.networking.vpc_id
  public_subnet_ids     = module.networking.public_subnet_ids
  private_subnet_ids    = module.networking.private_subnet_ids
  alb_security_group_id = module.networking.alb_security_group_id
  ecs_security_group_id = module.networking.ecs_security_group_id
}
