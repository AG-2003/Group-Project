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
import { doc, getDoc, updateDoc } from "firebase/firestore";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import EditableTextField from "../../Settings_/sub-components/EditableTextField";
import { useParams } from "react-router-dom";
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

          if (communityData) {
            setCommunityData(communityData);
            setAvatarUrl(communityData.image || "");
            setCommunityName(communityData.name);
          }

          if (communityData) {
            if (
              communityData.creator === userUid ||
              communityData.admins.includes(userUid)
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
        </div>
        {/* <Divider borderColor="lightgrey" borderWidth="1px" maxW="" /> */}
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
        </div>
      </>
    );
  };

  return <>{isAdmin ? adminInterface() : nonAdminInterface()}</>;
};

export default Account;
