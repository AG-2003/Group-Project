import "./settings.css";
import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Input,
  Progress,
  Select,
  Skeleton,
  SkeletonCircle,
  Spinner,
  VStack,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { auth, db } from "../../../firebase-config";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import EditableTextField from "../../Settings_/sub-components/EditableTextField";
import { useNavigate, useParams } from "react-router-dom";
import { UseToastNotification } from "../../../utils/UseToastNotification";

interface TeamData {
  id: string;
  name: string;
  description: string;
  role: string;
  members: string[];
  image: string | null; // Store image URL instead of File
  chatId: string;
  creator: string;
  admins: string[];
}

interface UserData {
  id: string;
  displayName: string;
  email: string;
  photoURL: string;
  teams: string[];
}

const Account = () => {
  const showToast = UseToastNotification();
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [teamDescription, setTeamDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [teamData, setTeamData] = useState<TeamData | null>(null);
  const [teamMembers, setTeamMembers] = useState<UserData[]>([]);
  const navigate = useNavigate();

  let { team_id } = useParams();

  // Fetch team data and check admin status
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (auth.currentUser) {
        const userUid = auth.currentUser.uid;
        if (userUid) {
          const teamRef = doc(db, "teams", team_id || "");
          const docSnap = await getDoc(teamRef);
          const teamData = docSnap.data() as TeamData | undefined;

          if (teamData) {
            setTeamData(teamData);
            setAvatarUrl(teamData.image || "");
            setTeamName(teamData.name);

            const fetchMemberData = async () => {
              const memberData = await Promise.all(
                teamData.members.map(async (memberId) => {
                  const userRef = doc(db, "users", memberId);
                  const userSnap = await getDoc(userRef);
                  const userData = userSnap.data() as UserData | undefined;
                  return userData;
                })
              );
              setTeamMembers(memberData.filter(Boolean) as UserData[]);
            };

            fetchMemberData();
          }

          if (teamData) {
            if (
              teamData.creator === auth.currentUser.email ||
              teamData.admins.includes(auth.currentUser.email || "")
            ) {
              setIsAdmin(true);
            }
          }
        }
      }
      setLoading(false);
    };

    checkAdminStatus();
  }, [team_id]);

  // Function to handle image selection and upload
  const handleImageSelection = async (event: any) => {
    const file = event.target.files[0];
    if (file) {
      const storage = getStorage();
      const storagePath = `teamImages/${teamData?.id}/${file.name}`;
      const imageRef = storageRef(storage, storagePath);

      try {
        const snapshot = await uploadBytes(imageRef, file);
        const imageUrl = await getDownloadURL(snapshot.ref);

        const teamRef = doc(db, "teams", team_id || "");
        await updateDoc(teamRef, {
          image: imageUrl,
        });

        // Update avatarUrl to the new picture
        setAvatarUrl(imageUrl);

        showToast("success", "Team image updated successfully");
      } catch (err) {
        console.error("Error updating team image:", err);
        showToast("error", "Error updating comteammunity image");
      }
    }
  };

  // Function to handle saving team name
  const handleTeamNameSave = async (newTeamName: string) => {
    if (isAdmin) {
      try {
        const teamRef = doc(db, "teams", team_id || ""); // Replace "communityId" with actual team ID
        await updateDoc(teamRef, {
          name: newTeamName,
        });

        showToast("success", `team name updated to ${newTeamName}`);
      } catch (err) {
        console.error("Error updating team name:", err);
        showToast("error", "Error updating team name");
      }
    } else {
      showToast("error", "Only admins can update the team name");
    }
  };

  // State variable and effect for loading team description
  const [loadingDescription, setLoadingDescription] = useState<boolean>(true);

  useEffect(() => {
    const fetchteamDescription = async () => {
      const teamRef = doc(db, "teams", team_id || "");
      try {
        const docSnap = await getDoc(teamRef);
        if (docSnap.exists()) {
          const teamData = docSnap.data();
          if (teamData && teamData.description) {
            setTeamDescription(teamData.description);
          } else {
            setTeamDescription("Team description not available.");
          }
        } else {
          setTeamDescription("Team description not available.");
        }
      } catch (error) {
        console.error("Error fetching team data:", error);
      } finally {
        setLoadingDescription(false);
      }
    };

    fetchteamDescription();
  }, []);

  // Function to handle saving team description
  const handleDescriptionSave = async (newTeamDescription: string) => {
    if (isAdmin) {
      try {
        const teamsRef = doc(db, "teams", team_id || "");
        await updateDoc(teamsRef, {
          description: newTeamDescription,
        });

        showToast("success", "Team description updated successfully");
      } catch (err) {
        console.error("Error updating Team description:", err);
        showToast("error", "Error updating Team description");
      }
    } else {
      showToast("error", "Only admins can update the team description");
    }
  };

  // State variables and effect for loading user type
  const [role, setRole] = useState("");
  const [loadingUserType, setLoadingUserType] = useState<boolean>(true);

  // Function to handle role change and save
  const handleRoleSave = async () => {
    if (isAdmin) {
      try {
        const teamsRef = doc(db, "teams", team_id || "");
        await updateDoc(teamsRef, {
          role: role,
        });

        showToast("success", `Team status updated to ${role}`);
      } catch (err) {
        console.error("Error updating team status:", err);
        showToast("error", "Error updating team status");
      }
    } else {
      showToast("error", "Only admins can update the team status");
    }
  };

  // Function to handle role change and save
  const handleRoleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setRole(event.target.value);
  };

  const handleKickMember = async (memberId: string) => {
    if (auth.currentUser) {
      if (isAdmin) {
        if (memberId === auth.currentUser.email) {
          showToast("error", "You cannot kick yourself from the team.");
          return;
        }

        try {
          const teamsRef = doc(db, "teams", team_id || "");
          const docSnap = await getDoc(teamsRef);
          if (docSnap.exists()) {
            const communityData = docSnap.data() as TeamData;
            const updatedMembers = communityData.members.filter(
              (member) => member !== memberId
            );

            await updateDoc(teamsRef, { members: updatedMembers });

            showToast("success", `${memberId} has been kicked from the team.`);

            // Fetch updated team members list after kicking
            const memberDisplayNames = await Promise.all(
              updatedMembers.map(async (memberId) => {
                const userRef = doc(db, "users", memberId);
                const userSnap = await getDoc(userRef);
                const userData = userSnap.data() as UserData | undefined;
                return userData;
              })
            );
            setTeamMembers(memberDisplayNames.filter(Boolean) as UserData[]);

            // Remove the team from the user's teams array
            const userRef = doc(db, "users", memberId);
            const userDoc = await getDoc(userRef);
            if (userDoc.exists()) {
              const userData = userDoc.data() as UserData;
              const updatedteams = userData.teams.filter(
                (team) => team !== team_id
              );
              await updateDoc(userRef, { teams: updatedteams });
            } else {
              showToast("error", "User not found.");
            }
          } else {
            showToast("error", "Team not found.");
          }
        } catch (error) {
          console.error("Error kicking member:", error);
          showToast("error", "Error kicking member.");
        }
      } else {
        showToast("error", "Only admins can kick members from the team.");
      }
    }
  };

  const handleDeleteCommunity = async () => {
    try {
      const teamsRef = doc(db, "teams", team_id || "");
      const docSnap = await getDoc(teamsRef);
      if (docSnap.exists()) {
        const teamsData = docSnap.data() as TeamData;

        // Delete the team document
        await deleteDoc(teamsRef);

        // Remove the team from all members' teams arrays
        const membersPromises = teamsData.members.map(async (memberId) => {
          const userRef = doc(db, "users", memberId);
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            const userData = userDoc.data() as UserData;
            const updatedTeams = userData.teams.filter(
              (team) => team !== team_id
            );
            await updateDoc(userRef, { teams: updatedTeams });
          } else {
            console.error("User document not found for member:", memberId);
          }
        });

        // const postsRef = collection(db, "communityPosts");
        // const postsQuery = query(postsRef, where("Cid", "==", team_id));
        // const postsSnapshot = await getDocs(postsQuery);
        // const deletePostsPromises = postsSnapshot.docs.map(async (doc) => {
        //   await deleteDoc(doc.ref);
        // });

        await Promise.all([...membersPromises]);

        showToast("success", "Team deleted successfully");

        navigate("/Teams");
      } else {
        showToast("error", "Team not found.");
      }
    } catch (error) {
      console.error("Error deleting team:", error);
      showToast("error", "Error deleting team.");
    }
  };

  const handleLeaveCommunity = async () => {
    try {
      const teamRef = doc(db, "teams", team_id || "");
      const docSnap = await getDoc(teamRef);
      if (docSnap.exists()) {
        const teamData = docSnap.data() as TeamData;

        // Remove current user from members list
        const updatedMembers = teamData.members.filter(
          (member) => member !== auth.currentUser?.email
        );

        // Update the team members list
        await updateDoc(teamRef, { members: updatedMembers });

        // Update user document to remove the team from user's teams array
        const userRef = doc(db, "users", auth.currentUser?.email || "3142");
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const userData = userDoc.data() as UserData;
          const updatedTeams = userData.teams.filter(
            (team) => team !== team_id
          );
          await updateDoc(userRef, { teams: updatedTeams });

          showToast("success", "You left the team successfully");

          navigate("/Teams");
        } else {
          showToast("error", "User not found.");
        }
      } else {
        showToast("error", "Team not found.");
      }
    } catch (error) {
      console.error("Error leaving team:", error);
      showToast("error", "Error leaving team.");
    }
  };

  const adminInterface = () => {
    return (
      <>
        {/* Header */}
        <div className="head">
          <Heading>Team Settings</Heading>
        </div>
        <Divider borderColor="lightgrey" borderWidth="1px" maxW="" />

        {/* Body */}
        <div className="body">
          {/* Profile Picture */}
          <Flex>
            <Avatar
              src={avatarUrl}
              referrerPolicy="no-referrer"
              className="avatar"
            />
            <Box className="upload-section">
              <Box className="text">Update your team photo</Box>
              <Input
                type="file"
                accept="image/*"
                hidden
                id="file-upload"
                onChange={handleImageSelection}
              />
              <Button
                className="button button-upload"
                colorScheme="purple"
                size="sm"
                onClick={() => document.getElementById("file-upload")?.click()}
              >
                Upload
              </Button>
            </Box>
          </Flex>
          <Divider borderColor="lightgrey" borderWidth="1px" maxW="" />

          {/* Display Name */}
          <Box my={4}>
            <Heading size="sm" mb={3}>
              Team Name
            </Heading>
            <EditableTextField
              b1="Edit"
              initialValue={teamName || "Team Name"}
              onSave={handleTeamNameSave}
            />
          </Box>

          <Divider borderColor="lightgrey" borderWidth="1px" />

          {/* Description */}
          <Box my={4}>
            <Heading size="sm" mb={3}>
              Description
            </Heading>
            {loadingDescription ? (
              <Spinner />
            ) : (
              <EditableTextField
                b1="Edit"
                initialValue={teamDescription}
                onSave={handleDescriptionSave}
              />
            )}
          </Box>

          <Divider borderColor="lightgrey" borderWidth="1px" />

          {/* Role */}
          {/* <VStack spacing={4} align="stretch" my={4}>
            <Heading size="sm">Team Role</Heading>
            <Flex>
              <Select
                placeholder="Select option"
                maxW="435px"
                value={role || teamData?.role}
                onChange={handleRoleChange}
              >
                <option value="Teacher">Teacher</option>
                <option value="Student">Student</option>
              </Select>

              <Button
                size="sm"
                fontWeight="500"
                onClick={handleRoleSave}
                ml="2rem"
              >
                Save
              </Button>
            </Flex>
          </VStack> */}

          <Divider borderColor="lightgrey" borderWidth="1px" />
          <Box mt={4} mb={4}>
            <Heading size="sm" mb={4}>
              Leave Team?
            </Heading>
            <Button colorScheme="red" onClick={handleLeaveCommunity}>
              Leave Team
            </Button>
            {teamData?.creator === auth.currentUser?.email && (
              <Button
                colorScheme="orange"
                onClick={handleDeleteCommunity}
                ml={4}
              >
                Delete Team
              </Button>
            )}
          </Box>

          <Divider borderColor="lightgrey" borderWidth="1px" />

          <Box mt={4}>
            <Heading size="sm">Team Members</Heading>
            <VStack align="start" mt={2}>
              {teamMembers.map((memberId, index) => (
                <Flex key={index} alignItems="center">
                  <Avatar size="sm" name={memberId.photoURL} />
                  <Text ml={2}>{memberId.displayName}</Text>
                  <Button
                    size="sm"
                    colorScheme="red"
                    ml={2}
                    onClick={() => handleKickMember(memberId.email)}
                  >
                    Kick
                  </Button>
                </Flex>
              ))}
            </VStack>
          </Box>
        </div>
        <Divider borderColor="lightgrey" borderWidth="1px" />
      </>
    );
  };

  const nonAdminInterface = () => {
    return (
      <>
        {/* Header */}
        <div className="head">
          <Heading>Team Settings</Heading>
        </div>
        <Divider borderColor="lightgrey" borderWidth="1px" maxW="" />

        {/* Body */}
        <div className="body">
          {/* Profile Picture */}
          <Flex>
            <Avatar
              src={avatarUrl}
              referrerPolicy="no-referrer"
              className="avatar"
            />
            <Heading size="md" mb={3} mt={6}>
              {teamName}
            </Heading>
          </Flex>

          <Divider borderColor="lightgrey" borderWidth="1px" />

          {/* Description */}
          <Box my={4}>
            <Heading size="sm" mb={3}>
              Description
            </Heading>
            {loadingDescription ? (
              <Spinner />
            ) : (
              <Text size="sm" mb={3}>
                {teamDescription}
              </Text>
            )}
          </Box>
          <Divider borderColor="lightgrey" borderWidth="1px" />

          {/* Role */}
          {/* <VStack spacing={4} align="stretch" my={4}>
            <Heading size="sm">Team Role</Heading>
            <Flex>
              <Text size="sm" mb={3}>
                {teamData?.role}
              </Text>
            </Flex>
          </VStack> */}

          <Divider borderColor="lightgrey" borderWidth="1px" />
          <Box mt={4} mb={4}>
            <Heading size="sm" mb={4}>
              Leave Team?
            </Heading>
            <Button colorScheme="red" onClick={handleLeaveCommunity}>
              Leave Team
            </Button>
          </Box>

          <Divider borderColor="lightgrey" borderWidth="1px" />

          <Box mt={4}>
            <Heading size="sm">Team Members</Heading>
            <VStack align="start" mt={2}>
              {teamMembers.map((memberId, index) => (
                <Flex key={index} alignItems="center">
                  <Avatar size="sm" name={memberId.photoURL} />
                  <Text ml={2}>{memberId.displayName}</Text>
                </Flex>
              ))}
            </VStack>
          </Box>
        </div>
      </>
    );
  };

  return <>{isAdmin ? adminInterface() : nonAdminInterface()}</>;
};

export default Account;
