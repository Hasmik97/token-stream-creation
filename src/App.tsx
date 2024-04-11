import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Button } from '@mui/material';
import CreateStream from './components/CreateStream';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import DisplayStreams from './components/DisplayStreams';

import './App.css';

function App() {
  const { connect, connected } = useWallet();
  const [ displayStreams, setDisplayStreams ] = useState(false);
  
  return (
    <div className="App">
        <h2>Token Stream Configuration</h2>
        <WalletMultiButton />
        {!connected && <Button variant="contained" onClick={() => connect()}>
            Connect Wallet
        </Button>}
        {connected && <CreateStream />}
        {(!displayStreams && connected) && <Button variant="contained" onClick={() => setDisplayStreams(!displayStreams)}>
            Display streams
        </Button>}
        {displayStreams && <DisplayStreams />}
    </div>
  );
}

export default App;
