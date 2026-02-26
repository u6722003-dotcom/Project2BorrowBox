'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Container, TextField, Button, Typography, Box, Paper, Alert, CircularProgress } from '@mui/material';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  // Fixes the Red Hydration Error screen
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/users`);
      const data = await res.json();

      if (data.success) {
        // CLEANUP: We trim the input email to prevent "extra character" login failures
        const inputEmail = email.trim().toLowerCase();
        
        const userExists = data.data.find(u => u.email.trim().toLowerCase() === inputEmail);

        if (userExists) {
          // Success: Save user and move to dashboard
          localStorage.setItem('borrowbox_user', JSON.stringify(userExists));
          router.push('/');
        } else {
          setError('Student email not found. Please sign up first.');
        }
      } else {
        setError('Could not connect to database.');
      }
    } catch (err) {
      setError('System error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Prevent the red screen on first load
  if (!mounted) return null;

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 10 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
          <Typography variant="h4" gutterBottom color="primary" sx={{ fontWeight: 'bold' }}>
            BorrowBox
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>Login to Campus Hub</Typography>
          
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <form onSubmit={handleLogin}>
            <TextField
              fullWidth
              label="Student Email"
              variant="outlined"
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
            
            <Button
              fullWidth
              variant="contained"
              color="primary"
              type="submit"
              disabled={loading}
              sx={{ mt: 3, py: 1.5, textTransform: 'none', fontSize: '1.1rem' }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
            </Button>
          </form>
          
          <Button 
            fullWidth
            sx={{ mt: 2, textTransform: 'none' }} 
            onClick={() => router.push('/register')}
            disabled={loading}
          >
            Don't have an account? Sign Up
          </Button>
        </Paper>
      </Box>
    </Container>
  );
}