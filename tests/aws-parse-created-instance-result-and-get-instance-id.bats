#!/usr/bin/env bats

@test "AWS: Parse created instance result and get instance ID" {
  result=$(providers/aws/parse-created-instance-result-and-get-instance-id tests/helpers/aws-response-when-creating-instance.json)
  [ "$result" = "i-af51cd57 i-af51cd58 " ]
}
