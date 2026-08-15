- [x] Add new migration to extend `premiumLeader` table with download history columns.
- [x] Update `Model/premiumLeaders.js` to include new columns.
- [x] Update `Controller/controller.js` download handler to persist download timestamps into `premiumLeader` row.




- [ ] Add new premium-only endpoint to download expense history with date/time.
- [ ] Update `Route/route.js` to register the new endpoint.
- [ ] Update `View/expense.html` UI with a new "Download Expense History" button.
- [ ] Update `Public/expense.js` to call the new endpoint and download CSV.
- [ ] Run migrations + basic manual test: premium vs non-premium download behavior.

