# SPL Token 2022 Mint Script

This project demonstrates how to create, initialize, and mint a **Solana Token-2022** with on-chain metadata (name, symbol, URI) — no Metaplex required.

It connects to Devnet, mints a token, creates your Associated Token Account (ATA), mints to it, and prints your balance.

---

## Overview

**Features**

* Uses `@solana/web3.js` and `@solana/spl-token` (Token-2022)
* On-chain metadata via Metadata Pointer + Metadata Extension
* Loads wallet private key from `.env`
* Creates Associated Token Account automatically
* Mints tokens and reads balance
* Compatible with Devnet or local validator

---
## Here's my token mint screenshot on solscan:
![Token Screenshot](https://raw.githubusercontent.com/aybarshora/SPL-token-with-metadata/main/Screenshot-token.png)

## Mint address:

[2UJcNELBHPjRWq3J2fkXe73QEi9SfSnyCwWmssmqJdJ4](https://solscan.io/token/2UJcNELBHPjRWq3J2fkXe73QEi9SfSnyCwWmssmqJdJ4?cluster=devnet)


## Setup

### 1. Clone and install

```bash
git clone https://github.com/aybarshora/SPL-token-with-metadata.git
cd SPL-token-with-metadata
npm install
```

### 2. Create `.env` file

```
PRIVATE_KEY=3VdK...your_base58_secret...
```

Make sure `.env` is listed in `.gitignore`.

If you don’t have SOL on Devnet, airdrop yourself(Make sure your solana client cluster is set up to devnet):

```bash
solana airdrop 2
```


## Run

```bash
node spl_init_mint_ata.ts
```

Example output:

```
Mint Address:  9o3H...b8E
ATA:           6vF2...fJv
Minted (raw):  1000000000
```

Check your mint on the [Solana Explorer – Devnet](https://explorer.solana.com/?cluster=devnet).


---

## Metadata

The metadata JSON is hosted on GitHub for development:

```
https://raw.githubusercontent.com/aybarshora/SPL-token-with-metadata/main/metadata.json
```

Example JSON:

```json
{
    "name": "AibarFromTurbin3",
    "symbol": "AFT3",
    "description": "Halloween night minted token",
    "image": "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.eastgateanimalhospital.com%2Fsite%2Fblog%2F2022%2F05%2F17%2Fcutest-dog-breeds-small-forever&psig=AOvVaw17FC-jekc1Dw2g1ydQ54Yd&ust=1762128413625000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCLiQ5YKW0pADFQAAAAAdAAAAABAf",
    "attributes": [
      {
        "trait_type": "Item",
        "value": "Priceless"
      }
    ]
  }
```

> For production, host this file on Arweave, IPFS, or your CDN for permanence.

---


---

## Dependencies

* **@solana/web3.js** – Solana RPC interface
* **@solana/spl-token** – Token-2022 utilities
* **@solana/spl-token-metadata** – metadata extension helpers
* **bs58** – base58 decoder for private key
* **dotenv** – environment variable loader

---

## ⚠️ Security

* Never commit `.env` or private keys.
* Treat your Devnet wallet as disposable.

---

## 🧾 License

MIT License © 2025 Aibar Shora

---
