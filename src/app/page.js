'use client';

import { useState, useEffect } from 'react';
import { Typography, Container, Card, CardContent, Button, Grid, Box } from "@mui/material";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";

export default function Dashboard() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState({ name: "Guest", credits: 0 });

  useEffect(() => {
    setMounted(true);
    
    // Check if a user is "logged in" in the browser storage
    const loggedInUser = localStorage.getItem('borrowbox_user');
    
    if (!loggedInUser) {
      // If no user found, kick them to the login page
      router.push('/login');
    } else {
      // If found, load their data onto the dashboard
      setUser(JSON.parse(loggedInUser));
    }
  }, [router]);

  // Prevents flickering during redirect
  if (!mounted) return null;

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#000' }}>
      <Navbar />
      <Container style={{ marginTop: "40px" }}>
        <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
          Welcome, {user.name}
        </Typography>

        <Card style={{ marginTop: "20px", background: "#e3f2fd", borderRadius: '12px' }}>
          <CardContent>
            <Typography variant="h6" color="black">Your Credits</Typography>
            <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
              {user.credits || 50}
            </Typography>
            <Typography color="textSecondary">Earn credits by lending items!</Typography>
          </CardContent>
        </Card>

        <Grid container spacing={2} style={{ marginTop: "30px" }}>
          <Grid item>
            <Button 
              variant="contained" 
              size="large"
              onClick={() => router.push("/items")}
              sx={{ px: 4 }}
            >
              Browse Items
            </Button>
          </Grid>

          <Grid item>
            <Button 
              variant="outlined" 
              size="large"
              sx={{ color: 'white', borderColor: 'white', px: 4 }} 
              onClick={() => router.push("/add-item")}
            >
              Add Item
            </Button>
          </Grid>

          <Grid item>
            <Button 
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