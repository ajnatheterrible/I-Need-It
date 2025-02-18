import { Box } from "@chakra-ui/react";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <Box>
      <Navbar />
      <Box mt="4">
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
