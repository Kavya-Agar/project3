# Commit plan

Five members, 30 commits (each member has at least 4, and everyone touches both frontend and backend).

## Order does not matter
Every commit adds or changes files that no other commit touches, so the commits can be made and pushed in any order with no merge conflicts. Routes are auto-mounted, and each view file is picked up automatically, so there is no shared file to edit.

Two honest caveats:
- The app only runs completely once all commits are in. The server skips (with a warning) any route whose dependencies have not landed yet, but `npm run build` in `client/` will fail until every file a view imports exists.
- CI on `main` can therefore be red until the last commit lands. That is expected.

## How to use this
1. Add each teammate as a collaborator and send them the repo files (or have them pull the working tree).
2. Each member runs the `git add` / `git commit` blocks for their own number, using their own git identity. Only add the paths listed, and one commit per block.
3. `git pull --rebase` before each `git push`.

Suggested roles: **Member 1** foundation, portal and auth · **Member 2** manager dashboard · **Member 3** cashier and orders · **Member 4** customer kiosk · **Member 5** kitchen display.

---

## Member 1 (Kavya): Foundation, Portal Hub, Auth (7 commits)

```bash
# 1
git rm -q server/src/.gitkeep
git add server/package.json server/package-lock.json server/.npmrc server/.env.example \
  server/src/app.js server/src/index.js server/src/config.js server/src/db/pool.js server/src/db/migrate.js \
  server/src/middleware/errorHandler.js server/src/routes/index.js server/src/routes/health.routes.js \
  server/src/utils/asyncHandler.js server/src/utils/httpError.js server/src/services/orderEvents.js
git commit -m "chore(server): scaffold Express API with config, DB pool and health check" \
  -m "Adds the app factory, centralized config, pg pool with transactions, error handling, auto-mounted routes, an order event bus and the migration runner."

# 2
git rm -q client/.gitkeep
git add client/package.json client/package-lock.json client/.npmrc client/index.html client/vite.config.js \
  client/src/main.jsx client/src/App.jsx client/src/styles/theme.css client/src/config/constants.js \
  client/src/config/views.js client/src/api/http.js client/src/hooks/useApi.js client/src/components/StatusMessage.jsx
git commit -m "chore(client): scaffold React + Vite app with Aggie theme and view routing" \
  -m "Adds the router, design tokens, API client, data-loading hook and shared loading and error components."

# 3
git add client/src/views/portal
git commit -m "feat(client): add Portal Hub with one-way links to each interface view"

# 4
git add server/src/services/authService.js server/src/middleware/requireAuth.js server/src/routes/auth.routes.js
git commit -m "feat(server): add Google OAuth verification and manager session middleware"

# 5
git add client/src/auth
git commit -m "feat(client): add Google sign-in flow and protected route wrapper"

# 6
git add .nvmrc .npmrc .editorconfig package.json scripts/check-env.mjs .github/workflows/ci.yml
git commit -m "chore: add toolchain checks, editor config and CI workflow" \
  -m "npm run check verifies Node, npm, dependencies and .env; CI runs tests and the client build."

# 7
git add render.yaml README.md docs/COMMIT_PLAN.md
git commit -m "docs: add Render blueprint, README and commit plan"
```

## Member 2 (AD): Manager Dashboard (6 commits)

```bash
# 1
git add server/src/db/migrations/001_menu_category.sql
git commit -m "feat(db): add menu category, availability flag and product id sequence"

# 2
git add server/src/services/menuService.js server/src/routes/menu.routes.js \
  server/src/utils/menuValidation.js server/test/menuValidation.test.js
git commit -m "feat(server): add menu service and routes with validation tests"

# 3
git add server/src/services/reportService.js server/src/routes/reports.routes.js \
  server/src/services/inventoryService.js server/src/routes/inventory.routes.js
git commit -m "feat(server): add sales report and inventory restock endpoints"

# 4
git add client/src/api/menuApi.js client/src/api/reportsApi.js client/src/api/inventoryApi.js \
  client/src/views/manager/MenuItemForm.jsx client/src/views/manager/MenuManager.jsx
git commit -m "feat(client): add manager API wrappers and menu management panel"

# 5
git add client/src/views/manager/BarChart.jsx client/src/views/manager/ReportsPanel.jsx
git commit -m "feat(client): add sales reports panel with revenue bar chart"

# 6
git add client/src/views/manager/InventoryPanel.jsx client/src/views/manager/ManagerView.jsx \
  client/src/views/manager/manager.css
git commit -m "feat(client): assemble manager dashboard with inventory panel"
```

