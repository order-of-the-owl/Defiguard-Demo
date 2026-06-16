# ETH Wallet Feature — Summary & Usage Guide

## Task

Per the project README: build a basic ETH wallet UI with Web3.js,
supporting sending and receiving ETH.

---

## What was built

### 1. New `/wallet` route
- Added a `Wallet` page to the router in `src/App.js`.
- Added a "Wallet" link to the main site navigation.

### 2. Wallet functionality
Built on **Web3.js**, talking to the user's browser wallet extension
(MetaMask) via `window.ethereum` — no private keys are ever handled by the
app itself; MetaMask signs all transactions.

- **Connect Wallet** — requests account access, fetches the connected
  account's ETH balance.
- **Receive** — displays the connected address (shortened, full address on
  hover) with a copy-to-clipboard button.
- **Send** — form for recipient address + amount, validates both, sends the
  transaction, shows a link to the transaction on Sepolia Etherscan, and
  refreshes the balance afterward.
- Basic error handling: no wallet installed, invalid input, failed
  transaction.

### 3. Visual design
Styled to match the rest of the site's existing design system (green accent
`#02a763`, `Raleway` font, card shadows, rounded buttons) rather than
generic default form styling — a dark hero title on connect, a balance card,
and a send-ETH card once connected.

**Files:** `src/pages/wallet/index.js`, `src/pages/wallet/index.css`

### Verification done
- `npm run build` completes successfully.
- Dev server compiles with no errors.
- Full manual click-through (connect → balance → send → confirmation)
  requires a real browser with MetaMask installed and a funded testnet
  account — follow the usage guide below to test it yourself.

### Suggested next steps (not yet implemented)
- Listen for MetaMask's `accountsChanged` / `chainChanged` events to keep
  the UI in sync if the user switches accounts or networks mid-session.
- Warn the user if they're connected to an unexpected network.
- Replace plain "Connecting..." / "Sending..." button text with a spinner.

---

## How to use it

### 1. Install the wallet extension (MetaMask)

The "extension" needed is **MetaMask** — a browser extension that injects a
`window.ethereum` object into web pages. The app uses that object to request
accounts and send transactions; it does not store or handle private keys.

1. Go to https://metamask.io/download/ and install it for your browser
   (Chrome, Firefox, Brave, Edge are supported).
2. Open the extension, click **Create a new wallet**, and follow setup (set
   a password, securely back up the seed phrase).

### 2. Switch to a test network

Don't test with real funds — use a testnet:

1. Open MetaMask → network dropdown at the top → enable **Show test
   networks** (in settings if not visible).
2. Select **Sepolia** (the current standard Ethereum testnet).

### 3. Get test ETH

Use a faucet to fund your test account (paste your MetaMask address):

- https://cloud.google.com/application/web3/faucet/ethereum/sepolia
- https://sepolia-faucet.pk910.de/ (browser mining, no account needed)
- https://faucets.chain.link/

> Note: some faucets (e.g. Alchemy's) require your wallet to already hold a
> small mainnet balance as an anti-abuse check — the ones above don't.

### 4. Run the app

```bash
npm install
npm run start-front   # starts just the React app on http://localhost:3000
```

(`npm start` also boots the backend server — only needed for
auth/messaging features unrelated to the wallet.)

Navigate to **http://localhost:3000/wallet**.

### 5. Connect & use the wallet

1. Click **Connect Wallet** — MetaMask will pop up asking you to approve
   the connection. Approve it.
2. Your **balance** and **address** will display.
3. **Receive ETH**: share the displayed address (use the **Copy** button)
   with whoever is sending you funds.
4. **Send ETH**: enter a recipient address and an amount in ETH, click
   **Send**. MetaMask will pop up to confirm the transaction (and gas fee)
   — approve it.
5. Once confirmed, the transaction is shown with a link to Etherscan and
   your balance refreshes.

### Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| "No wallet found. Please install MetaMask." | Extension not installed, or `window.ethereum` not injected | Install MetaMask, refresh the page |
| Connect popup doesn't appear | Already connected, or popup blocked | Check the MetaMask icon in the toolbar, click it directly |
| "insufficient funds" on send | Not enough test ETH for amount + gas | Request more from a faucet |
| Balance shows 0 after funding | Wrong network selected | Make sure MetaMask is on the same network you funded (Sepolia) |
| Transaction stuck "Sending..." | Waiting on MetaMask/network confirmation | Check the MetaMask popup; check the transaction on https://sepolia.etherscan.io |

### Notes for going to production

- This implementation relies entirely on the user's wallet extension to
  sign transactions — no private keys ever touch the app, which is the
  correct/secure pattern.
- Before mainnet use, add network-mismatch detection (warn the user if
  they're not on the expected chain) and listen for MetaMask's
  `accountsChanged` / `chainChanged` events to keep the UI in sync.
