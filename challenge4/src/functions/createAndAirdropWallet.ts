import {
  Connection,
  PublicKey,
  Keypair,
  clusterApiUrl,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";

/**
 * @description  Create new wallet Keypair.generate()
 */
const createWallet = async () => {
  try {
    const createdWallet = Keypair.generate();
    const publicKey = createdWallet.publicKey.toString();
    console.log("Created account:", publicKey);

    return [createdWallet, publicKey];
  } catch (err: any) {
    console.log(err);
    return err;
  }
};
/**
 * @description  airdrop two SOL wallet publicKey
 */
const airdropTwo = async (publicKey: string) => {
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

  try {
    // Aidrop 2 SOL to Sender wallet
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
    return fromAirDropSignature;
  } catch (err: any) {
    alert(err);
    console.log(err);
  }
};
/**
 * @description  Create and airdrop two SOL created wallet
 */
export const createAndAirdropWallet = async () => {
  try {
    const [createdWallet, publicKey] = await createWallet();
    const hash = await airdropTwo(publicKey);

    return [createdWallet, publicKey, hash];
  } catch (err: any) {
    console.log(err);
    alert(err);
    return err;
  }
};
