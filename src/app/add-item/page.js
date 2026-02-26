'use client';

import { useState } from 'react';
import {
  Container, TextField, Button, Typography, Box,
  Alert, Card, CardContent, CardMedia
} from '@mui/material';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';

export default function AddItem() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [status, setStatus] = useState({ type: '', msg: '' });
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const loggedInUser = JSON.parse(localStorage.getItem('borrowbox_user'));

    if (!loggedInUser) {
      setStatus({ type: 'error', msg: 'You must be logged in to add an item.' });
      return;
    }

    const itemData = {
      name,
      description,
      imageUrl: imageUrl || "https://via.placeholder.com/400x250",
      ownerName: loggedInUser.name,
      ownerId: loggedInUser._id,
      creditsRequired: 10
    };

    const res = await fetch('/api/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(itemData),
    });

    if (res.ok) {
      setStatus({ type: 'success', msg: 'Item added successfully! Redirecting...' });
      setTimeout(() => router.push('/items'), 1500);
    } else {
      setStatus({ type: 'error', msg: 'Failed to add item.' });
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', background: '#0B1220', pb: 6 }}>
      <Navbar />

      <Container maxWidth="md" sx={{ mt: 6 }}>
        {/* HEADER */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ color: '#E5E7EB', fontWeight: 700 }}>
            List a New Item
          </Typography>
          <Typography sx={{ color: '#94A3B8', mt: 1 }}>
            Share items with the community and earn credits when others borrow them.
          </Typography>
        </Box>

        {/* STATUS */}
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

        <Card sx={formCard}>
          <CardContent>
            <form onSubmit={handleSubmit}>
              {/* ITEM NAME */}
              <TextField
                fullWidth
                label="Item Name"
                placeholder="e.g. Drill Machine, Camera, Projector"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                sx={inputStyle}
              />

              {/* IMAGE URL */}
              <TextField
                fullWidth
                label="Image URL (Optional)"
                placeholder="Paste an image link"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                sx={inputStyle}
              />

              {/* IMAGE PREVIEW */}
              {imageUrl && (
                <CardMedia
                  component="img"
                  image={imageUrl}
                  alt="Preview"
                  sx={previewImage}
                />
              )}

              {/* DESCRIPTION */}
              <TextField
                fullWidth
                label="Description"
                placeholder="Describe the item's condition, usage, and any important details."
                multiline
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                sx={inputStyle}
              />

              {/* INFO BOX */}
              <Box sx={infoBox}>
                <Typography sx={{ color: '#93C5FD', fontWeight: 600 }}>
                  Earn 10 credits
                </Typography>
                <Typography sx={{ color: '#94A3B8', fontSize: 14 }}>
                  Each time someone borrows your item.
                </Typography>
              </Box>

              {/* SUBMIT BUTTON */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={submitBtn}
              >
                Publish Item
              </Button>
            </form>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

/* 🎨 Styles */

const formCard = {
  background: '#111827',
  borderRadius: 4,
  boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
  p: 2
};

const inputStyle = {
  mb: 2,
  '& .MuiInputBase-root': {
    background: '#0F172A',
    color: '#E5E7EB'
  },
  '& .MuiInputLabel-root': {
    color: '#94A3B8'
  }
};

const previewImage = {
  width: '100%',
  height: 200,
  objectFit: 'cover',
  borderRadius: 2,
  mb: 2,
  mt: 1
};

const infoBox = {
  background: 'rgba(59,130,246,0.12)',
  border: '1px solid rgba(59,130,246,0.25)',
  borderRadius: 2,
  p: 2,
  mb: 3
};

const submitBtn = {
  background: '#2563EB',
  textTransform: 'none',
  fontWeight: 600,
  fontSize: 16,
  py: 1.5,
  '&:hover': { background: '#1D4ED8' }
};