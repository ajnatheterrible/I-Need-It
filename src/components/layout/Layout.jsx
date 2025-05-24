import { Box } from "@chakra-ui/react";
import Navbar from "./Navbar";
import NavbarGuest from "./NavbarGuest";
import AuthModal from "../modals/AuthModal";
import ScrollToTop from "../shared/ScrollToTop";
import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import useAuthStore from "../../store/authStore";
import { useNavigate } from "react-router-dom";

export default function Layout() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const loadUserFromStorage = useAuthStore(
    (state) => state.loadUserFromStorage
  );
  const login = useAuthStore((state) => state.login);

  const navigate = useNavigate();

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authView, setAuthView] = useState("login");

  useEffect(() => {
    loadUserFromStorage();

    if (!isLoggedIn) {
      fetch("http://localhost:5000/api/auth/me", {
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.user) {
            if (!data.user.username) {
              navigate("/complete-signup");
            } else {
              login(data.user, null);
            }
          }
        })
        .catch((err) => {
          console.error("Not logged in via cookie", err);
        });
    }
  }, [isLoggedIn, loadUserFromStorage, login]);

  return (
    <Box minHeight="100vh">
      <ScrollToTop />

      {isLoggedIn ? (
        <Navbar />
      ) : (
        <NavbarGuest
          onOpenAuthModal={(view) => {
            setAuthView(view);
            setIsAuthOpen(true);
          }}
        />
      )}

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        view={authView}
        setView={setAuthView}
      />

      <Box pt={!isLoggedIn ? "72px" : undefined}>
        <Outlet />
      </Box>
    </Box>
  );
}
