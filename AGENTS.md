# AGENTS.md

Guidance for AI coding assistants working in this repository.

## What this project is

**[advanced-logger](https://www.npmjs.com/package/advanced-logger)** — an isomorphic TypeScript logging library for Node.js and browsers. It batches and ships arbitrary log objects to remote endpoints using pluggable **strategies** (when to send) and **services** (where to send).

- **Docs site (separate repo):** https://www.advancedlogger.com — [AlexeyPopovUA/advanced-logger-guide](https://github.com/AlexeyPopovUA/advanced-logger-guide)
- **Package:** ES2015 bundles for Node and browser; **axios** is a required peer dependency (not bundled)
- **Node.js:** 24 (via [mise](https://mise.jdx.dev/) — see `.mise.toml` and `.nvmrc`)
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
mise install        # Node 24 from .mise.toml
npm ci              # install (CI uses this)
npm run type-check  # tsc --noEmit
npm test            # Jest unit tests (src/, http mock)
npm run test:integration  # built bundles: Node entry + browser UMD (needs dev build)
npm run test:all    # unit + runtime integration
npm run coverage    # Jest with coverage (SonarCloud on master)
npm run build       # webpack: node + browser, prod + dev
npm run build-prod  # production bundles only
npm run bundlesize  # bundle size limits (after full build; see bundlesize.config.js)
```

**Verify changes:** `npm run type-check` → `npm test` → `npm run build` → `npx jest --selectProjects runtime` (or `npm run test:all`).

CI (`.github/workflows/`): all workflows use Node 24. Feature branches run type-check, unit tests, full build, then runtime integration; `master` also runs coverage, build, runtime tests, and SonarCloud.

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

- **Jest 30** projects in `jest.config.js`: `unit` (default) and `runtime`
- **Unit** (`npm test`): import from `src/`; mock `src/util/http`; specs in `__tests__/` except `integration/runtime/`
- **Runtime integration** (`npm run test:integration`): loads webpack output — Node via `main-node.js` → `.advancedLogger`, browser via UMD + `window.advancedLogger` (jsdom); mock `axios` (peer dep)
- Shared runtime scenarios: `__tests__/integration/runtime/scenarios.ts`
- Source-level integration: `__tests__/integration/logger.spec.ts`; helpers in `__tests__/helpers/`
- Prefer **behavior** assertions (flush timing, payloads, headers, retries) over export/constructor smoke tests
- Always `logger.destroy()` in `afterEach` when using strategies with intervals/throttles

## What to change where

| Task | Where to edit |
|------|----------------|
| Public exports | `src/index.ts` |
| Send timing | `src/strategy/` + `__tests__/integration/logger.spec.ts` |
| Endpoint / payload | `src/service/` + `__tests__/service/` |
| Buffering / grouping | `src/LogStore.ts`, `src/enums/TransformationEnum.ts` |
| HTTP retries / requests | `src/util/http.ts` |
| User-facing examples | `example/` (and docs repo for site copy) |
| Bundle / dual build | `build-scripts/` |

Do **not** put Gatsby or website content in this repo — that belongs in **advanced-logger-guide**.

## Pitfalls

- **mise:** run `mise trust` once in the repo root if mise refuses to load `.mise.toml`
- **axios** must be installed by consumers (`peerDependencies`); unit tests mock `src/util/http`, runtime tests mock `axios`
- **Package export:** built bundles expose the API as `require('advanced-logger').advancedLogger` (Node) or `window.advancedLogger` (browser script tag)
- **bundlesize:** run after a full `npm run build` (all four `dist/` artifacts); `build-prod` alone is not enough
- Clearing `LogStore` happens **before** `sendAllLogs` resolves — failed sends do not restore buffered logs
- Browser and Node share `src/`; avoid Node-only APIs without guards if used in shared code paths
- `dist/` and generated `.d.ts` come from build — edit `src/` only
- Sonar coverage excludes `__tests__`; keep meaningful tests under `src/**/*.ts` paths

## Related repositories

| Repo | Purpose |
|------|---------|
| [advanced-logger](https://github.com/AlexeyPopovUA/advanced-logger) (this) | Library source |
| [advanced-logger-guide](https://github.com/AlexeyPopovUA/advanced-logger-guide) | Documentation website |
