# Muze alignment: assert

> Maintenance alignment review. It is intended as a practical product/API document, not as a complete code audit.

## Muze design principles

Muze builds web software for technically curious non-professional programmers, without making the tools unattractive to professionals.

We prefer:

- simplicity over completeness
- small, decoupled, single-concern libraries
- correct abstractions that do not cross conceptual boundaries
- browser-native standards where possible
- lightweight abstractions only when they make developer code simpler
- stable, long-term APIs
- components and frameworks that are easy to adapt or replace
- standards-based or open-source hosting stacks that avoid lock-in
- software small enough to work well on slow devices and connections
- a view-source philosophy: invite developers to look under the hood and learn

When making tradeoffs, prefer composability, replaceability, web-platform alignment, and long-term simplicity over convenience, popularity, or feature completeness.


## Muze package namespace policy

The `@muze-nl` npm namespace should be a trust signal. Packages published there should be close to production-ready: the public API is expected to be stable, the package can be installed and used by a fresh project, and the README should be clear about supported usage.

Experimental libraries should use the `@muze-labs` namespace until they are mature enough to carry the main Muze production-readiness signal. Moving from `@muze-labs` into `@muze-nl` should be treated as a release-readiness decision, not only a naming cleanup.

## Current assessment

Assert is a good Muze utility in its current shape. It is small, inspectable, and focused on optional runtime assertions rather than general validation. The recent split between `src/assert-core.mjs` and `src/assert.mjs` improves alignment significantly: `@muze-nl/assert/core` is side-effect-free and tree-shakeable, while the package root keeps the older `globalThis.assert` compatibility behavior.

The main alignment work has shifted from "make the role clear" to "keep the boundary clear". Assert should remain a developer-facing contract/debugging aid, with `fails()` and `issues()` available for explicit always-on checks, and should avoid drifting into a schema language, form validator, or security validation layer.

## Current state snapshot

- Public package: `@muze-nl/assert`
- Side-effect-free entry: `@muze-nl/assert/core`
- Compatibility entry: `@muze-nl/assert`, which assigns the API to `globalThis.assert`
- Runtime default: `assert()` checks are disabled until `enable()` is called
- Always-on APIs: `fails()` and `issues()`
- Documentation shape: general README, tutorial in `docs/tutorial.md`, reference docs in `docs/reference/`
- Package metadata: `exports` map, `sideEffects` limited to `./src/assert.mjs`, `/docs` included in published files

## Strengths

- Small, focused utility concept.
- Optional assertion checking can improve correctness without imposing a large framework.
- The core entry point has no global side effects and works well with tree-shaking.
- The compatibility entry preserves browser/global usage for existing consumers.
- Path-aware `issues()` plus `formatIssue()`/`formatIssues()` improves error reporting without requiring consumers to parse text.
- Tutorial and reference docs now separate learning material from API lookup.

## Alignment issues and decisions

### 1. Clarify intended runtime role

**Principle:** Small, single-concern libraries.

**Original problem:** The phrase “lightweight optional assertion checking” needed precise semantics: development only, production optional, or always-on?

**Why it matters:** Users should know whether assertions affect runtime behavior, bundle size, and error handling.

**Decision:** Done. The README and tutorial now explain that `assert()` is disabled by default, becomes active after `enable()`, and is intended primarily for development-time contracts. They also distinguish always-on `fails()`/`issues()` from optional `assert()`.

**Status:** Done

### 2. Avoid becoming a validation/schema library

**Principle:** Simplicity over completeness.

**Original problem:** Assertion libraries often grow into type checking, schemas, contracts, and validators.

**Why it matters:** That would cross a conceptual boundary and compete with more specialized tools.

**Decision:** Mostly done. The tutorial explicitly says Assert is not a security boundary and not a substitute for validating untrusted input. The API remains compact and function-based. The current reference docs still describe enough pattern behavior that users could treat it like a tiny validation DSL, so this remains a boundary to guard in future feature work.

**Status:** Done, monitor during feature work

### 3. Document dependency policy for other Muze libraries

**Principle:** Replaceability and stable APIs.

**Original problem:** Several packages may depend on assert. If so, the dependency should remain tiny and replaceable.

**Why it matters:** A shared utility can become a hidden ecosystem dependency.

**Decision:** Partly done. The docs now explain disabled-by-default behavior, the pure core entry, and the reporting APIs. This is enough for package consumers, but not yet a full Muze ecosystem policy.

**Remaining work:** Add a short Muze-internal policy before another Muze package adopts Assert as a dependency: use `@muze-nl/assert/core`, keep `assert()` checks optional, and convert assertion failures to domain-specific errors before exposing them as public API responses.

**Status:** Partly done

### 4. Keep entry point semantics clear

**Principle:** Correct abstractions that do not cross conceptual boundaries.

**Problem:** The package now has two valid entry points with different side-effect behavior.

**Why it matters:** A consumer choosing the wrong entry point may accidentally install a global or miss the tree-shakeable path.

**Decision:** The README, tutorial, package `exports`, and `sideEffects` metadata now describe the split. The root entry is a compatibility convenience; `@muze-nl/assert/core` is the preferred modern library entry.

**Status:** Done, but keep testing both entry points

### 5. Keep generated browser distribution aligned

**Principle:** Stable, long-term APIs and view-source simplicity.

**Problem:** The published package includes `dist/`, and the CDN documentation points at `dist/assert.min.js`. When source entry points change, generated browser files can drift if the build step is not run before release.

**Why it matters:** Browser/CDN users should get the same current API and compatibility global as module users.

**Suggested direction:** Before release, run the build and verify `dist/assert.min.js` still exposes the root compatibility behavior. Consider adding a release checklist or a test that imports the bundled file if browser distribution remains supported.

**Status:** Open

## Open questions

- Should Muze libraries expose assertion errors publicly, or always convert them to domain-specific errors?
- Should the compatibility root entry remain indefinitely, or eventually be documented as legacy in favor of `@muze-nl/assert/core`?
- Should release checks verify the generated `dist/` bundle, or should browser bundles move to a separate documented build artifact policy?
- Is Node `>=20` the intended long-term floor for this small utility, or should the support target be reviewed before a stable release?
- Should `@muze-nl/assert` graduate from Development project stage, and if so what release-readiness checklist is required?

## Non-goals

- Do not become a type system.
- Do not become a validation framework.
- Do not make production behavior depend on complex assertion configuration.
- Do not add a build-time transform requirement for normal use.
- Do not require consumers to use the global compatibility entry.

## Release-readiness notes

- The package is public and installable, with an `exports` map and included documentation.
- The project still advertises Development stage. That is appropriate until the current API split, docs layout, and browser bundle behavior have been released and exercised.
- Before a release, verify:
  - `npm test`
  - `npm pack --dry-run`
  - build output in `dist/`
  - import from `@muze-nl/assert/core` leaves globals untouched
  - import from `@muze-nl/assert` installs `globalThis.assert`

## Review cadence

Review this document before feature work, before releases, and whenever the public API or dependency surface changes. Close issues by changing their status to `Done` and leaving a short note about the decision.
