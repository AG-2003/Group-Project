// pages/EmailLoginPage.tsx
import React, { useState } from "react";
import {
  VStack,
  Button,
  Flex,
  Box,
  Text,
  Input,
  IconButton,
  FormControl,
  InputGroup,
  InputRightElement,
  HStack,
} from "@chakra-ui/react";
import { ArrowBackIcon, ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useLocation, useNavigate } from "react-router-dom";
import {
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../../firebase-config";
import "./passwordForm.scss";

export function LoginPasswordForm() {
  const [pwd, setPwd] = useState("");

  const [isPwdIncorrect, setIsPwdIncorrect] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);



  const navigate = useNavigate();

  const location = useLocation();
  const email = location.state?.email;

  const [showPwd, setShowPwd] = useState(false);
  const toggleShowPwd = () => setShowPwd(!showPwd);

  async function handlePwdSubmit(e: any) {
    e.preventDefault();
    await signInWithEmailAndPassword(auth, email, pwd)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);
        setIsPwdIncorrect(false);
        setFailedAttempts(0);
        alert(`you have signed in into ${user.email}`);
        navigate("/index");
      })
      .catch((err) => {
        console.log(err.message);
        setIsPwdIncorrect(true);
        setFailedAttempts(prev => prev + 1); // Increment failed attempts
        console.log(failedAttempts)
        alert(err.code);
      });
  }

  const handleRecoveryEmailSubmission = (e: any) => {
    e.preventDefault();
    sendPasswordResetEmail(auth, email)
      .then(() => {
        console.log(`recovery mail sent to ${email}`);
        alert(
          `please change password through the link sent to your email ID ${email} and try again `
        );
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  return (
    <HStack className="login-form-container" spacing={0}>
      <VStack className="form-stack">
        <FormControl as="form" onSubmit={handlePwdSubmit}>
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
            <Text className="form-title">Login to your account</Text>
          </Flex>

          <Text className="form-subtitle">
            using <span style={{ fontStyle: "italic" }}>{email}</span>
          </Text>

          <InputGroup>
            <Input
              className={`pwd-input ${isPwdIncorrect ? 'input-incorrect' : ''}`}
              placeholder="Enter password"
              type={showPwd ? "text" : "password"}
              value={pwd}
              onChange={(e) => {
                setPwd(e.target.value);
                setIsPwdIncorrect(false);
                // setFailedAttempts(0);
              }}
            />
            <InputRightElement className="pwd-icon">
              <IconButton
                icon={showPwd ? <ViewOffIcon /> : <ViewIcon />}
                onClick={toggleShowPwd}
                aria-label={showPwd ? "Hide password" : "Show password"}
                variant="relative"
              />
            </InputRightElement>
          </InputGroup>

          <Button
            // isDisabled={!pwd || !verifyPwd}
            isDisabled={!pwd}
            className="auth-button"
            // onClick={handlePwdSubmit}
            type="submit"
          >
            Continue
          </Button>

          <Text className={`forgot ${failedAttempts > 3 ? 'incorrect-input' : ''}`}
            onClick={handleRecoveryEmailSubmission}>
            Forgot Password?
          </Text>
        </FormControl>
      </VStack>
      <Box className="empty-stack"></Box>
    </HStack>
  );
}
