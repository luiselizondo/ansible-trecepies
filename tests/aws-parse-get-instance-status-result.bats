#!/usr/bin/env bats

@test "AWS: Parse get instance status result wjem rimmomg" {
  result=$(providers/aws/parse-get-instance-status-result tests/helpers/aws-response-when-getting-a-running-instance-status.json)
  [ "$result" = "running" ]
}

@test "AWS: Parse get instance status result when pending" {
  result=$(providers/aws/parse-get-instance-status-result tests/helpers/aws-response-when-getting-a-pending-instance-status.json)
  [ "$result" = "pending" ]
}
