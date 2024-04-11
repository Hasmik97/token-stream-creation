import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection } from '@solana/web3.js';
import { fetchSPLTokenBalances } from '../utils/fetchTokens';
import { StreamflowSolana, ICreateStreamData, getBN } from '@streamflow/stream';
import { BN } from 'bn.js';
import StreamForm from './StreamForm';
import TransactionSuccess from './TransactionSuccess';

const SOLANA_DEV_ENV: string = "https://api.devnet.solana.com";

const CreateStream: React.FC = () => {
  const wallet = useWallet();
  const [connection, setConnection] = useState<Connection | null>(null);
  const [tokens, setTokens] = useState({});
  const [signature, setSignature] = useState('');
  const solanaClient = new StreamflowSolana.SolanaStreamClient(SOLANA_DEV_ENV);

  useEffect(() => {
    const fetchTokens = async () => {
      const tokens = await fetchSPLTokenBalances(wallet.publicKey?.toBase58(), SOLANA_DEV_ENV);
      if (tokens.length) setTokens(tokens);
    }
    if (wallet.connected) {
      setConnection(new Connection(SOLANA_DEV_ENV));
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
        period: 1,
        cliff: 1643363160,
        cliffAmount: new BN(10),
        amountPerPeriod: getBN(5, 9),
        name: "Transfer to Test Name.",
        canTopup: false,
        cancelableBySender: true,
        cancelableByRecipient: false,
        transferableBySender: true,
        transferableByRecipient: false,
        automaticWithdrawal: true,
        withdrawalFrequency: 10,
      };

      
      const solanaParams = {
        sender: wallet,
      };


      // @ts-ignore
      const { ixs, txId, metadata } = await solanaClient.create(createStreamParams, solanaParams);
      console.log(ixs, txId, metadata);
      setSignature(txId);

    } catch (error) {
        console.error("Failed to create stream:", error);
    }
  };

  return !!signature ? <TransactionSuccess signature={signature} /> : <StreamForm onCreateStream={handleCreateStream} tokens={tokens} />;
};

export default CreateStream;