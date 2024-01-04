import React, { useState } from "react";
import {
  VStack,
  Button,
  Flex,
  Box,
  Text,
  Input,
  IconButton,
  HStack,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase-config";
import { sendPasswordResetEmail } from "firebase/auth";
import "./emailForm.scss";

export function ForgotPwdForm() {
  const [recEmail, setRecEmail] = useState<string>("");

  const navigate = useNavigate();

  const handleRecoveryEmailSubmission = (e: any) => {
    e.preventDefault();
    sendPasswordResetEmail(auth, recEmail)
      .then(() => {
        console.log(`recovery mail sent to ${recEmail}`);
        navigate(-1);
        alert(
          `please change password through the link sent to your email ID ${recEmail}`
        );
      })
      .catch((err) => {
        console.log(err.message);
      });
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
          <Text className="form-title">Password retrieval</Text>
        </Flex>
        <Text className="form-subtitle">
          You have entered an incorrect password. Please enter your email so we
          can send a verification mail.
        </Text>
        <form onSubmit={handleRecoveryEmailSubmission}>
          <Input
            className="email-input"
            placeholder="Enter email (work or personal)"
            type="email"
            value={recEmail}
            onChange={(e) => setRecEmail(e.target.value)}
          />
          <Button className="auth-button" type="submit" isDisabled={!recEmail}>
            Continue
          </Button>
        </form>
      </VStack>
      <Box className="empty-stack"></Box>
    </HStack>
  );
}
