import { useEffect } from "react";
import { VStack, Button, Box, HStack, Text } from "@chakra-ui/react";
import { FaGoogle, FaMicrosoft, FaMailBulk } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
  auth,
  googleProvider,
  db,
  microsoftProvider,
} from "../../firebase-config";
import {
  getRedirectResult,
  signInWithRedirect,
} from "firebase/auth";
import { setDoc, doc, DocumentData, getDoc } from "firebase/firestore";
import { User } from "firebase/auth"; // Import the User type from your Firebase authentication library
import "./loginForm.scss";
import { useAuthState } from "react-firebase-hooks/auth";
import { BadgesType } from "../../interfaces/BadgesType";
import { initialBadges } from "../../utils/Tasks";

export function LoginForm() {
  const navigate = useNavigate(); // Initialize the navigate function
  const [user] = useAuthState(auth);


  //Remove the line if you want to test out log In page
  if (user != null) {
    navigate("/index");
  }

  const handleEmailLoginClick = () => {
    navigate("/loginEmail");
  };

  const signInWithGoogle = async () => {
    // Initiates the Google sign-in redirect when this function is called
    try {
      await signInWithRedirect(auth, googleProvider);
    } catch (err) {
      console.log(err);
    }
  };

  const signInWithMicrosoft = async () => {
    try {
      // Use signInWithRedirect for Microsoft
      await signInWithRedirect(auth, microsoftProvider);
    } catch (err) {
      console.error(err);
    }
  };

  const saveUser = async (user: User) => {
    if (user != null) {
      const userRef = doc(db, "users", user.email as string);
      const docSnapshot = await getDoc(userRef);
      if (!docSnapshot.exists()) {
        // setting the status for email verified here when creating an account through google/microsoft
        const emailVerifiedBadge = {
          name: 'Verify email',
          status: user.emailVerified
        };
        const otherBadges = initialBadges.filter(badge => badge.name !== 'Verify email');
        const allBadges = [emailVerifiedBadge, ...otherBadges];

        // User document does not exist, create a new one
        await setDoc(userRef, {
          email: user.email,
          emailVerified: user.emailVerified,
          displayName: user.displayName,
          desc: null,
          userType: "",
          userTheme: "light",
          photoURL: user.photoURL,
          sheets: [],
          Badges: allBadges,
          isFirstTime: true
        } as DocumentData);
      }
      // If the document exists, the user is already in the database, so you can proceed with the login
    }
  };


  const handleRedirectSignIn = async () => {
    try {
      const result = await getRedirectResult(auth);
      const user = result?.user;
      console.log(user);
      if (user) {
        await saveUser(user);

        navigate("/index"); // Navigate to /index here
      }
    } catch (error: any) {
      alert(error);
    }
  };

  useEffect(() => {
    handleRedirectSignIn();
  }, []);

  return (
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
  );
}
