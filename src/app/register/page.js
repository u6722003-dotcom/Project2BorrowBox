'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container, TextField, Button, Typography, Box, Paper, Alert } from '@mui/material';

export default function RegisterPage() {
  const [formData, setFormData] = useState({ name: '', email: '', studentId: '' });
  const [status, setStatus] = useState({ type: '', msg: '' });
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        setStatus({ type: 'success', msg: 'Registration Successful! Redirecting...' });
        setTimeout(() => router.push('/login'), 2000);
      } else {
        setStatus({ type: 'error', msg: data.error || 'Registration failed' });
      }
    } catch (err) {
      setStatus({ type: 'error', msg: 'Server error. Try again.' });
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
            Join BorrowBox
          </Typography>
          
          {status.msg && <Alert severity={status.type} sx={{ mb: 2 }}>{status.msg}</Alert>}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Full Name"
              margin="normal"
              required
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <TextField
              fullWidth
              label="Student Email"
              type="email"
              margin="normal"
              required
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <TextField
              fullWidth
              label="Student ID"
              margin="normal"
              required
              onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
            />
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              type="submit"
              sx={{ mt: 3, py: 1.5, textTransform: 'none', fontSize: '1.1rem' }}
            >
              Create Account
            </Button>
          </form>
          
          <Button 
            fullWidth
            sx={{ mt: 2, textTransform: 'none' }} 
            onClick={() => router.push('/login')}
          >
            Already have an account? Login
          </Button>
        </Paper>
      </Box>
    </Container>
  );
}