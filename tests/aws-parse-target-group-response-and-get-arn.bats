#!/usr/bin/env bats

@test "AWS: Parse target group response and get load balancer ARN" {
  result=$(providers/aws/parse-target-group-response-and-get-arn tests/helpers/aws-response-from-creating-a-target-group.json)
  [ "$result" = "arn:aws:elasticloadbalancing:us-west-2:123456789012:targetgroup/my-targets/73e2d6bc24d8a067" ]
}
