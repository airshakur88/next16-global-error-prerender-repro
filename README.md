# Next.js 16.4.x: `next build` crashes prerendering `/_global-error`

```
Error occurred prerendering page "/_global-error". Read more: https://nextjs.org/docs/messages/prerender-error
TypeError: Cannot read properties of null (reading 'useContext')
    at ignore-listed frames {
  digest: '1339301996'
}
Export encountered an error on /_global-error/page: /_global-error, exiting the build.
```

## Summary

During the static-generation phase of `next build`, Next.js 16.4.x crashes while
prerendering the framework-synthesized `/_global-error` route. The crash is a
`TypeError: Cannot read properties of null (reading 'useContext')` thrown from
inside ignore-listed (framework) frames. With `--debug-prerender` the failure
surfaces as an **"Invalid hook call"** — a React hook running with a null
dispatcher — immediately preceded by repeated React "unique key" warnings
pointing at `<__next_viewport_boundary__>`, `<head>`, `<meta>` and `<div>`.

Verified on Next **16.4.1** and **16.4.3** (latest stable at time of writing).
Upgrading does not fix it. The bug is **nondeterministic**: across ~15+
generate runs of the affected production app, exactly one completed green
(2/2 pages) — and re-running the *identical* source state that produced that
green run crashed again (twice, on a clean dist directory).

## What this repository is

This repo is a **from-scratch minimal scaffold** mirroring the structure of
the affected production app (same root layout shape, same providers, same
proxy, same Tailwind 4 setup). It is published as **diagnostic evidence**:

- **This scaffold does NOT crash** on the reporter's machine (~11 consecutive
  green `next build` runs), which narrows the trigger to an app-surface /
  machine-state interaction that we could not isolate to a single variable.
- `logs/` contains the **verbatim crash output from the production app**
  (`logs/production-crash.log`) and the full `--debug-prerender` output
  (`logs/debug-prerender.log`).

The affected production app is private; this scaffold contains everything we
were able to copy out of it (structure, styling, provider tree, proxy, config)
without business code.

## Reproducing the production crash

The production app crashes during the generate phase, which can be exercised
in isolation:

```bash
bun install
npx next build --experimental-build-mode compile   # compiles fine (exit 0)
npx next build --experimental-build-mode generate  # crashes at /_global-error
```

On the affected machine this fails ~95% of runs with the error shown at the
top of this README. The scaffold in this repo runs the same two commands
**green**.

## Evidence matrix (production app)

Every one of these states was built with a fresh compile before generating:

| Root layout `export const metadata` | `export const viewport` | Manual hoisted `<title>/<meta>` | Custom `global-error.tsx` | Result |
|---|---|---|---|---|
| yes | yes | — | yes | **CRASH** |
| yes | yes | — | no | **CRASH** |
| no  | no  | — | yes | **CRASH** |
| no  | yes | — | no | **CRASH** |
| no  | yes | yes | yes | **CRASH** |
| no  | yes | yes | no | **CRASH** |
| no  | yes | no  | no | **GREEN once**, then **CRASH on re-test** (identical source state, clean dist dir) |

Additional controls, all still crashing: clean/isolated dist directory
(`SHTORA_E2E=1` → `.next-e2e`, no dev server running), Next **16.4.1 → 16.4.3**
upgrade (including the `Avoid loading standalone React in server bootstrap`
backports), webpack vs Turbopack both fail.

Digest lineage observed: `4044437173` / `2334139114` (16.4.1) →
`1322144938` (16.4.3) → `1339301996` (stable across 16.4.3 code states) →
`1259413171` (clean `.next-e2e`).

## `--debug-prerender` findings

Immediately before the crash, React prints repeated "unique key" warnings
(full log in `logs/debug-prerender.log`):

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

Under `--debug-prerender` the underlying failure is an **"Invalid hook call"** —
strongly suggesting a hook executing with a null React dispatcher while the
framework synthesizes the error document (metadata/viewport hoisting path).

## Workaround

`next build --experimental-build-mode compile` skips the static-generation
phase and exits green. The app's routes are all dynamic (root layout uses
`export const dynamic = "force-dynamic"` for per-request CSP nonces), so no
prerendered output is lost.

## Environment

- Windows (also reported by others on macOS — see related reports)
- Next.js 16.4.1 and 16.4.3 (Turbopack and webpack)
- React / react-dom 19.3.1 (single copy, `npm ls` deduped)
- Bun 1.4.2 (also reproduced under npm on other machines)
- This scaffold: `bun install` then `npx next build`; copy
  `.dev.vars.example` to `.dev.vars` first (dummy value, required because
  `initOpenNextCloudflareForDev()` runs at config load).

## Related reports

- Discussion **#94667** — same error; Next team member icyJoseph asked for
  `--debug-prerender` output and said he had "candidates for potential
  issues" but never posted them. Effectively unresolved.
- Issues **#99265**, **#95741**, **#86178**, **#84994** — the same crash
  across Next 16.2.2 → canary; all were auto-closed by the triage bot within
  seconds for *missing a public reproduction link* (e.g. #99265 reproduces
  with a completely bare root layout on macOS, digest `2268147081`).
  This repository exists partly to fix that gap.
- Issue **#85604** — sibling crash on the internal `/_not-found` route.
