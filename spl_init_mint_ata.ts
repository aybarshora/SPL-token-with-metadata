import 'dotenv/config';
import bs58 from 'bs58';
import {
    Connection,
    Keypair,
    SystemProgram,
    Transaction,
    sendAndConfirmTransaction,
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
import { pack, type TokenMetadata } from "@solana/spl-token-metadata";
  
// Create connection to devnet
const connection = new Connection("https://api.devnet.solana.com", "confirmed");
  
// Load the authority from the private key for the mint (also acts as fee payer)
const PRIVATE_KEY = process.env.PRIVATE_KEY!;
const authority = Keypair.fromSecretKey(bs58.decode(PRIVATE_KEY));

// Airdrop SOL to fee payer
// try {
//     const sig = await connection.requestAirdrop(authority.publicKey, 5 * LAMPORTS_PER_SOL);
//     await connection.confirmTransaction(sig, 'confirmed');
//   } catch {}  

// Generate keypair to use as mint account
const mint = Keypair.generate();

// Create the metadata object
const metadata: TokenMetadata = {
  mint: mint.publicKey,
  name: "AibarFromTurbin3",
  symbol: "AFT3",
  uri: "https://raw.githubusercontent.com/aybarshora/SPL-token-with-metadata/main/metadata.json",
  additionalMetadata: [["description", "Priceless"]]
};

// Size of metadata
const metadataLen = pack(metadata).length;

// Size of MetadataExtension 2 bytes for type, 2 bytes for length
const metadataExtension = TYPE_SIZE + LENGTH_SIZE;

// metadata pointer extension size
const spaceWithoutMetadataExtension = getMintLen([
  ExtensionType.MetadataPointer
]);

// Calculate rent exemption
const lamportsForMint = await connection.getMinimumBalanceForRentExemption(
  spaceWithoutMetadataExtension + metadataLen + metadataExtension
);

// Create account for the mint
const createMintAccountIx = SystemProgram.createAccount({
  fromPubkey: authority.publicKey,
  newAccountPubkey: mint.publicKey,
  space: spaceWithoutMetadataExtension,
  lamports: lamportsForMint,
  programId: TOKEN_2022_PROGRAM_ID
});

// Initialize metadata pointer extension
const initializeMetadataPointerIx = createInitializeMetadataPointerInstruction(
  mint.publicKey, // mint account
  authority.publicKey, // authority
  mint.publicKey, // metadata address
  TOKEN_2022_PROGRAM_ID
);

// Initialize mint account
const initializeMintIx = createInitializeMintInstruction(
  mint.publicKey, // mint
  9, // decimals
  authority.publicKey, // mint authority
  authority.publicKey, // freeze authority
  TOKEN_2022_PROGRAM_ID
);

// Initialize metadata extension
const initializeMetadataIx = createInitializeInstruction({
  programId: TOKEN_2022_PROGRAM_ID,
  mint: mint.publicKey,
  metadata: mint.publicKey,
  mintAuthority: authority.publicKey,
  name: "AibarFromTurbin3",
  symbol: "AFT3",
  uri: "https://raw.githubusercontent.com/aybarshora/SPL-token-with-metadata/main/metadata.json",
  updateAuthority: authority.publicKey
});

// Build first transaction. Batch several instructions in one transaction.
const tx = new Transaction().add(
  createMintAccountIx,
  initializeMetadataPointerIx,
  initializeMintIx,
  initializeMetadataIx,
);

// Send and confirm transaction
await sendAndConfirmTransaction(connection, tx, [authority, mint]);

console.log("Mint Address:", mint.publicKey.toBase58());

// Create (or fetch) your ATA for this mint
const ata = await getOrCreateAssociatedTokenAccount(
    connection,
    authority,          // payer
    mint.publicKey,     // mint public key
    authority.publicKey,// owner of the ATA (your wallet)
    false,              // allowOwnerOffCurve
    "confirmed",
    undefined,          // confirm options
    TOKEN_2022_PROGRAM_ID
  );

// Decide how much to mint (in base units)
const amount = 1_000_000_000n; // e.g., 1.0 token if decimals = 9

// Mint to your ATA
await mintTo(
  connection,
  authority,         // mint authority signer
  mint.publicKey,
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



