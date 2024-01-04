import React, { useEffect } from "react";
import { VStack, Button, Box, HStack, Text } from "@chakra-ui/react";
import { FaGoogle, FaMicrosoft, FaMailBulk } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
  auth,
  googleProvider,
  db,
  microsoftProvider,
} from "../../firebase-config";
import { getRedirectResult, signInWithRedirect } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { User } from "firebase/auth"; // Import the User type from your Firebase authentication library
import "./loginForm.scss";
import authBg from "../../assets/auth-bg.png";

export function LoginForm() {
  const navigate = useNavigate(); // Initialize the navigate function

  const handleEmailLoginClick = () => {
    navigate("/loginEmail");
  };

  let signInMethod = "";
  const signInWithGoogle = async () => {
    // Initiates the Google sign-in redirect when this function is called
    try {
      signInMethod = "g";
      await signInWithRedirect(auth, googleProvider);
    } catch (err) {
      console.log(err);
    }
  };

  const signInWithMicrosoft = async () => {
    try {
      // Use signInWithRedirect for Microsoft
      signInMethod = "m";
      await signInWithRedirect(auth, microsoftProvider);
      navigate("/index");
    } catch (err) {
      console.error(err);
    }
  };

  const saveGoogleUserToFirestore = async (user: User) => {
    if (user != null) {
      const userRef = doc(db, "users", user.uid);
      setDoc(userRef, {
        email: user?.email,
      });
    }
  };

  const saveMicrosoftUserToFirestore = (user: User | null) => {
    if (user != null) {
      const userRef = doc(db, "users", user.uid);
      setDoc(userRef, {
        email: user?.email,
      });
    }
  };

  const handleRedirectSignIn = async () => {
    try {
      const result = await getRedirectResult(auth);
      const user = result?.user;
      if (user) {
        if (signInMethod == "g") {
          await saveGoogleUserToFirestore(user);
        } else {
          await saveMicrosoftUserToFirestore(user);
        }
        navigate("/index"); // Navigate to /index here
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    handleRedirectSignIn();
  }, []);

  return (
    <div>
      <img src={authBg} alt="Auth Background" className="background-image" />
      <HStack className="login-form-container" spacing={0}>
        <VStack className="form-stack">
          <Text className="form-title">Log in or sign up</Text>
          <Text className="form-subtitle">
            Use your email or another service and continue to Joints
          </Text>

          <Button
            leftIcon={<FaGoogle />}
            className="button-google"
            onClick={signInWithGoogle}
          >
            Continue with Google
          </Button>
          <Button
            leftIcon={<FaMicrosoft />}
            className="button-microsoft"
            onClick={signInWithMicrosoft}
          >
            Continue with Microsoft
          </Button>
          <Button
            leftIcon={<FaMailBulk />}
            className="button-email"
            onClick={handleEmailLoginClick}
          >
            Continue with Email
          </Button>
        </VStack>
        <Box className="empty-stack"></Box>
      </HStack>
    </div>
  );
}
