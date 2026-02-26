'use client';

import { useState, useEffect } from 'react';
import { Typography, Container, Card, CardContent, Button, Grid, Box, CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";

export default function Dashboard() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({ name: "Guest", credits: 50 });

  useEffect(() => {
    setMounted(true); // Kills the red Hydration Error screen
    
    const forceRefreshCredits = async () => {
      const loggedInUser = localStorage.getItem('borrowbox_user');
      if (!loggedInUser) {
        router.push('/login');
        return;
      }

      const parsed = JSON.parse(loggedInUser);

      try {
        // FORCE SYNC: This bypasses cache to get the 60 credits from MongoDB
        const res = await fetch(`/api/users/${parsed._id}`, { 
          cache: 'no-store',
          headers: { 'Pragma': 'no-cache' }
        });
        
        const data = await res.json();
        
        if (data.success) {
          // Update the screen with the number from your screenshot
          setUser(data.data);
          // Update local memory so other pages stay in sync
          localStorage.setItem('borrowbox_user', JSON.stringify(data.data));
        } else {
          setUser(parsed);
        }
      } catch (err) {
        console.error("Sync failed:", err);
        setUser(parsed);
      } finally {
        setLoading(false);
      }
    };

    forceRefreshCredits();
  }, [router]);

  // Safety: Don't render until the browser is ready
  if (!mounted) return null;

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#000', pb: 5 }}>
      <Navbar />
      <Container style={{ marginTop: "40px" }}>
        <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
          Welcome, {user.name}
        </Typography>

        <Card style={{ marginTop: "20px", background: "#e3f2fd", borderRadius: '12px' }}>
          <CardContent>
            <Typography variant="h6" color="black">Your Live Balance</Typography>
            {loading ? (
              <CircularProgress size={30} sx={{ mt: 2 }} />
            ) : (
              <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                {/* This will now show 60 if the DB updated */}
                {user.credits !== undefined ? user.credits : 50}
              </Typography>
            )}
            <Typography color="textSecondary" sx={{ mt: 1 }}>
              {user.credits > 50 
                ? "🎉 Someone borrowed your item! Your credits grew." 
                : "Lend items to earn more credits!"}
            </Typography>
          </CardContent>
        </Card>

        <Grid container spacing={2} style={{ marginTop: "30px" }}>
          <Grid item xs={12} sm="auto">
            <Button 
              fullWidth
              variant="contained" 
              size="large"
              onClick={() => router.push("/items")}
              sx={{ px: 4 }}
            >
              Browse Items
            </Button>
          </Grid>
          <Grid item xs={12} sm="auto">
            <Button 
              fullWidth
              variant="outlined" 
              size="large"
              sx={{ color: 'white', borderColor: 'white', px: 4 }} 
              onClick={() => router.push("/add-item")}
            >
              Add Item
            </Button>
          </Grid>
          <Grid item xs={12} sm="auto">
            <Button 
              fullWidth
              variant="outlined" 
              size="large"
              sx={{ color: 'white', borderColor: 'white', px: 4 }} 
              onClick={() => router.push("/requests")}
            >
              Borrow Requests
            </Button>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}