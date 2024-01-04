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
import authBg from "../../assets/auth-bg.png";
import "./loginPasswordForm.scss";

export function LoginPasswordForm() {
  const [pwd, setPwd] = useState("");

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
        alert(`you have signed in into ${user.email}`);
        navigate("/index");
      })
      .catch((err) => {
        console.log(err.message);
        navigate("/forgotpwd"); // not implemented yet.
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

  //   return (
  //     <Flex
  //       justifyContent="center"
  //       alignItems="center"
  //       height="100vh"
  //       bg="purple.200"
  //     >
  //       <Box h="600px" w="500px" bg="purple.100" p={5}>
  //         <VStack height="100%">
  //           <FormControl
  //             display="flex-start"
  //             flexDirection="column"
  //             h="100%"
  //             ml={20}
  //             as="form"
  //             onSubmit={handlePwdSubmit}
  //           >
  //             <Flex alignItems="center" alignSelf="center" mb={3} mt={75}>
  //               <IconButton
  //                 fontSize="xx-large"
  //                 aria-label="Back-button"
  //                 icon={<ArrowBackIcon />}
  //                 colorScheme="purple.100"
  //                 color="black"
  //                 onClick={() => navigate(-1)}
  //               />
  //               <FormLabel
  //                 fontSize="xx-large"
  //                 fontWeight="bold"
  //                 color="blackAlpha.800"
  //                 ml={2}
  //               >
  //                 Login to your account
  //               </FormLabel>
  //             </Flex>

  //             <FormHelperText cursor="default" mb={20} alignSelf="center">
  //               using <span style={{ fontWeight: "bold" }}>{email}</span>
  //             </FormHelperText>

  //             <InputGroup h="8%" w="75%">
  //               <Input
  //                 placeholder="Enter password"
  //                 type={showPwd ? "text" : "password"}
  //                 value={pwd}
  //                 onChange={(e) => setPwd(e.target.value)}
  //                 focusBorderColor="purple.600"
  //                 borderColor="black"
  //                 borderWidth="2px"
  //                 _hover={{}}
  //               />
  //               <InputRightElement>
  //                 <IconButton
  //                   icon={showPwd ? <ViewOffIcon /> : <ViewIcon />}
  //                   onClick={toggleShowPwd}
  //                   aria-label={showPwd ? "Hide password" : "Show password"}
  //                   variant="relative"
  //                 />
  //               </InputRightElement>
  //             </InputGroup>

  //             <Button
  //               isDisabled={!pwd}
  //               h="8%"
  //               w="75%"
  //               mt={6}
  //               fontSize="large"
  //               variant="outline"
  //               borderWidth="2px"
  //               borderColor="black"
  //               _hover={{
  //                 bg: "purple.300",
  //                 color: "black",
  //                 transform: "scale(1.08)",
  //               }}
  //               alignSelf="center"
  //               type="submit"
  //             >
  //               Continue
  //             </Button>

  //             {/* Forgot Password text */}
  //             <Text
  //               color="black"
  //               cursor="pointer"
  //               onClick={handleRecoveryEmailSubmission}
  //               mt={10}
  //               _hover={{ textDecoration: "underline" }}
  //             >
  //               Forgot Password?
  //             </Text>
  //           </FormControl>
  //         </VStack>
  //       </Box>
  //       <Box h="600px" w="500px" bg="#857385">
  //         {/* Other content */}
  //       </Box>
  //     </Flex>
  //   );
  // }

  return (
    <div>
      <img src={authBg} alt="Auth Background" className="background-image" />
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
              using <span>{email}</span>
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

            <Button
              // isDisabled={!pwd || !verifyPwd}
              isDisabled={!pwd}
              className="auth-button"
              // onClick={handlePwdSubmit}
              type="submit"
            >
              Continue
            </Button>

            <Text className="forgot" onClick={handleRecoveryEmailSubmission}>
              Forgot Password?
            </Text>
          </FormControl>
        </VStack>
        <Box className="empty-stack"></Box>
      </HStack>
    </div>
  );
}
