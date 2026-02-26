'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Container, TextField, Button, Typography, Box, Paper, Alert, CircularProgress } from '@mui/material';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => setMounted(true), []);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email: email.toLowerCase(), password, credits: 50 }),
      });

      const data = await res.json();
      if (data.success) {
        router.push('/login');
      } else {
        setError(data.error || 'Registration failed.');
      }
    } catch (err) {
      setError('System error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 10 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
          <Typography variant="h4" gutterBottom color="primary" sx={{ fontWeight: 'bold' }}>
            BorrowBox
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>Create an Account</Typography>
          
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <form onSubmit={handleRegister}>
            <TextField fullWidth label="Full Name" margin="normal" value={name} onChange={(e) => setName(e.target.value)} required />
            <TextField fullWidth label="Email Address" type="email" margin="normal" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <TextField fullWidth label="Password" type="password" margin="normal" value={password} onChange={(e) => setPassword(e.target.value)} required />
            
            <Button fullWidth variant="contained" color="primary" type="submit" disabled={loading} sx={{ mt: 3, py: 1.5 }}>
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Register'}
            </Button>
          </form>
          
          <Button fullWidth sx={{ mt: 2 }} onClick={() => router.push('/login')} disabled={loading}>
            Already have an account? Login
          </Button>
        </Paper>
      </Box>
    </Container>
  );
}