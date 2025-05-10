// src/components/Layout.jsx
import { Box } from "@chakra-ui/react";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
import ScrollToTop from "./ScrollToTop";

export default function Layout() {
  return (
    <Box minHeight="100vh">
      <ScrollToTop />
      <Navbar />
      <Outlet />
    </Box>
  );
}
