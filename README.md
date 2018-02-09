# advanced-logger

[![Quality Gate](https://sonarcloud.io/api/badges/gate?key=advanced-logger)](https://sonarcloud.io/dashboard/index/advanced-logger)
[![Coverage](https://sonarcloud.io/api/badges/measure?key=advanced-logger&metric=coverage)](https://sonarcloud.io/dashboard/index/advanced-logger)
[![Skipped Tests](https://sonarcloud.io/api/badges/measure?key=advanced-logger&metric=skipped_tests)](https://sonarcloud.io/dashboard/index/advanced-logger)
[![Cyclomatic Complexity](https://sonarcloud.io/api/badges/measure?key=advanced-logger&metric=complexity)](https://sonarcloud.io/dashboard/index/advanced-logger)
[![Cognitive Complexity](https://sonarcloud.io/api/badges/measure?key=advanced-logger&metric=cognitive_complexity)](https://sonarcloud.io/dashboard/index/advanced-logger)
[![Bugs](https://sonarcloud.io/api/badges/measure?key=advanced-logger&metric=bugs)](https://sonarcloud.io/dashboard/index/advanced-logger)
[![Code Smells](https://sonarcloud.io/api/badges/measure?key=advanced-logger&metric=code_smells)](https://sonarcloud.io/dashboard/index/advanced-logger)
[![Vulnerabilities](https://sonarcloud.io/api/badges/measure?key=advanced-logger&metric=vulnerabilities)](https://sonarcloud.io/dashboard/index/advanced-logger)
[![Maintainability](https://sonarcloud.io/api/badges/measure?key=advanced-logger&metric=new_maintainability_rating)](https://sonarcloud.io/dashboard/index/advanced-logger)
[![Reliability](https://sonarcloud.io/api/badges/measure?key=advanced-logger&metric=new_reliability_rating)](https://sonarcloud.io/dashboard/index/advanced-logger)

Used https://github.com/DxCx/ts-library-starter repository as a start point for the library

##Requirements

* Should be able to send single logs and bundles of them
* Should support different log sending strategies:
  1. interval
  2. on request
  3. mixed (interval + on request)
  4. on bundle size
  5. instant (received 1 log -> sent 1 log)
* Should be able to group duplicated logs in certain time interval**
* Should support different remote logger endpoints