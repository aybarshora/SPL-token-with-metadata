import 'dotenv/config';
import bs58 from 'bs58';
import {
    Connection,
    Keypair,
    SystemProgram,
    Transaction,
    sendAndConfirmTransaction,
    PublicKey
  } from "@solana/web3.js";
  import {
    TOKEN_2022_PROGRAM_ID,
    createInitializeMintInstruction,
    createInitializeMetadataPointerInstruction,
    getMintLen,
    TYPE_SIZE,
    ExtensionType,
    createInitializeInstruction,
    LENGTH_SIZE,
    getOrCreateAssociatedTokenAccount,
    mintTo,
    getAccount
  } from "@solana/spl-token";

  
// Create connection to devnet
const connection = new Connection("https://api.devnet.solana.com", "confirmed");
  
// Load the authority from the private key for the mint (also acts as fee payer)
const PRIVATE_KEY = process.env.PRIVATE_KEY!;
const authority = Keypair.fromSecretKey(bs58.decode(PRIVATE_KEY));
const mintAddress = "2UJcNELBHPjRWq3J2fkXe73QEi9SfSnyCwWmssmqJdJ4";
const mintPubkey = new PublicKey(mintAddress);

// Create (or fetch) your ATA for this mint
const ata = await getOrCreateAssociatedTokenAccount(
    connection,
    authority,          // payer
    mintPubkey,         // mint public key
    authority.publicKey,// owner of the ATA (your wallet)
    false,              // allowOwnerOffCurve
    "confirmed",
    undefined,          // confirm options
    TOKEN_2022_PROGRAM_ID
  );

// Decide how much to mint (in base units)
const amount = 10_000_000_000n; // e.g., 1.0 token if decimals = 9

// Mint to your ATA
await mintTo(
  connection,
  authority,         // mint authority signer
  mintPubkey,
  ata.address,
  authority,         // signer
  amount,
  [],                // multiSigners
  { commitment: "confirmed" },
  TOKEN_2022_PROGRAM_ID
);

// Read back the balance
const ataAcc = await getAccount(connection, ata.address, "confirmed", TOKEN_2022_PROGRAM_ID);
const raw = ataAcc.amount; // bigint

console.log("ATA:", ata.address.toBase58());
console.log("Minted (raw):", raw.toString());