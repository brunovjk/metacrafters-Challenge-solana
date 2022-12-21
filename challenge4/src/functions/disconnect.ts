/**
 * @description prompts user to disconnect wallet if connected.
 */
export const disconnect = async () => {
  // @ts-ignore
  const { solana } = window;

  // checks if phantom wallet exists
  if (solana) {
    try {
      const response = await solana.disconnect();
      return response;
    } catch (err) {
      alert(err);
      return err;
      // { code: 4001, message: 'User rejected the request.' }
    }
  }
};
