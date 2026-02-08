#!/bin/bash

npx @openapitools/openapi-generator-cli generate \
    -i openapi.json \
    -g rust \
    --additional-properties=packageName=arch_client \
    -o ./arch-client
