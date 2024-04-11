import { useWallet } from '@solana/wallet-adapter-react';
import { Button } from '@mui/material';
import CreateStream from './components/CreateStream';
import './App.css';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

function App() {
  const { connect, connected } = useWallet();
  return (
    <div className="App">
        <h2>Token Stream Configuration</h2>
        <WalletMultiButton />
        {!connected && <Button variant="contained" onClick={() => connect()}>
            Connect Wallet
        </Button>}
        {connected && <CreateStream />}
    </div>
  );
}

export default App;
