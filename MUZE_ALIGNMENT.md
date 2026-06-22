# Muze alignment: assert

> Initial alignment roadmap. It is intended as a practical maintenance document, not as a complete code audit.

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

assert is likely a good Muze utility if it stays tiny, optional, and focused. The alignment work is to ensure it remains a development/debugging aid and does not turn into a validation framework or runtime dependency burden.

## Strengths

- Small, focused utility concept.
- Optional assertion checking can improve correctness without imposing a large framework.
- A tiny assertion helper can make examples clearer and failures easier to debug.

## Alignment issues

### 1. Clarify intended runtime role

**Principle:** Small, single-concern libraries.

**Problem:** The phrase “lightweight optional assertion checking” needs precise semantics: development only, production optional, or always-on?

**Why it matters:** Users should know whether assertions affect runtime behavior, bundle size, and error handling.

**Suggested direction:** Document when to use it, whether it can be stripped/disabled, and whether libraries should depend on it in production.

**Status:** Open

### 2. Avoid becoming a validation/schema library

**Principle:** Simplicity over completeness.

**Problem:** Assertion libraries often grow into type checking, schemas, contracts, and validators.

**Why it matters:** That would cross a conceptual boundary and compete with more specialized tools.

**Suggested direction:** Write non-goals: no schema language, no form validation, no parser validation framework. Keep it to assertions.

**Status:** Open

### 3. Document dependency policy for other Muze libraries

**Principle:** Replaceability and stable APIs.

**Problem:** Several packages may depend on assert. If so, the dependency should remain tiny and replaceable.

**Why it matters:** A shared utility can become a hidden ecosystem dependency.

**Suggested direction:** Add guidance: when Muze libraries may use assert, how users can disable it, and what public errors look like.

**Status:** Open

## Open questions

- Should Muze libraries expose assertion errors publicly or convert them to domain-specific errors?
- Should assertions be removable from production builds without a build step?
- Is this a public package or primarily internal infrastructure?

## Non-goals

- Do not become a type system.
- Do not become a validation framework.
- Do not make production behavior depend on complex assertion configuration.

## Review cadence

Review this document before feature work, before releases, and whenever the public API or dependency surface changes. Close issues by changing their status to `Done` and leaving a short note about the decision.
