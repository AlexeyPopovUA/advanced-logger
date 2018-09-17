# advanced-logger

[![Build Status](https://travis-ci.org/AlexeyPopovUA/advanced-logger.svg?branch=master)](https://travis-ci.org/AlexeyPopovUA/advanced-logger)
[![npm version](https://badge.fury.io/js/advanced-logger.svg)](https://badge.fury.io/js/advanced-logger)
[![dependencies Status](https://david-dm.org/AlexeyPopovUA/advanced-logger/status.svg)](https://david-dm.org/AlexeyPopovUA/advanced-logger)
[![Greenkeeper badge](https://badges.greenkeeper.io/AlexeyPopovUA/advanced-logger.svg)](https://greenkeeper.io/)
[![install size](https://packagephobia.now.sh/badge?p=advanced-logger@1.0.9)](https://packagephobia.now.sh/result?p=advanced-logger)
[![](https://data.jsdelivr.com/v1/package/npm/advanced-logger/badge)](https://www.jsdelivr.com/package/npm/advanced-logger)

[![Quality Gate](https://sonarcloud.io/api/project_badges/measure?project=advanced-logger&metric=alert_status)](https://sonarcloud.io/dashboard/index/advanced-logger)
[![Reliability](https://sonarcloud.io/api/project_badges/measure?project=advanced-logger&metric=reliability_rating)](https://sonarcloud.io/dashboard/index/advanced-logger)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=advanced-logger&metric=coverage)](https://sonarcloud.io/dashboard/index/advanced-logger)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=advanced-logger&metric=bugs)](https://sonarcloud.io/dashboard/index/advanced-logger)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=advanced-logger&metric=code_smells)](https://sonarcloud.io/dashboard/index/advanced-logger)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=advanced-logger&metric=vulnerabilities)](https://sonarcloud.io/dashboard/index/advanced-logger)

Used https://github.com/DxCx/ts-library-starter repository as a start point for the library

##Requirements

* Should be able to send single logs and bundles of them (done! \o/ )
* Should support different log sending strategies:
  1.  interval (done! \o/ )
  2.  on request (done! \o/ )
  3.  mixed (interval + on request)
  4.  on bundle size (done! \o/ )
  5.  instant (received 1 log -> sent 1 log) (done! \o/ )
* Should be able to group duplicated logs in certain time interval (done! \o/ )
* Should support different remote logger endpoints
