'use client';

import { useState, useEffect } from 'react';
import { Typography, Container, Card, CardContent, Button, Grid, Box } from "@mui/material";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";

export default function Dashboard() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // This fix prevents the "Hydration Failed" error
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const user = {
    name: "Nay Min Khant",
    credits: 50,
  };

  return (
    <Box>
      <Navbar />
      <Container style={{ marginTop: "40px" }}>
        <Typography variant="h4" sx={{ color: 'white' }}>Welcome, {user.name}</Typography>

        <Card style={{ marginTop: "20px", background: "#e3f2fd" }}>
          <CardContent>
            <Typography variant="h6" color="black">Your Credits</Typography>
            <Typography variant="h3" color="black">{user.credits}</Typography>
            <Typography color="black">Earn credits by lending items!</Typography>
          </CardContent>
        </Card>

        <Grid container spacing={2} style={{ marginTop: "20px" }}>
          <Grid item>
            <Button variant="contained" onClick={() => router.push("/items")}>
              Browse Items
            </Button>
          </Grid>

          <Grid item>
            <Button variant="outlined" sx={{ color: 'white', borderColor: 'white' }} onClick={() => router.push("/add-item")}>
              Add Item
            </Button>
          </Grid>

          <Grid item>
            <Button variant="outlined" sx={{ color: 'white', borderColor: 'white' }} onClick={() => router.push("/requests")}>
              Borrow Requests
            </Button>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}