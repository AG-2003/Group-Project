import { Flex, Box, Text, SimpleGrid, Badge, Stack, Avatar, Button } from '@chakra-ui/react';

// const DashboardSection = ({ title, items }) => {
//   return (
//     <Box mt={10}>
//       <Text fontSize="2xl" fontWeight="bold" mb={4}>{title}</Text>
//       <SimpleGrid columns={4} spacing={5}>
//         {items.map((item, index) => (
//           <Box
//             key={index}
//             p={5}
//             shadow="md"
//             borderWidth="1px"
//             borderRadius="md"
//             textAlign="center"
//             bg="purple.100"
//           >
//             <Avatar size="xl" name={item.name} mb={4} />
//             <Text fontWeight="bold">{item.name}</Text>
//             <Text fontSize="sm">{item.members} Members</Text>
//             <Text mt={2} fontSize="sm">{item.description}</Text>
//           </Box>
//         ))}
//       </SimpleGrid>
//     </Box>
//   );
// };

const Profile = () => {
  const teams = [
    { name: 'Group Name', members: 3, description: 'Description' },
    { name: 'Group Name', members: 4, description: 'Description' },
    // ... more teams
  ];

  const communities = [
    { name: 'Group Name', members: 3, description: 'Description' },
    { name: 'Group Name', members: 4, description: 'Description' },
    // ... more communities
  ];

  return (
    <div>
      <Flex justifyContent="space-between" alignItems="center" p={5} bg="#e1ecf7" rounded={15}>
        <Flex align="center" p={3}>
          <Avatar ml={3} />
          <Text
            fontSize="25" // Adjust font size as needed
            // fontFamily={"pacifico"}
            // fontWeight="bold"
            ml={8} // Margin-left to separate text from avatar
          >
            Your Name
          </Text>
        </Flex>

        <Stack direction="row" spacing={4}>
          <Badge fontSize="1em" p={2} bg="#8587bf" color="white" borderRadius="md">7 Projects</Badge>
          <Badge fontSize="1em" p={2} bg="#8587bf" color="white" borderRadius="md">11 Communities</Badge>
          <Badge fontSize="1em" p={2} bg="#8587bf" color="white" borderRadius="md">4 Awards</Badge>
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
