import { Flex, Text, Badge, Stack, Avatar, Button } from "@chakra-ui/react";

const Profile = () => {
  const teams = [
    { name: "Group Name", members: 3, description: "Description" },
    { name: "Group Name", members: 4, description: "Description" },
    // ... more teams
  ];

  const communities = [
    { name: "Group Name", members: 3, description: "Description" },
    { name: "Group Name", members: 4, description: "Description" },
    // ... more communities
  ];

  return (
    <div>
      <Flex
        justifyContent="space-between"
        alignItems="center"
        p={5}
        bg="#e1ecf7"
        rounded={15}
      >
        <Flex align="center" p={3}>
          <Avatar ml={3} />
          <Text fontSize="25" ml={8}>
            Your Name
          </Text>
        </Flex>

        <Stack direction="row" spacing={4}>
          <Badge
            fontSize="1em"
            p={2}
            bg="#8587bf"
            color="white"
            borderRadius="md"
          >
            7 Projects
          </Badge>
          <Badge
            fontSize="1em"
            p={2}
            bg="#8587bf"
            color="white"
            borderRadius="md"
          >
            11 Communities
          </Badge>
          <Badge
            fontSize="1em"
            p={2}
            bg="#8587bf"
            color="white"
            borderRadius="md"
          >
            4 Awards
          </Badge>
        </Stack>

        <Button colorScheme="purple">Leaderboard</Button>
      </Flex>
      <Flex direction="column" p={5}>
        {/* <DashboardSection title="Your Teams" items={teams} />
        <DashboardSection title="Your Communities" items={communities} /> */}
      </Flex>
    </div>
  );
};

export default Profile;
