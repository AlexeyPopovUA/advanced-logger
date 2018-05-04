#!/usr/bin/env bash

exec sonar-scanner \
  -Dsonar.projectKey=advanced-logger \
  -Dsonar.projectVersion=1.0.5 \
  -Dsonar.sourceEncoding=UTF-8 \
  -Dsonar.organization=alexeypopovua-github \
  -Dsonar.sources=./src \
  -Dsonar.tests=./__tests__ \
  -Dsonar.typescript.lcov.reportPaths=coverage/lcov.info \
  -Dsonar.host.url=https://sonarcloud.io \
  -Dsonar.login=<login token>