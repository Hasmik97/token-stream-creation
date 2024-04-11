import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletAdapter } from '@solana/wallet-adapter-base';
import { Connection, Keypair } from '@solana/web3.js';
import { fetchSPLTokenBalances } from '../utils/fetchTokens';
import { StreamflowSolana, ICreateStreamData, getBN } from '@streamflow/stream';
import { BN } from 'bn.js';
import StreamForm from './StreamForm';

const CreateStream: React.FC = () => {
  const wallet = useWallet();
  const [connection, setConnection] = useState<Connection | null>(null);
  const [tokens, setTokens] = useState({});
  const solanaClient = new StreamflowSolana.SolanaStreamClient(
    "https://api.devnet.solana.com"
  );

  useEffect(() => {
    const fetchTokens = async () => {
      const tokens = await fetchSPLTokenBalances(wallet.publicKey?.toBase58(), "https://api.devnet.solana.com");
      if (tokens.length) setTokens(tokens);
    }
    if (wallet.connected) {
      setConnection(new Connection("https://api.devnet.solana.com"));
      fetchTokens();
    }
  }, [wallet.connected]);

  const handleCreateStream = async (streamData: any) => {
    if (!wallet.connected || !wallet.publicKey || !wallet.signTransaction || !connection) {
      console.error('Wallet is not connected');
      return;
    }

    try {

      const createStreamParams: ICreateStreamData = {
        recipient: streamData.receipient, // Recipient address.
        tokenId: streamData.token, // Token mint address.
        start: 1643363040, // Timestamp (in seconds) when the stream/token vesting starts.
        amount: getBN(100, 9), // streamData.amount depositing 100 tokens with 9 decimals mint.
        period: 1, // Time step (period) in seconds per which the unlocking occurs.
        cliff: 1643363160, // Vesting contract "cliff" timestamp in seconds.
        cliffAmount: new BN(10), // Amount unlocked at the "cliff" timestamp.
        amountPerPeriod: getBN(5, 9), // Release rate: how many tokens are unlocked per each period.
        name: "Transfer to Jane Doe.", // The stream name or subject.
        canTopup: false, // setting to FALSE will effectively create a vesting contract.
        cancelableBySender: true, // Whether or not sender can cancel the stream.
        cancelableByRecipient: false, // Whether or not recipient can cancel the stream.
        transferableBySender: true, // Whether or not sender can transfer the stream.
        transferableByRecipient: false, // Whether or not recipient can transfer the stream.
        automaticWithdrawal: true, // Whether or not a 3rd party (e.g. cron job, "cranker") can initiate a token withdraw/transfer.
        withdrawalFrequency: 10, // Relevant when automatic withdrawal is enabled. If greater than 0 our withdrawor will take care of withdrawals. If equal to 0 our withdrawor will skip, but everyone else can initiate withdrawals.
        partner: undefined, //  (optional) Partner's wallet address (string | null).
      };

      
      const solanaParams = {
        sender: wallet, // SignerWalletAdapter or Keypair of Sender account
      };


      const createStreamTransaction = await solanaClient.create(createStreamParams, solanaParams);

        // You'll need to sign and send the transaction
        // This may involve the user's wallet for signing
    } catch (error) {
        console.error("Failed to create stream:", error);
    }
  };

  return <StreamForm onCreateStream={handleCreateStream} tokens={tokens} />;
};

export default CreateStream;