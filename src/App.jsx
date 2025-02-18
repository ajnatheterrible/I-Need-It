import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Spinner, Center } from "@chakra-ui/react";
import "./App.css";
import UserAuth from "./pages/UserAuth";
import Dashboard from "./pages/Dashboard";
import { initializeAuthListener } from "./firebase/auth-service";
import { useAuthStore } from "./store/auth-store";
import Layout from "./layouts/Layout";

// ProtectedRoute component
const ProtectedRoute = ({ children }) => {
  const currentUser = useAuthStore((state) => state.currentUser);
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  const loading = useAuthStore((state) => state.loading);
  const currentUser = useAuthStore((state) => state.currentUser);

  useEffect(() => {
    initializeAuthListener();
  }, []);

  if (loading) {
    return (
      <Center h="100vh">
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
        />
      </Center>
    );
  }

  return (
    <Routes>
      {/* Always render Layout */}
      <Route path="/" element={<Layout />}>
        {/* Redirect logged-in users away from login */}
        <Route
          path="login"
          element={
            currentUser ? <Navigate to="/dashboard" replace /> : <UserAuth />
          }
        />

        {/* Protected Routes */}
        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          index
          element={
            <Navigate to={currentUser ? "/dashboard" : "/login"} replace />
          }
        />

        {/* Catch-All Route */}
        <Route
          path="*"
          element={
            <Navigate to={currentUser ? "/dashboard" : "/login"} replace />
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
