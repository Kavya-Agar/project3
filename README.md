# Reveille Brew Co. (Squad 45)

Texas A&M-themed bubble tea POS web app for CSCE 331 Project 3.

| View | Route | Who uses it |
|---|---|---|
| Portal Hub | `/` | Internal hub that links to every view |
| Manager Dashboard | `/manager` | Menu management, sales reports, inventory (Google sign-in) |
| Cashier Screen | `/cashier` | Staff ring up orders (touch) |
| Customer Kiosk | `/kiosk` | Self-service ordering (touch, accessible) |
| Kitchen Display | `/kitchen` | Live order tickets, manually completed |

## Structure
- `client/` – React + Vite frontend. One folder per view in `src/views/`.
- `server/` – Express API. `routes/` (HTTP), `services/` (business logic and SQL), `utils/` (pure helpers), `db/` (pool and migrations). Every `*.routes.js` file is auto-mounted at `/api/<name>`.
- `scripts/check-env.mjs` – verifies a machine is set up correctly.
- `docs/COMMIT_PLAN.md` – who commits what.

## Required software
| Tool | Version |
|---|---|
| Node.js | 20 or newer (22 LTS recommended, see `.nvmrc`) |
| npm | 10 or newer |
| git | any recent version |

`engine-strict=true` makes `npm install` refuse to run on an unsupported Node. With nvm: `nvm install && nvm use`.

## Setup (every teammate)
```bash
git clone <repo-url> && cd project3
cp server/.env.example server/.env     # then fill in the DB credentials
npm run setup                          # npm ci for server + client, then the environment check
npm run check:db                       # also verifies the database connection
```
Run `npm run check` any time something seems off; it prints a fix for each problem.

## Run locally
Use two terminals:
```bash
npm --prefix server run dev     # API on http://localhost:3001
npm --prefix client run dev     # app on http://localhost:5173
```
First time only (or after pulling new migrations): `npm run migrate`. Migrations are idempotent.

## Tests and build
```bash
npm test         # server and client unit tests (node:test)
npm run build    # production build of the client
```
CI (`.github/workflows/ci.yml`) runs the same commands on every push and pull request.

## Configuration
All tunable values (prices, limits, toppings, thresholds) live in `server/src/config.js`. Secrets live in `server/.env`, which is git-ignored. Leave `GOOGLE_CLIENT_ID` empty to disable manager sign-in in local development.

## Deployment
`render.yaml` defines a single Render web service: it builds the client and the Express server serves it. Set the `DB_*` and `GOOGLE_CLIENT_ID` environment variables in the Render dashboard.

## Troubleshooting
- **`no pg_hba.conf entry … no encryption`**: the database requires SSL; this is on by default.
- **`self-signed certificate in certificate chain`**: the database server uses a certificate not trusted by Node. Set `DB_SSL_CA=/path/to/ca.pem` in `server/.env` with the CA certificate (ask the team lead).
- **Cannot reach the database from off campus**: connect to the TAMU VPN.
