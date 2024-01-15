import { Flex } from "@chakra-ui/react";
import CreateJoin from "../components/Teams/CreateJoin";
import JoinedTeams from "../components/Teams/JoinedTeams";

const Teams = () => {
  return (
    <Flex direction="column" height="100vh" p={8}>
      <CreateJoin />
      <JoinedTeams />
    </Flex>
  );
};

export default Teams;
