# advanced-logger

[![Build Status](https://travis-ci.org/AlexeyPopovUA/advanced-logger.svg?branch=master)](https://travis-ci.org/AlexeyPopovUA/advanced-logger)
[![npm version](https://badge.fury.io/js/advanced-logger.svg)](https://badge.fury.io/js/advanced-logger)
[![dependencies Status](https://david-dm.org/AlexeyPopovUA/advanced-logger/status.svg)](https://david-dm.org/AlexeyPopovUA/advanced-logger)
[![install size](https://packagephobia.now.sh/badge?p=advanced-logger)](https://packagephobia.now.sh/result?p=advanced-logger)
[![](https://data.jsdelivr.com/v1/package/npm/advanced-logger/badge)](https://www.jsdelivr.com/package/npm/advanced-logger)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FAlexeyPopovUA%2Fadvanced-logger.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2FAlexeyPopovUA%2Fadvanced-logger?ref=badge_shield)


[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=AlexeyPopovUA_advanced-logger&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=AlexeyPopovUA_advanced-logger)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=AlexeyPopovUA_advanced-logger&metric=bugs)](https://sonarcloud.io/summary/new_code?id=AlexeyPopovUA_advanced-logger)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=AlexeyPopovUA_advanced-logger&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=AlexeyPopovUA_advanced-logger)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=AlexeyPopovUA_advanced-logger&metric=coverage)](https://sonarcloud.io/summary/new_code?id=AlexeyPopovUA_advanced-logger)
[![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=AlexeyPopovUA_advanced-logger&metric=duplicated_lines_density)](https://sonarcloud.io/summary/new_code?id=AlexeyPopovUA_advanced-logger)
[![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=AlexeyPopovUA_advanced-logger&metric=ncloc)](https://sonarcloud.io/summary/new_code?id=AlexeyPopovUA_advanced-logger)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=AlexeyPopovUA_advanced-logger&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=AlexeyPopovUA_advanced-logger)
[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=AlexeyPopovUA_advanced-logger&metric=reliability_rating)](https://sonarcloud.io/summary/new_code?id=AlexeyPopovUA_advanced-logger)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=AlexeyPopovUA_advanced-logger&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=AlexeyPopovUA_advanced-logger)
[![Technical Debt](https://sonarcloud.io/api/project_badges/measure?project=AlexeyPopovUA_advanced-logger&metric=sqale_index)](https://sonarcloud.io/summary/new_code?id=AlexeyPopovUA_advanced-logger)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=AlexeyPopovUA_advanced-logger&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=AlexeyPopovUA_advanced-logger)


[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)

## What is it?

It is an extendable isomorphic log sending library written in TypeScript for javascript application in nodejs and browsers.

It can be extended with custom strategy ("when to send logs") and service ("where to send logs").

It does not restrict you with conventions, for example, existence of "logSeverity", "ErrorId" or "message" fields in log.

It supports any format of logs via custom serializer.

## Features

* :scream_cat: It works in browsers and nodejs
* :articulated_lorry: It is able to send single logs and bundles of them to an external logger
* It supports different log sending strategies:
  1.  :alarm_clock: interval (for example, every 10 seconds)
  2.  :loudspeaker: on request (only when you ask)
  3.  :alarm_clock: :heavy_plus_sign: :loudspeaker: mixed ("interval" + "on request") (will be done soon)
  4.  :steam_locomotive: :railway_car: :railway_car: :railway_car: on bundle size (for example, sends bundles of 100 logs)
  5.  :toilet: instant (received 1 log -> sent 1 log)
* :busts_in_silhouette: It is able to group duplicated logs in certain time interval (for rapid fire of the same logs)
* :octopus: It is not afraid of circular links in log objects
* :building_construction: It supports custom format for logs (custom serializer)
* :dart: It supports different remote logger endpoints (SumoLogic, Loggly and Elasticsearch). Who is the next? ᕙ(ಠ.ಠ)ᕗ

## Runtime environment support :running_woman:

Builds are generated as ES5 bundles for nodejs and browser environments.

:robot: NodeJS - tested on latest lts

:globe_with_meridians: Browser - all latest browsers + IE10, IE11 (fetch polyfill)

## [Documentation](https://advancedlogger.com "Advanced Logger's Homepage")

Complete documentation and examples can be found here:

**[Advanced Logger's Homepage](https://advancedlogger.com "Advanced Logger's Homepage")**

**[NPM package link](https://www.npmjs.com/package/advanced-logger "NPM package link")**

### Simplest usage

Now, the boring part :nerd_face:

#### Add to the project

In browser:

```html
<script src="./node-modules/advance-logger/dist/browser/advanced-logger.browser.min.js"></script>
```

or

```html
<script src="https://cdn.jsdelivr.net/npm/advanced-logger@latest/dist/browser/advanced-logger.browser.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/advanced-logger@latest/dist/browser-debug/advanced-logger.browser.js"></script>
```

In nodejs:

```javascript
const {AdvancedLogger, service, strategy} = require('advanced-logger');
```

#### Configuration

Lets initiate a logger that sends all logs instantly to Sumologic service.

In browser

```javascript
const {AdvancedLogger, service, strategy} = window.advancedLogger;

const defaultLogConfig = {
    UserAgent: window.userAgent,
    Channel: "my-company",
    BuildVersion: 123,
    Platform: "browser",
    Severity: "DEBUG",
    Data: "",
    Timestamp: "",
    Message: "",
    Category: ""
};

const serviceConfig = {
    url: "https://www.google.nl",
    sourceName: "advancedLoggerTest",
    host: "advanced-logger",
    sourceCategory: "MY/SUMO/namespace",
    method: "POST"
};

const config = {serviceConfig, defaultLogConfig};

const logger = new AdvancedLogger({
    service: new service.SumologicService(config),
    strategy: new strategy.InstantStrategy()
});

logger.log({test: "instant log u1"}); // sends log message :rocket:
logger.log({test: "instant log u2"}); // sends log message :rocket:
logger.log({test: "instant log u3"}); // sends log message :rocket:
```