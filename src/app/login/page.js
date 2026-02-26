'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Container, TextField, Button, Typography, Box, Paper, Alert, CircularProgress } from '@mui/material';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => setMounted(true), []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/users`);
      const data = await res.json();

      if (data.success) {
        const inputEmail = email.trim().toLowerCase();
        // It checks the clean email and ignores the "Student" requirement
        const userExists = data.data.find(u => u.email && u.email.trim().toLowerCase() === inputEmail);

        if (userExists) {
          localStorage.setItem('borrowbox_user', JSON.stringify(userExists));
          router.push('/');
        } else {
          setError('Account not found. Please register first.');
        }
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
          <Typography variant="body1" sx={{ mb: 3 }}>Login to your account</Typography>
          
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <form onSubmit={handleLogin}>
            <TextField fullWidth label="Email Address" type="email" margin="normal" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <TextField fullWidth label="Password" type="password" margin="normal" value={password} onChange={(e) => setPassword(e.target.value)} required />
            
            <Button fullWidth variant="contained" color="primary" type="submit" disabled={loading} sx={{ mt: 3, py: 1.5 }}>
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
            </Button>
          </form>
          
          <Button fullWidth sx={{ mt: 2 }} onClick={() => router.push('/register')} disabled={loading}>
            Don't have an account? Sign Up
          </Button>
        </Paper>
      </Box>
    </Container>
  );
}