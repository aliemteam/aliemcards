#!/bin/bash

# AWS CLI must be installed
# AWS credentials must be set in ~/.aws/credentials
aws s3 sync ./cards s3://aliemcards  \
  --acl public-read \
  --exclude ".*" \
  --exclude "*/.*" \
  --exclude "*/*.md" \
  --delete
