import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

interface StreamFormProps {
  onCreateStream: (streamData: any) => void; // Adjust based on your method for creating streams
  tokens: any
}

const StreamForm: React.FC<StreamFormProps> = ({ onCreateStream, tokens }) => {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [token, setToken] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateStream({ recipient, amount, token });
  };

  return (
    <>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="recipient"
          label="Recipient Address"
          name="recipient"
          autoComplete="recipient"
          autoFocus
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="amount"
          label="Amount"
          name="amount"
          autoComplete="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="token"
          label="Token Mint Address"
          name="token"
          autoComplete="token"
          value={token}
          onChange={(e: any) => setToken(e.target.value)}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Create Stream
        </Button>
      </Box>
    </>
  );
};

export default StreamForm;