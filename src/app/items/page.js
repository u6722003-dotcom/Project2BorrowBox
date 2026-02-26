'use client';

import { useState, useEffect } from 'react';
import { Container, Typography, Card, CardContent, CardMedia, Grid, Box, CircularProgress, Button, Alert } from '@mui/material';
import Navbar from '@/components/Navbar';

export default function ItemsList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // 1. Get the logged-in user from the session we built
    const user = JSON.parse(localStorage.getItem('borrowbox_user'));
    setCurrentUser(user);

    // 2. Fetch the items from MongoDB
    fetch('/api/items')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setItems(data.data);
        }
        setLoading(false);
      });
  }, []);

  const handleBorrow = async (item) => {
    if (!currentUser) return setStatus({ type: 'error', msg: 'Please login first' });
    
    // Check if user is trying to borrow their own item
    if (currentUser._id === item.ownerId) {
      return setStatus({ type: 'error', msg: "You cannot borrow your own item!" });
    }

    // 3. Call the Borrow API to exchange credits
    const res = await fetch('/api/borrow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        itemId: item._id,
        borrowerId: currentUser._id,
        lenderId: item.ownerId
      }),
    });

    const data = await res.json();
    if (data.success) {
      setStatus({ type: 'success', msg: `Success! 10 credits deducted. You borrowed: ${item.name}` });
      // Update local storage so the dashboard stays in sync
      const updatedUser = { ...currentUser, credits: currentUser.credits - 10 };
      localStorage.setItem('borrowbox_user', JSON.stringify(updatedUser));
    } else {
      setStatus({ type: 'error', msg: data.error || 'Transaction failed' });
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#121212', pb: 4 }}>
      <Navbar />
      <Container style={{ marginTop: '40px' }}>
        <Typography variant="h4" sx={{ color: 'white', mb: 4, fontWeight: 'bold' }}>Available Items</Typography>
        
        {status.msg && <Alert severity={status.type} sx={{ mb: 3 }}>{status.msg}</Alert>}

        {loading ? (
          <CircularProgress color="inherit" />
        ) : (
          <Grid container spacing={3}>
            {items.map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item._id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  {/* Shows the picture Andrei asked for */}
                  <CardMedia
                    component="img"
                    height="160"
                    image={item.imageUrl || "https://via.placeholder.com/150"}
                    alt={item.name}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>{item.name}</Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                      Owner: {item.ownerName || 'Unknown Student'}
                    </Typography>
                    <Typography variant="body2" color="black">
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
                      Borrow (10 Credits)
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