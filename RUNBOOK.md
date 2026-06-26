# RUNBOOK — JWBS Professional Suite

> One paragraph per decision. Code says *what*; this says *why* and *how to run it when the author is gone.*
> Bump **Last reviewed** whenever you edit this. Stale > 90 days flags red in the Project Tracker.

## 0. At a glance
| | |
|---|---|
| **Owner** | jw-solutions |
| **Status** | active |
| **Category** | Personal |
| **Live URL** | https://lex-jamaica.vercel.app |
| **GitHub repo** | JPSFP-A/jwbs_pro_suite |
| **Default branch** | master |
| **Local path** | D:\Projects\JWBS_Pro |
| **Entry file** | TODO |
| **Supabase** | TODO — confirm project ref + tables |
| **Tech stack** | TODO |
| **Last reviewed** | 2026-06-26 |

## 1. Architecture — the WHY
- **Stack:** TODO. _Why this shape:_ TODO (one paragraph).
- **Auth:** standalone / none — confirm.
- **Database:** TODO — confirm project ref + tables. _Key tables + why this schema:_ TODO.
- **Project-specific notes:** TODO
- **Other non-obvious decisions** (a library, an RPC, a workaround): TODO — one paragraph each.

## 2. Setup — run from scratch
```bash
git clone https://github.com/JPSFP-A/jwbs_pro_suite.git
cd "JWBS_Pro"
# env / secrets — list every var + where it comes from. Supabase anon key only in client, never service-role.
# entry: TODO
# run locally (static apps): python -m http.server 8080
```
- **Gotchas the instructions skip:** TODO — the commands/workarounds a new person trips on.

## 3. Deploy
```bash
cd "D:\Projects\JWBS_Pro"
vercel --prod --yes
```
- **Git identity (JPS repos):** user.name=JPSFP-A, user.email=jwilson@jpsco.com — Jordachew identity → Vercel BLOCKED.
- **⚠️ Verify the live URL serves the new build** after deploy (shadow *-deploy projects have hijacked aliases before).

## 4. Failure modes — when it breaks
| Symptom | Likely cause | Fix |
|---|---|---|
| Live URL serves old build | shadow *-deploy Vercel project owns alias | re-alias to real project (`--scope jps-fpa`) |
| Numbers show 0 | upstream *_facts table empty for period | check upload ran; never hardcode a non-zero fallback |
| 401 / RLS denied | anon key hitting protected view | confirm RLS / security_invoker |
- **Monitoring:** TODO; Sentry/PostHog where wired.
- **Rollback:** Vercel → Deployments → promote previous; or git revert + redeploy.

## 5. Git & branching
- Never push straight to `master` — even solo. `git checkout -b feature/<x>` → commit → PR → merge.
- `master` is production = what users see. Vercel preview deploys = staging.

## 6. Open items / TODO
- Fill section 1 architecture WHYs.
- Confirm Supabase ref + key tables.

