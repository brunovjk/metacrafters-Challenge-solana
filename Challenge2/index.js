// Import Solana web3 functinalities
const {
  Connection,
  PublicKey,
  clusterApiUrl,
  Keypair,
  LAMPORTS_PER_SOL,
  Transaction,
  SystemProgram,
  sendAndConfirmTransaction,
} = require("@solana/web3.js");

const DEMO_FROM_SECRET_KEY = new Uint8Array([
  160, 20, 189, 212, 129, 188, 171, 124, 20, 179, 80, 27, 166, 17, 179, 198,
  234, 36, 113, 87, 0, 46, 186, 250, 152, 137, 244, 15, 86, 127, 77, 97, 170,
  44, 57, 126, 115, 253, 11, 60, 90, 36, 135, 177, 185, 231, 46, 155, 62, 164,
  128, 225, 101, 79, 69, 101, 154, 24, 58, 214, 219, 238, 149, 86,
]);

const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

// Get Keypair from Secret Key
const from = Keypair.fromSecretKey(DEMO_FROM_SECRET_KEY);

// Generate another Keypair (account we'll be sending to)
const to = Keypair.generate();

const getWalletBalance = async (publicKey) => {
  try {
    // Request wallet balance
    const walletBalance = await connection.getBalance(publicKey);
    return parseInt(walletBalance);
  } catch (err) {
    console.log(err);
  }
};

const airdropTwo = async (publicKey) => {
  try {
    // Aidrop 2 SOL to Sender wallet
    console.log("Airdropping some SOL to Sender wallet!");
    const fromAirDropSignature = await connection.requestAirdrop(
      new PublicKey(publicKey),
      2 * LAMPORTS_PER_SOL
    );

    // Latest blockhash (unique identifer of the block) of the cluster
    let latestBlockHash = await connection.getLatestBlockhash();

    // Confirm transaction using the last valid block height (refers to its time)
    // to check for transaction expiration
    await connection.confirmTransaction({
      blockhash: latestBlockHash.blockhash,
      lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
      signature: fromAirDropSignature,
    });

    console.log("Airdrop completed for the Sender account");
  } catch (error) {
    console.log(error);
  }
};

const transferSol = async (lamportsAmount) => {
  try {
    // Send money from "from" wallet and into "to" wallet
    var transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: from.publicKey,
        toPubkey: to.publicKey,
        lamports: lamportsAmount,
      })
    );

    // Sign transaction
    var signature = await sendAndConfirmTransaction(connection, transaction, [
      from,
    ]);
    console.log("Signature is ", signature);
  } catch (error) {
    console.log(error);
  }
};

const consoleBalance = async () => {
  console.log(
    `From wallet balance: ${
      parseInt(await getWalletBalance(from.publicKey)) / LAMPORTS_PER_SOL
    } SOL`
  );
  console.log(
    `To wallet balance: ${
      parseInt(await getWalletBalance(to.publicKey)) / LAMPORTS_PER_SOL
    } SOL`
  );
};
// Show the wallet balance before and after transfer SOL
const mainFunction = async () => {
  console.log(
    `From wallet balance: ${
      parseInt(await getWalletBalance(from.publicKey)) / LAMPORTS_PER_SOL
    } SOL`
  );
  await airdropTwo(from.publicKey);
  await consoleBalance();
  await transferSol(Math.round((await getWalletBalance(from.publicKey)) / 2));
  await consoleBalance();
};

mainFunction();
