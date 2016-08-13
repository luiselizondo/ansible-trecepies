#!/usr/bin/env bats

@test "AWS: Parse instance object to get public IP" {
  result=$(providers/aws/parse-instance-object-to-get-public-ip tests/helpers/aws-response-from-getting-an-instance-description.json)
  [ "$result" = "52.91.120.86 " ]
}
