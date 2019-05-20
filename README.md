# advanced-logger

[![Build Status](https://travis-ci.org/AlexeyPopovUA/advanced-logger.svg?branch=master)](https://travis-ci.org/AlexeyPopovUA/advanced-logger)
[![npm version](https://badge.fury.io/js/advanced-logger.svg)](https://badge.fury.io/js/advanced-logger)
[![dependencies Status](https://david-dm.org/AlexeyPopovUA/advanced-logger/status.svg)](https://david-dm.org/AlexeyPopovUA/advanced-logger)
[![install size](https://packagephobia.now.sh/badge?p=advanced-logger)](https://packagephobia.now.sh/result?p=advanced-logger)
[![](https://data.jsdelivr.com/v1/package/npm/advanced-logger/badge)](https://www.jsdelivr.com/package/npm/advanced-logger)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FAlexeyPopovUA%2Fadvanced-logger.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2FAlexeyPopovUA%2Fadvanced-logger?ref=badge_shield)

[![Quality Gate](https://sonarcloud.io/api/project_badges/measure?project=advanced-logger&metric=alert_status)](https://sonarcloud.io/dashboard/index/advanced-logger)
[![Reliability](https://sonarcloud.io/api/project_badges/measure?project=advanced-logger&metric=reliability_rating)](https://sonarcloud.io/dashboard/index/advanced-logger)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=advanced-logger&metric=coverage)](https://sonarcloud.io/dashboard/index/advanced-logger)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=advanced-logger&metric=bugs)](https://sonarcloud.io/dashboard/index/advanced-logger)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=advanced-logger&metric=code_smells)](https://sonarcloud.io/dashboard/index/advanced-logger)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=advanced-logger&metric=vulnerabilities)](https://sonarcloud.io/dashboard/index/advanced-logger)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)

## The idea

The main idea of this module is to create an isomorphic log sending tool, that can be extended by internal/external plugins.

It has bundles for browser and nodejs environments.

It can be extended with custom strategy ("when to send logs") and service ("where to send logs"). See usage examples.

It does not restrict you with conventions, for example, existence of "logSeverity", "ErrorId" or "message" fields in log.

It supports any format of logs via custom serializer.

## Features

* It works in browsers and nodejs
* It is able to send single logs and bundles of them to an external logger
* It supports different log sending strategies:
  1.  interval (for example, every 10 seconds)
  2.  on request (only when you ask)
  3.  mixed ("interval" + "on request") (will be done soon)
  4.  on bundle size (for example, sends bundles of 100 logs)
  5.  instant (received 1 log -> sent 1 log)
* It is able to group duplicated logs in certain time interval (for rapid fire of the same logs)
* It is not afraid of circular links in log objects
* It supports custom format for logs (custom serializer)
* It supports different remote logger endpoints (SumoLogic, Loggly and Elasticsearch). Who is the next? ᕙ(ಠ.ಠ)ᕗ

## Runtime environment support

Builds are generated as ES5 bundles for nodejs and browser environments.

NodeJS - tested on latest lts

Browser - all latest browsers + IE10, IE11 (fetch polyfill)

## Usage

Please, find working examples for browser and nodejs environments in **/example** folder.

### Add to the project

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

### Simplest usage

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

logger.log({test: "instant log u1"});
logger.log({test: "instant log u2"});
logger.log({test: "instant log u3"});
```

### Strategies

Strategies are components that "know" when is it right time to send logs.

There are next strategies available:

* InstantStrategy
* OnBundleSizeStrategy
* OnIntervalStrategy
* OnRequestStrategy

#### InstantStrategy

Does not require parameters. It just sends the log as soon as it appears in logger.

```javascript
const {strategy} = require("advanced-logger");
const strategy = new strategy.InstantStrategy();
```

#### OnBundleSizeStrategy

Can accept a configuration object with an optional "maxBundle" value, which determines what is a maximal amount of logs it should collect before sending to the service. Default number is 100.

```javascript
const {strategy} = require("advanced-logger");
const config = {
    maxBundle: 123
};
const strategy = new strategy.OnBundleSizeStrategy(config);
```

#### OnIntervalStrategy

Can accept a configuration object with an optional "interval" value, which determines what is a time interval for collecting logs before sending them to the service. Default number is 15000.

```javascript
const {strategy} = require("advanced-logger");
const config = {
    interval: 10000
};
const strategy = new strategy.OnIntervalStrategy(config);
```

#### OnRequestStrategy

This strategy does not do anything :) . It will send logs only after manual call to ```logger.sendAllLogs();``` method.

```javascript
const {strategy} = require("advanced-logger");

const strategy = new strategy.OnRequestStrategy();

//"logger" is an instance of AdvancedLogger

logger.sendAllLogs();
```

#### Custom implementation of strategy

TODO

### Services

Currently, module supports only Sumologic and Loggly services out of the box.

#### Sumologic (see https://www.sumologic.com/)

```javascript
//Configuration for communication with Sumologic.
//Url should be taken from the logger's source category configuration page.
const serviceConfig = {
    url: "https://www.google.nl",
    sourceName: "advancedLoggerTest",
    host: "advanced-logger",
    sourceCategory: "MY/SUMO/namespace",
    method: "POST"
};

//Default log configuration.
//It is used like a template with default values for each new log.
//Can be of any structure. It will be shallowly copied during creation of a new log record.
const defaultLogConfig = {
    UserAgent: window.userAgent,
    BuildVersion: 123,
    Platform: "browser",
    Severity: "DEBUG",
    Data: "",
    Timestamp: "",
    Message: "",
    Category: ""
};

//general config
const config = {serviceConfig, defaultLogConfig};

const service = new service.SumologicService(config);
```

#### Loggly (see https://www.loggly.com/)

```javascript
//Configuration for communication with Loggly.
//Url should be taken from the logger's source category configuration page.
const serviceConfig = {
    // this should be the url for **bulk** log sending
    url: "https://logs-01.loggly.com/bulk/<customertoken>/tag/bulk/",
    method: "POST"
};

//Default log configuration.
//It is used like a template with default values for each new log.
//Can be of any structure. It will be shallowly copied during creation of a new log record.
const defaultLogConfig = {
    UserAgent: window.userAgent,
    BuildVersion: 123,
    Platform: "browser",
    Severity: "DEBUG",
    Data: "",
    Timestamp: "",
    Message: "",
    Category: ""
};

//general config
const config = {serviceConfig, defaultLogConfig};

const service = new service.LogglyService(config);
```

#### Elastic Search Service (see https://docs.aws.amazon.com/elasticsearch-service/latest/developerguide/es-gsg-upload-data.html)

Logger supports sending data to Elasticsearch service endpoint. It was tested on AWS-based instance of Elasticsearch and Kibana. Ideally, it should work also on instance of any other cloud provider.

```javascript
//Configuration for communication with Elastic Search.
//Url should be taken from the logger's source category configuration page.
const serviceConfig = {
    // this should be the url for **bulk** log sending
    url: "https://<endpoint_url>/_bulk",
    method: "POST",
    //this field will be used to send index value in meta information for each log
    logMetaIndexField: "IndexField"
};

//Default log configuration.
//It is used like a template with default values for each new log.
//Can be of any structure. It will be shallowly copied during creation of a new log record.
const defaultLogConfig = {
    BuildVersion: 123,
    Platform: "browser",
    Severity: "DEBUG",
    Data: "",
    Timestamp: "",
    Message: "",
    IndexField: "web-app"
};

//general config
const config = {serviceConfig, defaultLogConfig};

const service = new service.ElasticsearchService(config);
```

#### Custom serializer

There are situations when you need a "special" representation of logs instead of JSON before sending them to remote storage. For example, key-value pairs:

```
[Timestamp=1234567890] [Message="test message"] [Category="MyController"]
```

In order to serialize logs in your own way, you can use ```serializer``` configuration with services:

```javascript
const serializer = logObject =>
    Object.keys(logObject)
        .map(key => `[${key}=${JSON.stringify(logObject[key])}]`)
        .join(" ");

const configWithSerializer = {serviceConfig, defaultLogConfig, serializer};
const testLogs = [
    {test: "test123"},
    {test: "test321"}
];

service = new LogglyService(configWithSerializer);
```

#### Custom implementation of service

TODO

## Development

### Build and debugging

In order to run full build of all bundles run:
```
npm run build
```

This script will create all types of build:
* browser compressed
* browser debugging
* nodejs compressed (do we need it? :) )
* nodejs debugging

Also, you can run a specific build for each platform separately:
```
npm run build-prod-browser
npm run build-prod-node
npm run build-dev-browser
npm run build-dev-node
```

For debugging purposes it should be convenient to use the watch mode:

```
npm run watch-prod-browser
npm run watch-prod-node
npm run watch-dev-browser
npm run watch-dev-node
```

### Running tests

In order to run unit tests run:

```
npm run test
```

In order to run unit tests with coverage run:

```
npm run coverage
```

It will build a beautiful code coverage report which you can check by running html file ```coverage/lcov-report/index.html```.

### Deployment

Please, find the ```.travis.yml``` file for the library lifecycle: install -> test -> build -> sonar analysis -> deploy.

In order to deploy a new version, you need to run:

```
npx standard-version
```

This command bumps up the library version in all required files, builds the changelog and makes a new commit with a "version" tag. Using this tag travis will assemble and deploy the npm package.

 **Please note**, that releasing happens only from master branch for each tagged commit.

### Git workflow

#### Commits

Commits should follow the "conventional commit" agreement. It will be validated by Husky plugin on pre-commit git hook.

#### Branches and pull requests

Feel free to do anything you want in branches. All final commits should be rebased and clean. Please, create pull request for delivering your changes to master. All PR checks should be green. All sonar suggestions should be resolved and/or discussed if not applicable.

## Thanks to

creators of https://github.com/DxCx/ts-library-starter. Their repository was used as a start point for the library
