import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  Flex,
  VStack,
  IconButton,
  Input,
  Button,
  Box,
  HStack,
  Text,
} from "@chakra-ui/react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import "./emailForm.scss";
import authBg from "../../assets/auth-bg.png";

export function SignUpEmailForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const email: string = location.state?.email; // the email user enters on the first process to see if the email already exists in the databse.

  const [emailS, setEmailS] = useState<string>(email); // the email the user decides to go with when creating an account, default value is kept as the above email.

  return (
    <div>
      <img src={authBg} alt="Auth Background" className="background-image" />
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
            <Text className="form-title">Create an account</Text>
          </Flex>
          <Text className="form-subtitle">
            As you don't have an account we will help you create one ! <br />
            Please enter the email address you'd like to use.
          </Text>
          <form
            onSubmit={() => {
              navigate("/signUpPwd", { state: { emailS: emailS } });
            }}
          >
            <Input
              className="email-input"
              placeholder="Enter email (work or personal)"
              type="email"
              value={emailS}
              onChange={(e) => setEmailS(e.target.value)}
            />
            <Button className="auth-button" type="submit" isDisabled={!emailS}>
              Continue
            </Button>
          </form>
        </VStack>
        <Box className="empty-stack"></Box>
      </HStack>
    </div>
  );
}
