/**
 * @description Return user to connect wallet if it exists.
 */
export const connect = async () => {
  // @ts-ignore
  const { solana } = window;

  // checks if phantom wallet exists
  if (solana) {
    try {
      const account = await solana.connect();
      console.log("Wallet account ", account.publicKey.toString());
      return [account, account.publicKey.toString()];
    } catch (err: any) {
      alert(err);
      return err;
      // { code: 4001, message: 'User rejected the request.' }
    }
  } else {
    return "Install a wallet browser extention";
  }
};
