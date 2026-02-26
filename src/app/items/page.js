'use client';

import { useState, useEffect } from 'react';
import { Container, Typography, Card, CardContent, CardMedia, Grid, Box, CircularProgress, Button, Alert } from '@mui/material';
import Navbar from '@/components/Navbar';

export default function ItemsList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [currentUser, setCurrentUser] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // Fixes the Hydration Error
    const user = JSON.parse(localStorage.getItem('borrowbox_user'));
    setCurrentUser(user);

    fetch('/api/items')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setItems(data.data);
        setLoading(false);
      });
  }, []);

  const handleBorrow = async (item) => {
    if (!currentUser) return setStatus({ type: 'error', msg: 'Please login first' });
    
    // Safety check: Cannot borrow your own item
    if (currentUser._id === item.ownerId) {
      return setStatus({ type: 'error', msg: "You can't borrow your own item!" });
    }

    // Call the Borrow API to exchange credits between the two users
    const res = await fetch('/api/borrow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        itemId: item._id,
        borrowerId: currentUser._id, // The Test User
        lenderId: item.ownerId       // nayminkhant (the owner)
      }),
    });

    const data = await res.json();
    if (data.success) {
      setStatus({ type: 'success', msg: `Success! 10 credits exchanged. You borrowed: ${item.name}` });
      
      // Update local storage so the Test User's screen shows the deduction (-10)
      const updatedUser = { ...currentUser, credits: (currentUser.credits || 50) - 10 };
      localStorage.setItem('borrowbox_user', JSON.stringify(updatedUser));
      
      // Redirect to dashboard after 1.5 seconds to see the new balance
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    } else {
      setStatus({ type: 'error', msg: data.error || 'Transaction failed' });
    }
  };

  if (!mounted) return null; // Prevents the red Hydration Error screen

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#121212', pb: 4 }}>
      <Navbar />
      <Container sx={{ mt: 5 }}>
        <Typography variant="h4" sx={{ color: 'white', mb: 4, fontWeight: 'bold' }}>Available Items</Typography>
        
        {status.msg && <Alert severity={status.type} sx={{ mb: 3 }}>{status.msg}</Alert>}

        {loading ? (
          <CircularProgress color="inherit" />
        ) : (
          <Grid container spacing={3}>
            {items.map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item._id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardMedia
                    component="img"
                    height="160"
                    image={item.imageUrl || "https://via.placeholder.com/150"}
                    alt={item.name}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>{item.name}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      Owner: {item.ownerName || 'Unknown Student'}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {item.description}
                    </Typography>
                  </CardContent>
                  <Box sx={{ p: 2 }}>
                    <Button 
                      fullWidth 
                      variant="contained" 
                      onClick={() => handleBorrow(item)}
                      disabled={currentUser?._id === item.ownerId}
                    >
                      {currentUser?._id === item.ownerId ? "Your Item" : "Borrow (10 Credits)"}
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
}