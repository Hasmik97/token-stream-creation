import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import Types, { GenericStreamClient, IChain, ICluster } from '@streamflow/stream';

const data: Types.IGetAllData = {
  address: "99h00075bKjVg000000tLdk4w42NyG3Mv0000dc0M99",
  type: Types.StreamType.All,
  direction: Types.StreamDirection.All,
};

const DisplayStreams: React.FC = () => {
  const wallet = useWallet();
  const [streams, setStreams] = useState<any[]>([]);
  const [client, setClient] = useState<GenericStreamClient<IChain.Solana> | null>(null);

    useEffect(() => {
    // Initialize the Streamflow client when the component mounts
    const newClient = new GenericStreamClient<IChain.Solana>({
        chain: IChain.Solana,
        clusterUrl: "https://api.devnet.solana.com",
        cluster: ICluster.Devnet,
    });
    setClient(newClient);
  }, []);

  useEffect(() => {
    const fetchStreams = async () => {
      if (wallet.publicKey) {
        try {
          if (client) {
          const userStreams = await client.get(data);
          setStreams(userStreams);
          }
        } catch (error) {
          console.error('Failed to fetch streams:', error);
        }
      }
    };

    fetchStreams();
  }, [wallet]);

  return (
    <div>
      <h2>User's Streams</h2>
      {streams.length > 0 ? (
        <ul>
          {streams.map((stream, index) => (
            <li key={index}>
              Stream to: {stream.recipient}, Amount: {stream.amount}, etc.
            </li>
          ))}
        </ul>
      ) : (
        <p>No streams found.</p>
      )}
    </div>
  );
};

export default DisplayStreams;