# Next.js 16.4.x: passing diagnostic scaffold for a reported `/_global-error` build crash

**This is a passing diagnostic scaffold, not a confirmed failing reproduction.**
The error below and the matrix/logs are historical observations from an earlier
session with a private production app. They were not rerun for this documentation
correction, and independently authenticated raw original captures are not
available here. The trigger and root cause remain **UNISOLATED**; a Next.js
framework defect has not been proven.

```
Error occurred prerendering page "/_global-error". Read more: https://nextjs.org/docs/messages/prerender-error
TypeError: Cannot read properties of null (reading 'useContext')
    at ignore-listed frames {
  digest: '1339301996'
}
Export encountered an error on /_global-error/page: /_global-error, exiting the build.
```

## Summary

Earlier production-app notes report failures during static generation while
prerendering `/_global-error` on Next **16.4.1** and **16.4.3**. The archived
excerpts record `TypeError: Cannot read properties of null (reading 'useContext')`
in ignore-listed frames. The abridged `--debug-prerender` excerpt also records an
**"Invalid hook call"** and React "unique key" warnings mentioning
`<__next_viewport_boundary__>`, `<head>`, `<meta>` and `<div>`. These observations
do not isolate a metadata/viewport or React dispatcher cause.

The notes describe roughly 15 or more generate attempts across diagnostic states,
with one green result (2/2 pages), followed by two crashes for a state recorded as
unchanged with a clean dist directory. These are historical session observations,
not freshly controlled repetitions or a measured, standardized failure rate.

## What this repository is

This repo is a **from-scratch diagnostic scaffold** with a similar, not identical,
root layout, substitute providers, and proxy/Tailwind scaffolding. It omits private
business code and does not establish source or configuration parity with the
affected production app.

- Earlier notes record **about 11 green builds across incremental scaffold
  states**, not 11 proven repetitions of one identical final state. No failing
  build of this scaffold has been established, and the observations do not
  isolate an app-surface or machine-state trigger.
- `logs/production-crash.log` contains an archived diagnostic excerpt/transcription;
  `logs/debug-prerender.log` is explicitly **abridged**. Neither is presented as a
  complete, independently authenticated raw capture. Raw provenance has not been
  reverified.

## Historical production-app commands (not a failing scaffold reproduction)

The earlier session recorded these phase-separated commands for the private app:

```bash
npx next build --experimental-build-mode compile   # historically recorded exit 0
npx next build --experimental-build-mode generate  # historically failed at /_global-error
```

These are historical outcomes, not a current guarantee or a measured failure
frequency. Earlier scaffold builds were green; the commands do not constitute
a demonstrated failing public reproduction.

## Historical evidence matrix (production app)

Earlier session notes describe a fresh compile before generating each state
below. The labels retain those historical observations; the matrix was not
rerun or independently authenticated as a controlled reproduction:

| Root layout `export const metadata` | `export const viewport` | Manual hoisted `<title>/<meta>` | Custom `global-error.tsx` | Result |
|---|---|---|---|---|
| yes | yes | — | yes | **CRASH** |
| yes | yes | — | no | **CRASH** |
| no  | no  | — | yes | **CRASH** |
| no  | yes | — | no | **CRASH** |
| no  | yes | yes | yes | **CRASH** |
| no  | yes | yes | no | **CRASH** |
| no  | yes | no  | no | **GREEN once**, then **CRASH on re-test** (recorded as unchanged source, clean dist dir) |

Additional historical controls reported as still crashing: clean/isolated dist directory
(`SHTORA_E2E=1` → `.next-e2e`, no dev server running), Next **16.4.1 → 16.4.3**
upgrade (including the `Avoid loading standalone React in server bootstrap`
backports), webpack vs Turbopack both fail.

Digest lineage recorded in earlier notes: `4044437173` / `2334139114` (16.4.1) →
`1322144938` (16.4.3) → `1339301996` (reported across multiple 16.4.3 code
states) → `1259413171` (clean `.next-e2e`).

## Historical `--debug-prerender` observations

