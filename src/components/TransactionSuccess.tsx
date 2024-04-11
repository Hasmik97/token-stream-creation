import { useWallet } from '@solana/wallet-adapter-react';
import Alert from '@mui/material/Alert';

interface TransactionSuccessProps {
    signature: string;
}

const TransactionSuccess: React.FC<TransactionSuccessProps> = ({ signature }) => {
  return (
    <div>
        <Alert variant="outlined" severity="success">
            Stream creation transaction done successfully!
            Transaction signature: {signature}
        </Alert>
    </div>
  );
}

export default TransactionSuccess;
