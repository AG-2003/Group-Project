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

interface CommunityData {
  id: string;
  name: string;
  description: string;
  status: string;
  members: string[];
  image: string | null;
  admins: string[];
  creator: string;
  requests: string[];
}

interface UserData {
  id: string;
  displayName: string;
  email: string;
  photoURL: string;
  communities: string[];
}

const Account = () => {
  // Hook to show toast notifications
  const showToast = UseToastNotification();

  // State variables
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isAdmin, setIsAdmin] = useState(false); // Track if the current user is an admin
  const [communityName, setCommunityName] = useState("");
  const [communityDescription, setCommunityDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [communityData, setCommunityData] = useState<CommunityData | null>(
    null
  );
  const [communityMembers, setCommunityMembers] = useState<UserData[]>([]);
  const navigate = useNavigate(); // Hook for navigation

  // Get community ID from URL params
  let { community_id } = useParams();

  // Fetch community data and check admin status
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (auth.currentUser) {
        const userUid = auth.currentUser.uid;
        if (userUid) {
          const communityRef = doc(db, "communities", community_id || "");
          const docSnap = await getDoc(communityRef);
          const communityData = docSnap.data() as CommunityData | undefined;

          // Inside the useEffect hook where you fetch community data and check admin status
          if (communityData) {
            setCommunityData(communityData);
            setAvatarUrl(communityData.image || "");
            setCommunityName(communityData.name);

            // Fetch display names of community members
            const fetchMemberDisplayNames = async () => {
              const memberDisplayNames = await Promise.all(
                communityData.members.map(async (memberId) => {
                  const userRef = doc(db, "users", memberId);
                  const userSnap = await getDoc(userRef);
                  const userData = userSnap.data() as UserData | undefined;
                  return userData;
                })
              );
              setCommunityMembers(
                memberDisplayNames.filter(Boolean) as UserData[]
              );
            };

            fetchMemberDisplayNames();
          }

          if (communityData) {
            if (
              communityData.creator === auth.currentUser.email ||
              communityData.admins.includes(auth.currentUser.email || "241")
            ) {
              setIsAdmin(true);
            }
          }
        }
      }
      setLoading(false);
    };

    checkAdminStatus();
  }, [community_id]);

  // Function to handle image selection and upload
  const handleImageSelection = async (event: any) => {
    const file = event.target.files[0];
    if (file) {
      const storage = getStorage();
      const storagePath = `communityImages/${communityData?.id}/${file.name}`;
      const imageRef = storageRef(storage, storagePath);

      try {
        const snapshot = await uploadBytes(imageRef, file);
        const imageUrl = await getDownloadURL(snapshot.ref);

        const communityRef = doc(db, "communities", community_id || "");
        await updateDoc(communityRef, {
          image: imageUrl,
        });

        // Update avatarUrl to the new picture
        setAvatarUrl(imageUrl);

        showToast("success", "Community image updated successfully");
      } catch (err) {
        console.error("Error updating community image:", err);
        showToast("error", "Error updating community image");
      }
    }
  };

  // Function to handle saving community name
  const handleCommunityNameSave = async (newCommunityName: string) => {
    if (isAdmin) {
      try {
        const communityRef = doc(db, "communities", community_id || ""); // Replace "communityId" with actual community ID
        await updateDoc(communityRef, {
          name: newCommunityName,
        });

        showToast("success", `Community name updated to ${newCommunityName}`);
      } catch (err) {
        console.error("Error updating community name:", err);
        showToast("error", "Error updating community name");
      }
    } else {
      showToast("error", "Only admins can update the community name");
    }
  };

  // State variable and effect for loading community description
  const [loadingDescription, setLoadingDescription] = useState<boolean>(true);

  useEffect(() => {
    const fetchCommunityDescription = async () => {
      const communityRef = doc(db, "communities", community_id || "");
      try {
        const docSnap = await getDoc(communityRef);
        if (docSnap.exists()) {
          const communityData = docSnap.data();
          if (communityData && communityData.description) {
            setCommunityDescription(communityData.description);
          } else {
            setCommunityDescription("Community description not available.");
          }
        } else {
          setCommunityDescription("Community description not available.");
        }
      } catch (error) {
        console.error("Error fetching community data:", error);
      } finally {
        setLoadingDescription(false);
      }
    };

    fetchCommunityDescription();
  }, []);

  // Function to handle saving community description
  const handleDescriptionSave = async (newCommunityDescription: string) => {
    if (isAdmin) {
      try {
        const communityRef = doc(db, "communities", community_id || ""); // Replace "communityId" with actual community ID
        await updateDoc(communityRef, {
          description: newCommunityDescription,
        });

        showToast("success", "Community description updated successfully");
      } catch (err) {
        console.error("Error updating community description:", err);
        showToast("error", "Error updating community description");
      }
    } else {
      showToast("error", "Only admins can update the community description");
    }
  };

  // State variables and effect for loading user type
  const [status, setStatus] = useState("");
  const [loadingUserType, setLoadingUserType] = useState<boolean>(true);

  // Function to handle role change and save
  const handleStatusSave = async () => {
    if (isAdmin) {
      try {
        const communityRef = doc(db, "communities", community_id || "");
        await updateDoc(communityRef, {
          status: status,
        });

        showToast("success", `Community status updated to ${status}`);
      } catch (err) {
        console.error("Error updating community status:", err);
        showToast("error", "Error updating community status");
      }
    } else {
      showToast("error", "Only admins can update the community status");
    }
  };

  // Function to handle role change and save
  const handleRoleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(event.target.value);
  };

  const handleKickMember = async (memberId: string) => {
    if (auth.currentUser) {
      if (isAdmin) {
        if (memberId === auth.currentUser.email) {
          showToast("error", "You cannot kick yourself from the community.");
          return;
        }

        try {
          const communityRef = doc(db, "communities", community_id || "");
          const docSnap = await getDoc(communityRef);
          if (docSnap.exists()) {
            const communityData = docSnap.data() as CommunityData;
            const updatedMembers = communityData.members.filter(
              (member) => member !== memberId
            );

            await updateDoc(communityRef, { members: updatedMembers });

            showToast(
              "success",
              `${memberId} has been kicked from the community.`
            );

            // Fetch updated community members list after kicking
            const memberDisplayNames = await Promise.all(
              updatedMembers.map(async (memberId) => {
                const userRef = doc(db, "users", memberId);
                const userSnap = await getDoc(userRef);
                const userData = userSnap.data() as UserData | undefined;
                return userData;
              })
            );
            setCommunityMembers(
              memberDisplayNames.filter(Boolean) as UserData[]
            );

            // Remove the community from the user's communities array
            const userRef = doc(db, "users", memberId);
            const userDoc = await getDoc(userRef);
            if (userDoc.exists()) {
              const userData = userDoc.data() as UserData;
              const updatedCommunities = userData.communities.filter(
                (community) => community !== community_id
              );
              await updateDoc(userRef, { communities: updatedCommunities });
            } else {
              showToast("error", "User not found.");
            }
          } else {
            showToast("error", "Community not found.");
          }
        } catch (error) {
          console.error("Error kicking member:", error);
          showToast("error", "Error kicking member.");
        }
      } else {
        showToast("error", "Only admins can kick members from the community.");
      }
    }
  };

  const [requests, setRequests] = useState<UserData[]>([]);

  // Function to fetch requests
  const fetchRequests = async () => {
    try {
      const communityRef = doc(db, "communities", community_id || "");
      const docSnap = await getDoc(communityRef);

      if (docSnap.exists()) {
        const communityData = docSnap.data() as CommunityData;

        // Check if the community is private before fetching requests
        if (communityData.status === "Private") {
          const requestsData = await Promise.all(
            communityData.requests.map(async (requestId) => {
              const userRef = doc(db, "users", requestId);
              const userSnap = await getDoc(userRef);
              const userData = userSnap.data() as UserData | undefined;
              return userData;
            })
          );

          setRequests(requestsData.filter(Boolean) as UserData[]);
        } else {
          console.log("Cannot fetch requests. Community is not private.");
        }
      } else {
        showToast("error", "Community not found.");
      }
    } catch (error) {
      console.error("Error fetching requests:", error);
      showToast("error", "Error fetching requests.");
    }
  };

  // useEffect to fetch requests on component mount
  useEffect(() => {
    fetchRequests();
  }, []);
  // Function to handle accepting a request
  const handleAcceptRequest = async (userId: string) => {
    try {
      const communityRef = doc(db, "communities", community_id || "");
      const userRef = doc(db, "users", userId);

      const [communityDoc, userDoc] = await Promise.all([
        getDoc(communityRef),
        getDoc(userRef),
      ]);

      if (communityDoc.exists() && userDoc.exists()) {
        const communityData = communityDoc.data() as CommunityData;
        const userData = userDoc.data() as UserData;

        const updatedMembers = [...communityData.members, userId];
        const updatedRequests = communityData.requests.filter(
          (requestId) => requestId !== userId
        );

        // Update community members
        await updateDoc(communityRef, { members: updatedMembers });
        // Update user communities
        await updateDoc(userRef, {
          communities: [...userData.communities, community_id],
        });
        // Remove the user from the requests list
        await updateDoc(communityRef, { requests: updatedRequests });

        showToast("success", `${userId}'s request has been accepted.`);

        // Update the state with the updated requests
        fetchRequests();
      } else {
        showToast("error", "Community or user not found.");
      }
    } catch (error) {
      console.error("Error accepting request:", error);
      showToast("error", "Error accepting request.");
    }
  };

  // Function to handle rejecting a request
  const handleRejectRequest = async (userId: string) => {
    try {
      const communityRef = doc(db, "communities", community_id || "");
      const docSnap = await getDoc(communityRef);
      if (docSnap.exists()) {
        const communityData = docSnap.data() as CommunityData;
        const updatedRequests = communityData.requests.filter(
          (requestId) => requestId !== userId
        );

        await updateDoc(communityRef, { requests: updatedRequests });

        showToast("success", `${userId}'s request has been rejected.`);

        // Update the state with the updated requests
        fetchRequests();
      } else {
        showToast("error", "Community not found.");
      }
    } catch (error) {
      console.error("Error rejecting request:", error);
      showToast("error", "Error rejecting request.");
    }
  };

  const handleDeleteCommunity = async () => {
    try {
      const communityRef = doc(db, "communities", community_id || "");
      const docSnap = await getDoc(communityRef);
      if (docSnap.exists()) {
        const communityData = docSnap.data() as CommunityData;

        // Delete the community document
        await deleteDoc(communityRef);

        // Remove the community from all members' communities arrays
        const membersPromises = communityData.members.map(async (memberId) => {
          const userRef = doc(db, "users", memberId);
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            const userData = userDoc.data() as UserData;
            const updatedCommunities = userData.communities.filter(
              (community) => community !== community_id
            );
            await updateDoc(userRef, { communities: updatedCommunities });
          } else {
            console.error("User document not found for member:", memberId);
          }
        });

        const postsRef = collection(db, "communityPosts");
        const postsQuery = query(postsRef, where("Cid", "==", community_id));
        const postsSnapshot = await getDocs(postsQuery);
        const deletePostsPromises = postsSnapshot.docs.map(async (doc) => {
          await deleteDoc(doc.ref);
        });

        await Promise.all([...membersPromises, ...deletePostsPromises]);

        showToast("success", "Community deleted successfully");

        navigate("/communities");
      } else {
        showToast("error", "Community not found.");
      }
    } catch (error) {
      console.error("Error deleting community:", error);
      showToast("error", "Error deleting community.");
    }
  };

  const handleLeaveCommunity = async () => {
    try {
      const communityRef = doc(db, "communities", community_id || "");
      const docSnap = await getDoc(communityRef);
      if (docSnap.exists()) {
        const communityData = docSnap.data() as CommunityData;

        // Remove current user from members list
        const updatedMembers = communityData.members.filter(
          (member) => member !== auth.currentUser?.email
        );

        // Update the community members list
        await updateDoc(communityRef, { members: updatedMembers });

        // Update user document to remove the community from user's communities array
        const userRef = doc(db, "users", auth.currentUser?.email || "3142");
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const userData = userDoc.data() as UserData;
          const updatedCommunities = userData.communities.filter(
            (community) => community !== community_id
          );
          await updateDoc(userRef, { communities: updatedCommunities });

          showToast("success", "You left the community successfully");

          navigate("/communities");
        } else {
          showToast("error", "User not found.");
        }
      } else {
        showToast("error", "Community not found.");
      }
    } catch (error) {
      console.error("Error leaving community:", error);
      showToast("error", "Error leaving community.");
    }
  };

  const adminInterface = () => {
    return (
      <>
        {/* Header */}
        <div className="head">
          <Heading>Community Settings</Heading>
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
              <Box className="text">Update your community photo</Box>
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
              Community Name
            </Heading>
            <EditableTextField
              b1="Edit"
              initialValue={communityName || "Community Name"}
              onSave={handleCommunityNameSave}
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
                initialValue={communityDescription}
                onSave={handleDescriptionSave}
              />
            )}
          </Box>

          <Divider borderColor="lightgrey" borderWidth="1px" />

          {/* Role */}
          <VStack spacing={4} align="stretch" my={4}>
            <Heading size="sm">Community Status</Heading>
            <Flex>
              <Select
                placeholder="Select option"
                maxW="435px"
                value={status || communityData?.status}
                onChange={handleRoleChange}
              >
                <option value="Private">Private</option>
                <option value="Public">Public</option>
              </Select>

              <Button
                size="sm"
                fontWeight="500"
                onClick={handleStatusSave}
                ml="2rem"
              >
                Save
              </Button>
            </Flex>
          </VStack>

          <Divider borderColor="lightgrey" borderWidth="1px" />
          <Box mt={4} mb={4}>
            <Heading size="sm" mb={4}>
              Leave Communtiy?
            </Heading>
            <Button colorScheme="red" onClick={handleLeaveCommunity}>
              Leave Community
            </Button>
            {communityData?.creator === auth.currentUser?.email && (
              <Button
                colorScheme="orange"
                onClick={handleDeleteCommunity}
                ml={4}
              >
                Delete Community
              </Button>
            )}
          </Box>

          {communityData?.status === "Private" && (
            <>
              <Divider borderColor="lightgrey" borderWidth="1px" />

              <Box mt={4} mb={4}>
                <Heading size="sm">Requests</Heading>
                <VStack align="start" mt={2}>
                  {requests.length === 0 ? (
                    <Text>There are no requests.</Text>
                  ) : (
                    <VStack align="start" mt={2}>
                      {requests.map((request, index) => (
                        <Flex key={index} alignItems="center">
                          <Avatar size="sm" src={request.photoURL} />
                          <Text ml={2}>{request.displayName}</Text>
                          <Button
                            size="sm"
                            colorScheme="green"
                            ml={2}
                            onClick={() => handleAcceptRequest(request.email)}
                          >
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            colorScheme="red"
                            ml={2}
                            onClick={() => handleRejectRequest(request.email)}
                          >
                            Reject
                          </Button>
                        </Flex>
                      ))}
                    </VStack>
                  )}
                </VStack>
              </Box>
            </>
          )}

          <Divider borderColor="lightgrey" borderWidth="1px" />

          <Box mt={4}>
            <Heading size="sm">Community Members</Heading>
            <VStack align="start" mt={2}>
              {communityMembers.map((memberId, index) => (
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
          <Heading>Community Settings</Heading>
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
              {communityName}
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
                {communityDescription}
              </Text>
            )}
          </Box>
          <Divider borderColor="lightgrey" borderWidth="1px" />

          {/* Role */}
          <VStack spacing={4} align="stretch" my={4}>
            <Heading size="sm">Community Status</Heading>
            <Flex>
              <Text size="sm" mb={3}>
                {communityData?.status}
              </Text>
            </Flex>
          </VStack>

          <Divider borderColor="lightgrey" borderWidth="1px" />
          <Box mt={4} mb={4}>
            <Heading size="sm" mb={4}>
              Leave Communtiy?
            </Heading>
            <Button colorScheme="red" onClick={handleLeaveCommunity}>
              Leave Community
            </Button>
          </Box>

          <Divider borderColor="lightgrey" borderWidth="1px" />

          <Box mt={4}>
            <Heading size="sm">Community Members</Heading>
            <VStack align="start" mt={2}>
              {communityMembers.map((memberId, index) => (
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
