# GroupChatApp Fix Plan (Live Chat + Email Display)

## Information gathered
- `public/userChat.js` sets `#displayUserName` from `localStorage.getItem('userEmail')`, but login flow does not reliably save `userEmail`.
- JWT token created in `controller/ScriptController.js` includes `{ userId, email, role }`.
- `app.js` uses Socket.IO rooms named `user_${userId}`.
- `controller/chatController.js` emits `receive_message` to `user_${receiverId}` and `user_${senderId}`.

## Plan
1. Fix the “Loading Channel…” header: decode JWT on the client and display the email from the token.
2. Ensure chat join/room logic matches sender/receiver IDs (admin is receiverId=1 currently).
3. Prevent duplicate submit handlers and remove dead code (if present).
4. Validate `receiverId`, message relevance filter, and history rendering for both user<->admin chat.

## Progress
- [x] Update `public/userChat.js` to show email from JWT payload instead of missing `userEmail` storage.

## Next steps
- [ ] Run manual test: login as user -> open `/userChat` -> verify header shows user email.
- [ ] Send a message -> verify receiver receives it in real-time.
- [ ] Fix any remaining issues for 2-user live chat (rooms per pair) if requested.

