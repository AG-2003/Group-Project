import React, { createContext, useEffect, useState, ReactNode } from "react";
import { auth } from "../firebase-config";
import { onAuthStateChanged, User } from "firebase/auth";

// Define the shape of the context's value
interface AuthContextType {
  currentUser: User | null;
}

// Provide a default value matching the AuthContextType
export const AuthContext = createContext<AuthContextType>({
  currentUser: null,
});

// Define the props for the provider, specifying the type for children
interface AuthContextProviderProps {
  children: ReactNode;
}

export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({
  children,
}) => {
  // State is now typed with User | null
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user); // user is already typed by onAuthStateChanged
      console.log(user);
    });

    // Unsubscribing from the listener when the component unmounts
    return () => {
      unsub();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};
