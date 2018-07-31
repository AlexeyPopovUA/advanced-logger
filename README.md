# advanced-logger

[![Quality Gate](https://sonarcloud.io/api/project_badges/measure?project=advanced-logger&metric=alert_status)](https://sonarcloud.io/dashboard/index/advanced-logger)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=advanced-logger&metric=coverage)](https://sonarcloud.io/dashboard/index/advanced-logger)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=advanced-logger&metric=bugs)](https://sonarcloud.io/dashboard/index/advanced-logger)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=advanced-logger&metric=code_smells)](https://sonarcloud.io/dashboard/index/advanced-logger)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=advanced-logger&metric=vulnerabilities)](https://sonarcloud.io/dashboard/index/advanced-logger)
[![Reliability](https://sonarcloud.io/api/project_badges/measure?project=advanced-logger&metric=reliability_rating)](https://sonarcloud.io/dashboard/index/advanced-logger)
[![Greenkeeper badge](https://badges.greenkeeper.io/AlexeyPopovUA/universal-logger.svg)](https://greenkeeper.io/)

Used https://github.com/DxCx/ts-library-starter repository as a start point for the library

##Requirements

* Should be able to send single logs and bundles of them
* Should support different log sending strategies:
  1.  interval
  2.  on request (done! \o/ )
  3.  mixed (interval + on request)
  4.  on bundle size
  5.  instant (received 1 log -> sent 1 log) (done! \o/ )
* Should be able to group duplicated logs in certain time interval
* Should support different remote logger endpoints
