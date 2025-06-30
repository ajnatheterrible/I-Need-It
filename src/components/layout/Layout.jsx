import { Outlet } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
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
  const location = useLocation();

  const fallbackRef = useRef(null);

  const [oauthError, setOAuthError] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authView, setAuthView] = useState("login");

  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);

  const onOpenAuthModal = (view) => {
    setAuthView(view);
    setIsAuthOpen(true);
  };

  const handleOAuthModalClose = () => {
    setOAuthError(null);

    const params = new URLSearchParams(location.search);
    params.delete("error");
    const newPath =
      location.pathname + (params.toString() ? `?${params.toString()}` : "");
    window.history.replaceState({}, "", newPath);
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const errorParam = params.get("error");

    if (errorParam) {
      setOAuthError(errorParam);
    }
  }, [location.search]);

  return (
    <AuthModalContext.Provider value={onOpenAuthModal}>
      <Box minHeight="100vh">
        <ScrollToTop />

        {isLoggedIn ? <Navbar /> : <NavbarGuest />}

        <Box
          ref={fallbackRef}
          tabIndex={-1}
          position="absolute"
          top={0}
          left={0}
          opacity={0}
          pointerEvents="none"
        />

        <AuthModal
          isOpen={isAuthOpen}
          onClose={() => setIsAuthOpen(false)}
          view={authView}
          setView={setAuthView}
          finalFocusRef={fallbackRef}
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
