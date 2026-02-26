'use client';

import { useState, useEffect } from 'react';
import {
  Container, Typography, Card, CardContent, Button,
  Grid, Box, CircularProgress, Chip
} from '@mui/material';
import Navbar from '@/components/Navbar';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';

export default function BorrowRequests() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/items')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setItems(data.data);
        setLoading(false);
      });
  }, []);

  const handleBorrow = (itemName) => {
    alert(`Request sent to borrow: ${itemName}`);
  };

  return (
    <Box sx={{ minHeight: '100vh', background: '#0B1220' }}>
      <Navbar />

      <Container maxWidth="lg" sx={{ py: 5 }}>
        {/* HEADER */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ color: '#E5E7EB', fontWeight: 700 }}>
            Borrow Items
          </Typography>
          <Typography sx={{ color: '#94A3B8', mt: 1 }}>
            Browse available items and send borrow requests to the community.
          </Typography>
        </Box>

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
                No items available yet
              </Typography>
              <Typography sx={{ color: '#94A3B8', mt: 1 }}>
                Be the first to share something with the community.
              </Typography>
            </CardContent>
          </Card>
        ) : (
          /* ITEMS GRID */
          <Grid container spacing={3}>
            {items.map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item._id}>
                <Card sx={itemCard}>
                  <CardContent>
                    {/* ICON */}
                    <Box sx={{ mb: 2, color: '#3B82F6' }}>
                      <Inventory2OutlinedIcon fontSize="large" />
                    </Box>

                    {/* NAME */}
                    <Typography sx={itemTitle}>
                      {item.name}
                    </Typography>

                    {/* DESCRIPTION */}
                    <Typography sx={itemDesc}>
                      {item.description || "No description provided."}
                    </Typography>

                    {/* STATUS */}
                    <Chip
                      label="Available"
                      size="small"
                      sx={{
                        mt: 2,
                        background: 'rgba(34,197,94,0.15)',
                        color: '#22C55E',
                        fontWeight: 500
                      }}
                    />

                    {/* ACTION */}
                    <Button
                      fullWidth
                      variant="contained"
                      sx={borrowBtn}
                      onClick={() => handleBorrow(item.name)}
                    >
                      Request to Borrow
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
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
  boxShadow: '0 8px 25px rgba(0,0,0,0.35)',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  transition: '0.25s',
  '&:hover': {
    transform: 'translateY(-4px)',
    background: '#182033'
  }
};

const itemTitle = {
  color: '#E5E7EB',
  fontWeight: 600,
  fontSize: 18
};

const itemDesc = {
  color: '#94A3B8',
  fontSize: 14,
  mt: 1,
  minHeight: 40
};

const borrowBtn = {
  mt: 3,
  background: '#2563EB',
  textTransform: 'none',
  fontWeight: 600,
  '&:hover': {
    background: '#1D4ED8'
  }
};

const emptyCard = {
  background: '#111827',
  borderRadius: 4,
  boxShadow: '0 8px 25px rgba(0,0,0,0.35)',
  py: 6
};