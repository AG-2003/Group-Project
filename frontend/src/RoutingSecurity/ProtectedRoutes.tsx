import { Outlet, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../firebase-config';
import { useState, useEffect } from "react";
import { User } from "firebase/auth";

type AuthStateChangedResult = User | null;

function authStatus(): Promise<boolean> {
  return new Promise((resolve) => {
    onAuthStateChanged(auth, (currentUser: AuthStateChangedResult) => {
      const isAuthenticated = currentUser !== null;
      resolve(isAuthenticated);
    });
  });
}


function ProtectedRoutes() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authCheckComplete, setAuthCheckComplete] = useState(false);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const isAuthenticatedResult = await authStatus();
        setIsAuthenticated(isAuthenticatedResult);
      } catch (error) {
        console.error('Error checking authentication status:', error);
      } finally {
        setAuthCheckComplete(true);
      }
    };

    checkAuthStatus();
  }, []);

  // Render based on the authentication status
  return authCheckComplete ? (isAuthenticated ? <Outlet /> : <Navigate to='/auth' />) : null;
}

export default ProtectedRoutes;
