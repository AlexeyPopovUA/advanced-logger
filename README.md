# advanced-logger

[![Feature branch build](https://github.com/AlexeyPopovUA/advanced-logger/actions/workflows/feature-branch-build.yml/badge.svg)](https://github.com/AlexeyPopovUA/advanced-logger/actions/workflows/feature-branch-build.yml)
[![npm version](https://badge.fury.io/js/advanced-logger.svg)](https://badge.fury.io/js/advanced-logger)
[![install size](https://packagephobia.now.sh/badge?p=advanced-logger)](https://packagephobia.now.sh/result?p=advanced-logger)
[![](https://data.jsdelivr.com/v1/package/npm/advanced-logger/badge)](https://www.jsdelivr.com/package/npm/advanced-logger)


[![Quality checks](https://github.com/AlexeyPopovUA/advanced-logger/actions/workflows/quality-checks.yml/badge.svg)](https://github.com/AlexeyPopovUA/advanced-logger/actions/workflows/quality-checks.yml)
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


[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FAlexeyPopovUA%2Fadvanced-logger.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2FAlexeyPopovUA%2Fadvanced-logger?ref=badge_shield)

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

The package ships dual **ESM** (`dist/index.mjs`) and **CommonJS** (`dist/index.cjs`) builds plus a self-contained
browser **IIFE** global (`dist/index.global.js`), with type declarations (`dist/index.d.ts`). HTTP uses the platform's
native `fetch`, so there are no runtime dependencies on `axios`.

:robot: NodeJS - developed and tested on Node.js 24 (see `.mise.toml`); requires Node.js 18+ for global `fetch`.

:globe_with_meridians: Browser - all latest browsers (native `fetch` + ES2015).

## [Documentation](https://advancedlogger.com "Advanced Logger's Homepage")

Complete documentation and examples can be found here:

**[Advanced Logger's Homepage](https://advancedlogger.com "Advanced Logger's Homepage")**

**[NPM package link](https://www.npmjs.com/package/advanced-logger "NPM package link")**

### Simplest usage

Now, the boring part :nerd_face:

#### Installation

The library has no peer dependencies - it uses the runtime's native `fetch`.

As a dependency in a npm project:

```shell
npm i --save advanced-logger
```

```javascript
// ESM (recommended)
import {AdvancedLogger, service, strategy, TransformationEnum} from 'advanced-logger';

// CommonJS
const {AdvancedLogger, service, strategy} = require('advanced-logger');
```

The API is exported as top-level named exports. In browsers via script tag, the same API is exposed on
`window.advancedLogger` (see below).

As script tags with CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/advanced-logger@latest/dist/index.global.js"></script>
```

#### Configuration

Lets initiate a logger that sends all logs instantly to Sumologic service.

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

## Development

Requires **Node.js 24+** (see [`.mise.toml`](.mise.toml) / [`.nvmrc`](.nvmrc)).

```bash
mise install          # optional: install Node via mise
npm ci
npm run type-check
npm test              # unit tests (import from src/, mock http)
npm run test:integration  # build dev bundles + Node/browser runtime tests
npm run test:all      # unit + runtime
npm run build
npm run coverage      # unit tests with coverage (CI on master)
```

The library is bundled with [tsup](https://tsup.egoist.dev/) (see [`tsup.config.ts`](tsup.config.ts)) into ESM, CJS,
type declarations, and a browser IIFE global.

**Jest 30** runs two projects (see [`jest.config.js`](jest.config.js)):

| Project | What it checks |
|---------|----------------|
| `unit` | Source-level specs under `__tests__/` |
| `runtime` | Built artifacts: Node via `dist/index.cjs`, browser IIFE via jsdom + `window.advancedLogger` |

CI runs unit tests, full build, then runtime integration on every branch.

Contributor notes for AI-assisted work: [`AGENTS.md`](AGENTS.md).

### Upgrading between breaking changes

#### 3.x to 4.x

* `axios` is no longer required. The library now uses the platform's native `fetch`, so you can remove `axios` from
your dependencies (and the `<script>` tag in browsers). This requires Node.js 18+ or a modern browser.
* The API is now exposed as top-level named exports. Replace `require('advanced-logger').advancedLogger` with
`require('advanced-logger')` (or `import {AdvancedLogger, service, strategy} from 'advanced-logger'`). The browser
`window.advancedLogger` global is unchanged.
* Non-2xx HTTP responses now reject (previously surfaced via axios) - this keeps the retry-on-failure behavior.
* CDN script path changed to `dist/index.global.js`.

#### 2.x to 3.x

* Install axios to your project or just keep using it if it is already installed
* Logger is compiled to ES2015 JS target. If your project requires support of old browsers and nodejs, please,
make sure that you transpile and add necessary pollyfills to the build
