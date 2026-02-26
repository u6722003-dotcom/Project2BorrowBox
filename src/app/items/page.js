'use client';

import { useState, useEffect } from 'react';
import {
  Container, Typography, Card, CardContent, CardMedia, Grid,
  Box, CircularProgress, Button, Alert, Chip
} from '@mui/material';
import Navbar from '@/components/Navbar';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';

export default function ItemsList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [currentUser, setCurrentUser] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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

    if (currentUser._id === item.ownerId) {
      return setStatus({ type: 'error', msg: "You can't borrow your own item!" });
    }

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
      setStatus({ type: 'success', msg: `Success! 10 credits exchanged. You borrowed: ${item.name}` });

      const updatedUser = { ...currentUser, credits: (currentUser.credits || 50) - 10 };
      localStorage.setItem('borrowbox_user', JSON.stringify(updatedUser));

      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    } else {
      setStatus({ type: 'error', msg: data.error || 'Transaction failed' });
    }
  };

  if (!mounted) return null;

  return (
    <Box sx={{ minHeight: '100vh', background: '#0B1220' }}>
      <Navbar />

      <Container maxWidth="lg" sx={{ py: 5 }}>
        {/* HEADER */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ color: '#E5E7EB', fontWeight: 700 }}>
            Available Items
          </Typography>
          <Typography sx={{ color: '#94A3B8', mt: 1 }}>
            Borrow useful items from the community using your credits.
          </Typography>
        </Box>

        {/* STATUS ALERT */}
        {status.msg && (
          <Alert
            severity={status.type}
            sx={{
              mb: 3,
              borderRadius: 2,
              background: status.type === 'success'
                ? 'rgba(34,197,94,0.12)'
                : 'rgba(239,68,68,0.12)',
              color: status.type === 'success' ? '#22C55E' : '#EF4444'
            }}
          >
            {status.msg}
          </Alert>
        )}

        {/* LOADING */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
            <CircularProgress />
          </Box>
        ) : items.length === 0 ? (
          /* EMPTY STATE */
          <Card sx={emptyCard}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Inventory2OutlinedIcon sx={{ fontSize: 48, color: '#3B82F6' }} />
              <Typography sx={{ color: '#E5E7EB', mt: 2, fontWeight: 600 }}>
                No items available
              </Typography>
              <Typography sx={{ color: '#94A3B8', mt: 1 }}>
                Check back later or add your own item to help others.
              </Typography>
            </CardContent>
          </Card>
        ) : (
          /* GRID */
          <Grid container spacing={3} alignItems="stretch">
            {items.map((item) => {
              const isOwner = currentUser?._id === item.ownerId;

              return (
                <Grid item xs={12} sm={6} md={4} key={item._id}>
                  <Card sx={itemCard}>
                    <CardMedia
                      component="img"
                      image={item.imageUrl || "https://via.placeholder.com/400x250"}
                      alt={item.name}
                      sx={{
                        height: 170,
                        objectFit: 'cover'
                      }}
                    />

                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography sx={itemTitle}>
                        {item.name}
                      </Typography>

                      <Typography sx={ownerText}>
                        Owner: {item.ownerName || 'Community Member'}
                      </Typography>

                      <Typography sx={itemDesc}>
                        {item.description || "No description provided."}
                      </Typography>

                      {/* STATUS */}
                      <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                        <Chip label="Available" size="small" sx={chipAvailable} />
                        <Chip label="10 Credits" size="small" sx={chipCredits} />
                      </Box>
                    </CardContent>

                    {/* ACTION */}
                    <Box sx={{ p: 2 }}>
                      <Button
                        fullWidth
                        variant="contained"
                        onClick={() => handleBorrow(item)}
                        disabled={isOwner}
                        sx={borrowBtn}
                      >
                        {isOwner ? "Your Item" : "Borrow Item"}
                      </Button>
                    </Box>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Container>
    </Box>
  );
}

/* 🎨 Styles */

const itemCard = {
  background: '#111827',
  borderRadius: 4,
  overflow: 'hidden',
  boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
  transition: '0.25s',
  display: 'flex',
  flexDirection: 'column',
  height: '100%',   // ensures equal height
  '&:hover': {
    transform: 'translateY(-6px)',
    background: '#182033'
  }
};

const itemTitle = {
  color: '#E5E7EB',
  fontWeight: 600,
  fontSize: 18
};

const ownerText = {
  color: '#94A3B8',
  fontSize: 13,
  mt: 0.5
};

const itemDesc = {
  color: '#94A3B8',
  fontSize: 14,
  mt: 1,
  display: '-webkit-box',
  WebkitLineClamp: 2,   // limits to 2 lines
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  minHeight: 42
};

const borrowBtn = {
  background: '#2563EB',
  textTransform: 'none',
  fontWeight: 600,
  '&:hover': { background: '#1D4ED8' },
  '&.Mui-disabled': {
    background: '#1F2937',
    color: '#6B7280'
  }
};

const chipAvailable = {
  background: 'rgba(34,197,94,0.15)',
  color: '#22C55E'
};

const chipCredits = {
  background: 'rgba(59,130,246,0.15)',
  color: '#3B82F6'
};

const emptyCard = {
  background: '#111827',
  borderRadius: 4,
  boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
  py: 6
};