'use client';

import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { label: "Dashboard", path: "/" },
    { label: "Items", path: "/items" },
    { label: "Add Item", path: "/add-item" },
    { label: "Requests", path: "/requests" },
  ];

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: 'rgba(11,18,32,0.7)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)'
      }}
    >
      <Toolbar sx={{ maxWidth: '1200px', width: '100%', mx: 'auto' }}>
        
        {/* 🔷 BRAND */}
        <Typography
          variant="h6"
          onClick={() => router.push("/")}
          sx={{
            flexGrow: 1,
            cursor: "pointer",
            fontWeight: 700,
            letterSpacing: 0.5,
            color: '#E5E7EB',
            '&:hover': { opacity: 0.85 }
          }}
        >
          Borrow<span style={{ color: '#3B82F6' }}>Box</span>
        </Typography>

        {/* 🔷 NAV LINKS */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          {navItems.map((item) => {
            const active = pathname === item.path;

            return (
              <Button
                key={item.path}
                onClick={() => router.push(item.path)}
                sx={{
                  color: active ? '#E5E7EB' : '#94A3B8',
                  fontWeight: 500,
                  textTransform: 'none',
                  px: 2,
                  borderRadius: 2,
                  background: active ? 'rgba(59,130,246,0.15)' : 'transparent',
                  '&:hover': {
                    background: 'rgba(59,130,246,0.12)',
                    color: '#E5E7EB'
                  }
                }}
              >
                {item.label}
              </Button>
            );
          })}
        </Box>

      </Toolbar>
    </AppBar>
  );
}