## Member 3 (Nikhil): Cashier and orders (6 commits)

```bash
# 1
git add server/src/utils/pricing.js server/test/pricing.test.js
git commit -m "feat(server): add order pricing and validation helpers with unit tests"

# 2
git add server/src/db/migrations/003_id_sequences.sql
git commit -m "feat(db): add order and order item id sequences"

# 3
git add server/src/services/orderService.js server/src/routes/orders.routes.js server/src/routes/employees.routes.js
git commit -m "feat(server): add transactional order creation that updates sales and inventory" \
  -m "One transaction writes the order, its items and the inventory deductions, then notifies the kitchen."

# 4
git add client/src/hooks/useOrderCart.js client/src/hooks/useDrinkConfig.js client/src/utils/money.js \
  client/src/api/ordersApi.js client/src/api/employeesApi.js
git commit -m "feat(client): add shared order cart, drink config hooks and order API"

# 5
git add client/src/views/cashier/ProductGrid.jsx client/src/views/cashier/CustomizeDialog.jsx
git commit -m "feat(client): add cashier product grid and customization dialog"

# 6
git add client/src/views/cashier/OrderTicket.jsx client/src/views/cashier/CashierView.jsx client/src/views/cashier/cashier.css
git commit -m "feat(client): add cashier order ticket and assemble cashier screen"
```

## Member 4 (Jeremiah): Customer Kiosk (5 commits)

```bash
# 1
git add server/src/routes/options.routes.js client/src/api/optionsApi.js
git commit -m "feat: expose drink customization options to the cashier and kiosk"

# 2
git add server/src/db/migrations/004_kiosk_employee.sql
git commit -m "feat(db): add self-service kiosk employee for kiosk orders"

# 3
git add client/src/views/kiosk/kiosk.css client/src/views/kiosk/WelcomeScreen.jsx client/src/hooks/useIdleReset.js
git commit -m "feat(client): add kiosk theme, welcome screen and idle reset"

# 4
git add client/src/views/kiosk/DrinkBrowser.jsx client/src/views/kiosk/CustomizeScreen.jsx
git commit -m "feat(client): add kiosk drink browser and customization screens"

# 5
git add client/src/views/kiosk/CartPanel.jsx client/src/views/kiosk/ConfirmationScreen.jsx client/src/views/kiosk/KioskView.jsx
git commit -m "feat(client): add kiosk cart, confirmation and assemble ordering flow"
```

## Member 5 (Allen): Kitchen Display (6 commits)

```bash
# 1
git add server/src/db/migrations/002_order_status.sql
git commit -m "feat(db): add order status and source columns for kitchen routing"

# 2
git add server/src/utils/tickets.js server/test/tickets.test.js
git commit -m "feat(server): group order rows into kitchen tickets with tests"

# 3
git add server/src/services/kitchenService.js server/src/routes/kitchen.routes.js
git commit -m "feat(server): add kitchen ticket API with live server-sent events"

# 4
git add client/src/api/kitchenApi.js client/src/hooks/useKitchenTickets.js \
  client/src/utils/urgency.js client/src/utils/urgency.test.js
git commit -m "feat(client): add kitchen API, live ticket hook and urgency helpers"

# 5
git add client/src/views/kitchen/TicketCard.jsx client/src/views/kitchen/labels.js client/src/views/kitchen/kitchen.css
git commit -m "feat(client): add kitchen ticket card and styles"

# 6
git add client/src/views/kitchen/KitchenView.jsx
git commit -m "feat(client): assemble kitchen display"
```

## Checklist before the Sprint 1 release
- [ ] Everyone has at least 4 commits on `main` (`git shortlog -sn`).
- [ ] `npm run migrate` has been run against the shared database once.
- [ ] `npm run check:db` passes.
- [ ] Deployed on Render and the Portal URL works.
- [ ] Tag and publish the release: `git tag v1.0-sprint1 && git push --tags`, then create the GitHub Release.
