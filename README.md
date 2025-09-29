PayMe Omnichain

A minimal omnichain PayMe demo using a `PaymentManager` smart contract and planned ZetaChain settlement for cross-chain payments.

Problem
Sending and receiving payments across chains and tokens is painful. Requesters want to get paid in their preferred token and chain without forcing payers to bridge manually.

Solution
An omnichain payment request flow:
- Requester creates a request specifying amount + preferred token/chain
- Payer fulfills from any supported chain/token
- ZetaChain settles to requester’s preferred token/chain

Status
- Contracts: `PaymentManager` with events and basic native/ERC20 fulfillment. ZetaChain settlement stubs pending.
- Deployed (Zeta Athens): `0xF45aa7AE79a8E8C86728B4fe4aC945F388699Ade`
- Frontend: Scaffolded (Create, Pay, Dashboard) with wallet connect and basic calls
- Docs: This README and a diagram placeholder added

Quick Start

Contracts
```bash
cd contracts
npm install
npm run compile
npm test
```

Deploy to Zeta Athens Testnet:
```bash
npx hardhat run scripts/deploy.js --network zetachain_testnet
```

Frontend

```bash
cd frontend
npm install
npm run dev
```

Usage
- Create Request:
  - Open `/create`, connect wallet, enter amount, keep token as zero address for native flow, submit.
- Pay Request:
  - Open `/pay/:id`, enter amount, click Pay Now (native ETH path currently).
- Dashboard: (stub) `/dashboard`.

Frontend (planned)
- Vite + React + wagmi/viem
- Pages: `/create`, `/pay/:id`, `/dashboard`

Demo Scenario (Target)
- Alice (Polygon) requests USDC
- Bob (Ethereum) pays with ETH
- Settlement delivers USDC on Polygon to Alice via ZetaChain

Architecture
See `docs/architecture.md`.

Environment
- Node 18+
- Hardhat 2.26+
- Zeta Athens RPC (public): `https://zetachain-athens-evm.blockpi.network/v1/rpc/public`

Roadmap
- Integrate Zeta SDK (SystemContract, IZRC20)
- Implement cross-chain message handling
- Frontend UX
- E2E demo scripts
