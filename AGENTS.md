# AGENTS.md

Guidance for AI coding assistants working in this repository.

## What this project is

**[advanced-logger](https://www.npmjs.com/package/advanced-logger)** — an isomorphic TypeScript logging library for Node.js and browsers. It batches and ships arbitrary log objects to remote endpoints using pluggable **strategies** (when to send) and **services** (where to send).

- **Docs site (separate repo):** https://www.advancedlogger.com — [AlexeyPopovUA/advanced-logger-guide](https://github.com/AlexeyPopovUA/advanced-logger-guide)
- **Package:** ES2015 bundles for Node and browser; **axios** is a required peer dependency (not bundled)
- **License:** MIT

## Architecture

```
log() → LogStore.add() → "add" event → IStrategy.onAdd()
                                              ↓
                                    strategy emits "send"
                                              ↓
                         AdvancedLogger.onSend() → LogStore.getAll/clear
                                              ↓
                              IService.sendAllLogs(logs) → HTTP (axios)
```

| Concept | Role |
|---------|------|
| `AdvancedLogger` | Wires store, strategy, and service via `EventEmitter` |
| `LogStore` | In-memory buffer; optional rapid-fire grouping (`TransformationEnum`) |
| `IStrategy` | Decides **when** to emit `send` (`Instant`, `OnRequest`, `OnInterval`, `OnBundleSize`) |
| `IService` | Decides **how** to serialize and POST logs (`Sumologic`, `Loggly`, `Elasticsearch`, `Console`, or custom) |

Public API is exported from `src/index.ts` as `AdvancedLogger`, `strategy`, `service`, and `TransformationEnum`.

## Repository layout

| Path | Purpose |
|------|---------|
| `src/AdvancedLogger.ts` | Main facade |
| `src/LogStore.ts` | Buffer + grouping transformations |
| `src/strategy/` | Send-timing implementations |
| `src/service/` | Remote/console sinks; `BaseRemoteService` for HTTP backends |
| `src/interface/` | Contracts and config types (`ILoggerConfig`, `IServiceConfig`, etc.) |
| `src/util/` | `http` (axios wrapper), `LogUtils` (stringify, log identity) |
| `src/enums/` | `TransformationEnum` |
| `__tests__/` | Jest specs (`*.spec.ts`) |
| `build-scripts/` | Webpack configs (node + browser, prod + debug) |
| `example/node/`, `example/browser/` | Runnable usage samples |
| `dist/` | Build output (generated; do not edit by hand) |

Entry points: `main-node.js` / `main-browser.js` load prod or debug bundles from `dist/`.

## Commands

```bash
npm ci              # install (CI uses this)
npm run type-check  # tsc --noEmit
npm test            # Jest unit tests
npm run coverage    # Jest with coverage (SonarCloud on master)
npm run build       # webpack: node + browser, prod + dev
npm run build-prod  # production bundles only
npm run bundlesize  # size limits (bundlesize.config.js)
```

**Verify changes:** `npm run type-check` → `npm test` → `npm run build` (or `build-prod` if only shipping artifacts).

CI (`.github/workflows/`): feature branches run type-check, test, and full build on Node 18; `master` also runs coverage and SonarCloud on Node 16.

## Extending the library

### Custom service

Extend `BaseRemoteService` and override as needed:

- `preparePayload(logs)` — batch format (default: newline-joined serialized lines)
- `serializer(log)` — per-log encoding (default: safe JSON via `LogUtils` / `fast-safe-stringify`)
- `getHeaders()` — request headers

See `example/node/custom-http-service.js`.

### Custom strategy

Implement `IStrategy`: expose `eventEmitter`, implement `onAdd`, `onClear`, `sendAll`, and `destroy`. Emit `"send"` on `eventEmitter` when logs should flush. Call `sendAll()` from `AdvancedLogger.sendAllLogs()` for on-request behavior.

### Logger config

```typescript
new AdvancedLogger({
  service: new service.SumologicService(serviceConfig),
  strategy: new strategy.OnRequestStrategy(),
  transformations: [/* optional LogStore transforms */],
});
```

Log shape is generic (`T extends IDefaultLogConfig`); the library does not require `severity` or `message` fields.

## Code conventions

- **TypeScript** with `strict: true`; compile target **ES2015** (consumers on old runtimes must transpile/polyfill)
- **Default exports** for classes; barrel re-exports in `src/index.ts`
- **Event-driven** coordination — prefer emitting/listening over tight coupling
- **Lifecycle:** call `destroy()` on loggers in tests (`afterEach`) to clear timers and listeners
- **Commits:** [Conventional Commits](https://www.conventionalcommits.org/) via commitlint (`@commitlint/config-conventional`)
- **Releases:** `npm run release` (standard-version); version script updates `sonar-project.properties`

Match existing style: minimal comments, lodash for throttle/debounce where already used, no new abstractions unless the change needs them.

## Testing

- Specs live in `__tests__/**/*.spec.ts`, matched by `testRegex` in `jest.config.js`
- Mock `src/util/http` for remote services; use `TestUtils.wait()` for async strategy timing
- Always `logger.destroy()` in `afterEach` for strategies with intervals/throttles

## What to change where

| Task | Where to edit |
|------|----------------|
| Public exports | `src/index.ts` |
| Send timing | `src/strategy/` + `__tests__/strategy/` |
| Endpoint / payload | `src/service/` + `__tests__/service/` |
| Buffering / grouping | `src/LogStore.ts`, `src/enums/TransformationEnum.ts` |
| HTTP retries / requests | `src/util/http.ts` |
| User-facing examples | `example/` (and docs repo for site copy) |
| Bundle / dual build | `build-scripts/` |

Do **not** put Gatsby or website content in this repo — that belongs in **advanced-logger-guide**.

## Pitfalls

- **axios** must be installed by consumers (`peerDependencies`); tests mock `http`, not axios directly
- Clearing `LogStore` happens **before** `sendAllLogs` resolves — failed sends do not restore buffered logs
- Browser and Node share `src/`; avoid Node-only APIs without guards if used in shared code paths
- `dist/` and generated `.d.ts` come from build — edit `src/` only
- Sonar coverage excludes `__tests__`; keep meaningful tests under `src/**/*.ts` paths

## Related repositories

| Repo | Purpose |
|------|---------|
| [advanced-logger](https://github.com/AlexeyPopovUA/advanced-logger) (this) | Library source |
| [advanced-logger-guide](https://github.com/AlexeyPopovUA/advanced-logger-guide) | Documentation website |
