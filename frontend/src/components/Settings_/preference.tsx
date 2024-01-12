import { Switch, Divider, Flex, Heading, VStack, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { auth, db } from "../../firebase-config";
import { doc, updateDoc, getDoc } from "firebase/firestore";

const Preference = () => {

  const [isLight, setIsLight] = useState(true);


  useEffect(() => {
    // Fetch the theme preference when the component mounts
    const fetchThemePreference = async () => {
      if (auth.currentUser) {
        const userRef = doc(db, "users", auth.currentUser.email as string);
        try {
          const docSnap = await getDoc(userRef);
          if (docSnap.exists()) {
            const userData = docSnap.data();
            // Set the switch based on whether the userTheme is 'light'
            setIsLight(userData.userTheme === 'dark');
          } else {
            console.log("Document does not exist.");
          }
        } catch (error) {
          console.error("Error fetching user theme preference:", error);
        }
      }
    };

    fetchThemePreference();
  }, []);



  const handleUserThemePreference = async () => {
    const newTheme = isLight ? 'light' : 'dark';
    if (auth.currentUser) {
      try {
        const userRef = doc(db, "users", auth.currentUser.email as string);
        await updateDoc(userRef, {
          userTheme: newTheme
        });
        setIsLight(!isLight); // Toggle the local state to reflect the new theme preference
        console.log(`updated preference to ${newTheme}`)
      } catch (error) {
        console.log(error);
      }
    }
  }
  return (
    <>
      <div className="head">
        <Heading>Preference</Heading>
      </div>
      <Divider borderColor="lightgrey" borderWidth="1px" />
      <div className="body">
        <VStack spacing={4} align="start" my={4}>
          <Heading size="sm">Theme</Heading>
          <Flex align="center">
            <Text>Light</Text>
            <Switch
              id="theme-switch"
              colorScheme="purple"
              size="md"
              mx={2}
              isChecked={isLight}
              onChange={handleUserThemePreference} // Call handleThemeChange when the switch is toggled
            />
            <Text>Dark</Text>
          </Flex>
        </VStack>
        <Divider borderColor="lightgrey" borderWidth="1px" />

        {/* Add a toggle for notifications */}
      </div>
    </>
  );
};

export default Preference;
