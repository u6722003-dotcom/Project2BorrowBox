'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container, TextField, Button, Typography, Box, Paper } from '@mui/material';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await fetch(`/api/users`);
    const data = await res.json();

    // Simple check: does this email exist in our MongoDB User collection?
    const userExists = data.data.find(u => u.email === email);

    if (data.success && userExists) {
      router.push('/');
    } else {
      setError('Student email not found. Please sign up first.');
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 10 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
          <Typography variant="h4" gutterBottom color="primary" sx={{ fontWeight: 'bold' }}>
            BorrowBox
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>Login to Campus Hub</Typography>
          
          <form onSubmit={handleLogin}>
            <TextField
              fullWidth
              label="Student Email"
              variant="outlined"
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {error && <Typography color="error" variant="body2" sx={{ mt: 1 }}>{error}</Typography>}
            <Button
              fullWidth
              variant="contained"
              color="primary"
              type="submit"
              sx={{ mt: 3, py: 1.5, textTransform: 'none', fontSize: '1.1rem' }}
            >
              Login
            </Button>
          </form>
          
          <Button 
            fullWidth
            sx={{ mt: 2, textTransform: 'none' }} 
            onClick={() => router.push('/register')}
          >
            Don't have an account? Sign Up
          </Button>
        </Paper>
      </Box>
    </Container>
  );
}