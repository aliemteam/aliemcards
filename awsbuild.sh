#!/bin/bash

aws s3 sync ./cards s3://aliemcards  \
  --acl public-read \
  --exclude ".*" \
  --exclude "*/.*" \
  --exclude "*/*.md" \
  --delete \
