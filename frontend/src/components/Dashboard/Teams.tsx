import React, { useState } from "react";
import { Flex } from "@chakra-ui/react";
import JoinedTeams from "../Teams/JoinedTeams";
import CreateJoin from "../Teams/CreateJoin";
// import CreateJoin from "../Teams/CreateJoin";
// import JoinedTeams from "../Teams/JoinedTeams";

const Teams = () => {
  return (
    <Flex direction="column" height="100vh" p={8}>
      <>
        <CreateJoin />
        <JoinedTeams />
      </>
    </Flex>
  );
};

export default Teams;
