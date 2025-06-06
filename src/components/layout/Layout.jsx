import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import useAuthStore from "../../store/authStore";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthModalContext } from "../../context/AuthModalContext";

import { Box } from "@chakra-ui/react";
import Navbar from "./Navbar";
import NavbarGuest from "./NavbarGuest";
import AuthModal from "../modals/AuthModal";
import ScrollToTop from "../shared/ScrollToTop";
import OAuthErrorModal from "../modals/OAuthErrorModal";

export default function Layout() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const initialized = useAuthStore((state) => state.initialized);
  const loadUserFromStorage = useAuthStore(
    (state) => state.loadUserFromStorage
  );
  const login = useAuthStore((state) => state.login);

  const navigate = useNavigate();

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authView, setAuthView] = useState("login");

  const onOpenAuthModal = (view) => {
    setAuthView(view);
    setIsAuthOpen(true);
  };

  useEffect(() => {
    loadUserFromStorage();

    if (initialized && !isLoggedIn) {
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
  }, [initialized, isLoggedIn, loadUserFromStorage, login]);

  const location = useLocation();
  const [oauthError, setOAuthError] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const errorParam = params.get("error");

    if (errorParam) {
      setOAuthError(errorParam);
    }
  }, [location.search]);

  const handleOAuthModalClose = () => {
    setOAuthError(null);

    const params = new URLSearchParams(location.search);
    params.delete("error");
    const newPath =
      location.pathname + (params.toString() ? `?${params.toString()}` : "");
    window.history.replaceState({}, "", newPath);
  };

  return (
    <AuthModalContext.Provider value={onOpenAuthModal}>
      <Box minHeight="100vh">
        <ScrollToTop />

        {isLoggedIn ? <Navbar /> : <NavbarGuest />}

        <AuthModal
          isOpen={isAuthOpen}
          onClose={() => setIsAuthOpen(false)}
          view={authView}
          setView={setAuthView}
        />

        <Box pt={!isLoggedIn ? "72px" : undefined}>
          <Outlet
            context={{
              onOpenAuthModal: (view) => {
                setAuthView(view);
                setIsAuthOpen(true);
              },
            }}
          />
        </Box>

        <OAuthErrorModal
          isOpen={!!oauthError}
          onClose={handleOAuthModalClose}
          errorType={oauthError}
        />
      </Box>
    </AuthModalContext.Provider>
  );
}
