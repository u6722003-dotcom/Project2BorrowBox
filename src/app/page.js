'use client';

import { useState, useEffect } from 'react';
import {
  Typography, Container, Card, CardContent, Grid,
  Box, CircularProgress, Button, Divider
} from "@mui/material";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';

export default function Dashboard() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({ name: "Guest", credits: 50 });

  useEffect(() => {
    setMounted(true);

    const syncUser = async () => {
      const stored = localStorage.getItem('borrowbox_user');
      if (!stored) return router.push('/login');

      const parsed = JSON.parse(stored);

      try {
        const res = await fetch(`/api/users/${parsed._id}`, { cache: 'no-store' });
        const data = await res.json();

        if (data.success) {
          setUser(data.data);
          localStorage.setItem('borrowbox_user', JSON.stringify(data.data));
        } else {
          setUser(parsed);
        }
      } catch {
        setUser(parsed);
      } finally {
        setLoading(false);
      }
    };

    syncUser();
  }, [router]);

  if (!mounted) return null;

  return (
    <Box sx={{ minHeight: '100vh', background: '#0B1220' }}>
      <Navbar />

      <Container maxWidth="lg" sx={{ py: 5 }}>
        {/* HEADER */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ color: '#E5E7EB', fontWeight: 700 }}>
            Welcome back, {user.name}
          </Typography>
          <Typography sx={{ color: '#94A3B8', mt: 1 }}>
            Manage your shared items and grow your community credits.
          </Typography>
        </Box>

        {/* PRIMARY CARD — CREDIT HIGHLIGHT */}
        <Card sx={primaryCard}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography sx={{ color: '#94A3B8' }}>
                  Available Credits
                </Typography>

                {loading ? (
                  <CircularProgress size={26} sx={{ mt: 1 }} />
                ) : (
                  <Typography variant="h2" sx={{ color: '#E5E7EB', fontWeight: 700 }}>
                    {user.credits ?? 50}
                  </Typography>
                )}

                <Typography sx={{ color: '#94A3B8', mt: 1 }}>
                  Earn credits by lending your items to others.
                </Typography>
              </Box>

              <AccountBalanceWalletOutlinedIcon sx={{ fontSize: 64, color: '#2563EB', opacity: 0.9 }} />
            </Box>
          </CardContent>
        </Card>

        {/* SECONDARY GRID */}
        <Grid container spacing={3} sx={{ mt: 1 }}>
          {/* QUICK ACTIONS */}
          <Grid item xs={12} md={8}>
            <Card sx={cardStyle}>
              <CardContent>
                <Typography variant="h6" sx={sectionTitle}>
                  Quick Actions
                </Typography>

                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <ActionCard
                    icon={<Inventory2OutlinedIcon />}
                    title="Browse Items"
                    desc="Discover items you can borrow from others."
                    onClick={() => router.push("/items")}
                  />
                  <ActionCard
                    icon={<AddCircleOutlineIcon />}
                    title="Add Item"
                    desc="Share something and start earning credits."
                    onClick={() => router.push("/add-item")}
                  />
                  <ActionCard
                    icon={<AssignmentOutlinedIcon />}
                    title="Borrow Requests"
                    desc="Review and respond to requests."
                    onClick={() => router.push("/requests")}
                  />
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* SIDE INFO */}
          <Grid item xs={12} md={4}>
            <Card sx={cardStyle}>
              <CardContent>
                <Typography variant="h6" sx={sectionTitle}>
                  Tips to Earn More
                </Typography>

                <InfoItem text="Add high-demand tools like drills or ladders." />
                <InfoItem text="Respond quickly to requests to build trust." />
                <InfoItem text="Keep items in good condition for better ratings." />
              </CardContent>
            </Card>
          </Grid>
        </Grid>

      </Container>
    </Box>
  );
}

/* 🔹 Components */

function ActionCard({ icon, title, desc, onClick }) {
  return (
    <Grid item xs={12} sm={4}>
      <Card sx={actionCard} onClick={onClick}>
        <CardContent>
          <Box sx={{ color: '#2563EB' }}>{icon}</Box>
          <Typography sx={{ color: '#E5E7EB', fontWeight: 600, mt: 1 }}>
            {title}
          </Typography>
          <Typography sx={{ color: '#94A3B8', fontSize: 14 }}>
            {desc}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
}

function InfoItem({ text }) {
  return (
    <Box sx={{ mt: 2 }}>
      <Typography sx={{ color: '#94A3B8', fontSize: 14 }}>
        • {text}
      </Typography>
      <Divider sx={{ mt: 2, borderColor: 'rgba(255,255,255,0.05)' }} />
    </Box>
  );
}

/* 🎨 Styles */

const primaryCard = {
  background: '#182033',
  borderRadius: 4,
  boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
  mb: 3
};

const cardStyle = {
  background: '#111827',
  borderRadius: 4,
  boxShadow: '0 6px 20px rgba(0,0,0,0.35)'
};

const actionCard = {
  background: '#1F2937',
  borderRadius: 3,
  cursor: 'pointer',
  transition: '0.2s',
  '&:hover': {
    background: '#263244',
    transform: 'translateY(-2px)'
  }
};

const sectionTitle = {
  color: '#E5E7EB',
  fontWeight: 600
};