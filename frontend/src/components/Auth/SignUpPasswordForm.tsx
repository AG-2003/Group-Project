import { ArrowBackIcon, ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import {
  Flex,
  VStack,
  FormControl,
  IconButton,
  Input,
  Button,
  Box,
  Text,
  InputGroup,
  InputRightElement,
  HStack,
} from "@chakra-ui/react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { auth } from "../../firebase-config";
import {
  createUserWithEmailAndPassword,
  //   sendEmailVerification,
} from "firebase/auth";
import { setDoc, doc, collection } from "firebase/firestore";
import { db } from "../../firebase-config";
import authBg from "../../assets/auth-bg.png";
import "./passwordForm.scss";

export function SignUpPasswordForm() {
  const navigate = useNavigate();
  const location = useLocation();

  const email: string = location.state?.emailS; // getting the email the user entered earlier

  const [pwd, setPwd] = useState<string>("");
  const [rePwd, setRePwd] = useState<string>("");

  const [showPwd, setShowPwd] = useState(false);
  const toggleShowPwd = () => setShowPwd(!showPwd);

  const checkPwd = !(pwd === rePwd) || !pwd || !rePwd;

  async function handleSignUpButtonClick(e: any) {
    e.preventDefault();
    await createUserWithEmailAndPassword(auth, email, pwd)
      .then(async (userCredential) => {
        const user = userCredential.user;
        console.log(user);
        const usersCollectionRef = collection(db, "users");
        const userRef = doc(usersCollectionRef, email);

        await setDoc(userRef, {
          email: user.email,
          isVerified: user.emailVerified,
          userName: user.displayName,
        });
        navigate("/index");
      })
      .catch((err) => {
        console.log(
          `this is the error code: ${err.code} and this is the message: ${err.message}`
        );
      });
  }

  return (
    <HStack className="login-form-container" spacing={0}>
      <VStack className="form-stack">
        <FormControl as="form" onSubmit={handleSignUpButtonClick}>
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
            Please enter the password you would like to use for your account{" "}
            <span style={{ fontStyle: "italic" }}>{email}</span>
          </Text>
          <InputGroup>
            <Input
              className="pwd-input"
              placeholder="Enter password"
              type={showPwd ? "text" : "password"}
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
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

          <InputGroup>
            <Input
              className="pwd-input"
              placeholder="Re-enter password"
              type={showPwd ? "text" : "password"}
              value={rePwd}
              onChange={(e) => setRePwd(e.target.value)}
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

          <Button isDisabled={checkPwd} className="auth-button" type="submit">
            Continue
          </Button>

          <Text className="forgot">Haven't recieved email ? Resend.</Text>
        </FormControl>
      </VStack>
      <Box className="empty-stack"></Box>
    </HStack>
  );
}
