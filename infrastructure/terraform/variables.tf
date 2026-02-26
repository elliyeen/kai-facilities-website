variable "aws_region" {
  description = "AWS region to deploy resources"
  type        = string
  default     = "us-east-1"
}

variable "app_name" {
  description = "Application name used for resource naming"
  type        = string
  default     = "kai-facilities"
}

variable "environment" {
  description = "Deployment environment (production, staging)"
  type        = string
  default     = "production"
}

variable "container_port" {
  description = "Port the container listens on"
  type        = number
  default     = 3000
}

variable "desired_count" {
  description = "Number of ECS tasks to run"
  type        = number
  default     = 2
}

variable "task_cpu" {
  description = "CPU units for the Fargate task (1 vCPU = 1024)"
  type        = number
  default     = 512
}

variable "task_memory" {
  description = "Memory in MB for the Fargate task"
  type        = number
  default     = 1024
}
