#!/usr/bin/env bats

@test "AWS: Parse load balancer response and get load balancer ARN" {
  result=$(providers/aws/parse-load-balancer-response-and-get-arn tests/helpers/aws-response-from-creating-a-load-balancer.json)
  [ "$result" = "arn:aws:elasticloadbalancing:us-west-2:123456789012:loadbalancer/app/my-load-balancer/50dc6c495c0c9188" ]
}
