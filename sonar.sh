#!/usr/bin/env bash

sonar-scanner \
  -Dsonar.projectKey=universal-logger \
  -Dsonar.organization=alexeypopovua-github \
  -Dsonar.sources=./src \
  -Dsonar.tests=./__tests__ \
  -Dsonar.typescript.lcov.reportPaths=coverage/lcov.info \
  -Dsonar.host.url=https://sonarcloud.io \
  -Dsonar.login=<login token>