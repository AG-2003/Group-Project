import React, { useState } from "react";
import {
  VStack,
  Button,
  Flex,
  Box,
  Input,
  IconButton,
  HStack,
  Text,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase-config";
import "./emailForm.scss";
import authBg from "../../assets/auth-bg.png";

export function LoginEmailForm() {
  const [email, setEmail] = useState<string>("");

  const navigate = useNavigate();

  const handleEmailSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    try {
      const emailExists = await checkEmailInDatabase(email);

      if (emailExists) {
        navigate("/loginPassword", { state: { email: email } });
      } else {
        navigate("/signUpEmail", { state: { email: email } });
      }
    } catch (err) {
      console.error("Error handling email submission:", err);
    }
  };

  const checkEmailInDatabase = async (email: string) => {
    const usersCollectionRef = collection(db, "users");
    try {
      const data = await getDocs(usersCollectionRef);
      const userEmails = data.docs.map((doc) => doc.data().email);
      return userEmails.some((userEmail) => userEmail === email);
    } catch (err) {
      console.log(err);
      return false;
    }
  };

  return (
    <HStack className="login-form-container" spacing={0}>
      <VStack className="form-stack">
        <Flex>
          <IconButton
            fontSize="x-large"
            aria-label="Back-button"
            icon={<ArrowBackIcon />}
            colorScheme="purple.100"
            color="black"
            onClick={() => navigate(-1)}
            mr={2}
          />
          <Text className="form-title">Continue with Email</Text>
        </Flex>
        <Text className="form-subtitle">
          We'll check if you have an account, and help create one if you don't.
        </Text>
        <form onSubmit={handleEmailSubmit}>
          <Input
            className="email-input"
            placeholder="Enter email (work or personal)"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button className="auth-button" type="submit" isDisabled={!email}>
            Continue
          </Button>
        </form>
      </VStack>
      <Box className="empty-stack"></Box>
    </HStack>
  );
}