The abridged excerpt in `logs/debug-prerender.log` records "unique key" warnings
before the error:

```
Each child in a list should have a unique "key" prop.
Check the top-level render call using <__next_viewport_boundary__>. ...
Each child in a list should have a unique "key" prop.
Check the top-level render call using <div>. ...
Each child in a list should have a unique "key" prop.
Check the top-level render call using <meta>. ...
Each child in a list should have a unique "key" prop.
Check the top-level render call using <head>. ...
Error occurred prerendering page "/_global-error". ...
TypeError: Cannot read properties of null (reading 'useContext')
    at ignore-listed frames { digest: '2546962125' }
```

The excerpt also records an **"Invalid hook call"**. Warning order and the
`useContext` error do not establish a causal path. Metadata/viewport hoisting
and React dispatcher explanations remain **UNISOLATED hypotheses**, not a
confirmed root cause or proof of a Next.js framework fault.

## Workaround

`next build --experimental-build-mode compile` is retained as a diagnostic
workaround historically recorded as green. It skips the normal TypeScript app
gate and static generation/finalization: **it is not a finalized or
production-ready build**, even if all app routes are dynamic. The private app's
root layout was described as using `export const dynamic = "force-dynamic"`
for per-request CSP nonces; that does not waive build finalization.

A normal finalized production build and separate typecheck remain gates.
OpenNext builds using the package build script inherit its compile-only
limitation unless overridden. This scaffold and its logs do not certify
deployment readiness.

## Environment and parity limits

- Historical private-app session: Windows, Next.js 16.4.1 and 16.4.3,
  Turbopack and webpack, Bun 1.4.2. Notes reported a single deduped React /
  react-dom 19.3.1 copy via `npm ls`; that check was not rerun here.
- Other reports describe other environments; they do not establish the same
  trigger or cause (see related reports).

The audited version comparison is not complete environment parity:

| Dependency | Diagnostic scaffold | Main app lockfile |
|---|---|---|
| Next.js | 16.4.3 | 16.4.3 |
| React / react-dom | 19.3.1 | 19.3.1 |
| OpenNext Cloudflare | 1.20.3 | 1.20.12 |
| Wrangler | 4.152.0 | 4.151.1 |

- This scaffold: `bun install` then `npx next build`; copy
  `.dev.vars.example` to `.dev.vars` first (dummy value, required because
  `initOpenNextCloudflareForDev()` runs at config load).
  This setup guidance does not turn the passing scaffold into a failing
  reproduction; no install or build was run for this documentation correction.

## Reporting status

Reports [#100707](https://github.com/vercel/next.js/issues/100707) and
[#100708](https://github.com/vercel/next.js/issues/100708) remain closed/locked
for reproduction-link validation, **not because the reported crash was resolved**.
No third report was found in the reporting audit.

The [Next.js bug-report template](https://github.com/vercel/next.js/blob/canary/.github/ISSUE_TEMPLATE/1.bug_report.yml)
requires a human-written/created external issue description and an actual failing
public minimal reproduction. Any future report must be independently written and
submitted by a human under those rules, with a failing reproduction; this passing
scaffold is insufficient. Repository documentation updates do not authorize issue
publication, and no autonomous third filing is planned or authorized.

## Related reports

- Discussion [#94667](https://github.com/vercel/next.js/discussions/94667) —
  similar error; `--debug-prerender` diagnostics were requested.
- Issues [#99265](https://github.com/vercel/next.js/issues/99265),
  [#95741](https://github.com/vercel/next.js/issues/95741),
  [#86178](https://github.com/vercel/next.js/issues/86178), and
  [#84994](https://github.com/vercel/next.js/issues/84994) — reports of similar
  `/_global-error` failures, not proof of a shared cause or a failing reproduction
  in this scaffold. Earlier notes associate #99265 with a bare-layout report on
  macOS and digest `2268147081`; that attribution was not reverified here.
- Issue [#85604](https://github.com/vercel/next.js/issues/85604) — related report
  involving the internal `/_not-found` route.
