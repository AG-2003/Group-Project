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
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc, collection, DocumentData } from "firebase/firestore";
import { db } from "../../firebase-config";
import "./passwordForm.scss";
import { UseToastNotification } from "../../utils/UseToastNotification";
import { initialBadges } from "../../utils/Tasks";

export function SignUpPasswordForm() {

  const navigate = useNavigate();
  const location = useLocation();
  const showToast = UseToastNotification();

  const email: string = location.state?.email; // getting the email the user entered earlier

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
        const userRef = doc(usersCollectionRef, user.email as string);

        await setDoc(userRef, {
          email: user?.email,
          emailVerified: user?.emailVerified,
          displayName: user.displayName,
          desc: null,
          userType: "",
          userTheme: "light",
          photoURL: user.photoURL,
          sheets: [],
          Badges: initialBadges
        } as DocumentData);
        showToast('success', `you have successfully created an account`)
        setTimeout(() => { navigate("/index") }, 1000)

      })
      .catch((err) => {
        console.log(
          `this is the error code: ${err.code} and this is the message: ${err.message}`
        );
        showToast('error', `${err}`);
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
        </FormControl>
      </VStack>
      <Box className="empty-stack"></Box>
    </HStack>
  );
}

