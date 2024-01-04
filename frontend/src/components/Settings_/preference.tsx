import { Switch, Divider, Flex, Heading, VStack, Text } from "@chakra-ui/react";
import { useState } from "react";

const Preference = () => {

  const [isLight, setIsLight] = useState(false);
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
              onChange={() => setIsLight(!isLight)}
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
