import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../firebase-config";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  getDocs,
  collection,
  where,
  query,
  DocumentData,
  arrayRemove,
  deleteDoc,
} from "firebase/firestore";
import {
  Flex,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalFooter,
  Text,
  Textarea,
} from "@chakra-ui/react";

import { BiMessageSquareAdd } from "react-icons/bi";
import Comment from "./Comment";

interface CommentData {
  id: string;
  Uid: string;
  Uname: string;
  Upic: string;
  description: string;
  Pid: string;
  date: string;
  likedBy: [];
  dislikedBy: [];
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  Pid: string;
  commentsEnabled: boolean;
}

const CommentModal: React.FC<Props> = ({
  Pid,
  isOpen,
  onClose,
  commentsEnabled,
}: Props) => {
  const [commentDescription, setCommentDescription] = useState("");
  const [comments, setComments] = useState<CommentData[]>([]);
  const [user] = useAuthState(auth);

  const handleCommentDescriptionChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setCommentDescription(event.target.value);
  };

  const SaveNClose = () => {
    saveCommentToFirestore();
  };

  useEffect(() => {
    if (isOpen) {
      fetchComments();
    }
  }, [isOpen]);

  // Function to fetch comments from Firestore
  const fetchComments = async () => {
    try {
      const querySnapshot = await getDocs(
        query(collection(db, "postComments"), where("Pid", "==", Pid))
      );
      const commentsData: CommentData[] = [];
      querySnapshot.forEach((doc) => {
        commentsData.push(doc.data() as CommentData);
      });
      setComments(commentsData);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const saveCommentToFirestore = async () => {
    try {
      // get the user
      const userMail = user?.email;

      // create the comment
      if (userMail) {
        const newComment: CommentData = {
          description: commentDescription,
          id:
            commentDescription.slice(0, 7).toLowerCase().replace(/\s+/g, "-") +
            Math.floor(Math.random() * (9999 - 0 + 1)) +
            0,
          Uid: userMail,
          Uname: user?.displayName || "",
          Upic: user?.photoURL || "",
          Pid: Pid,
          date: new Date().toISOString(),
          likedBy: [],
          dislikedBy: [],
        };

        // go to the firestore and into the collection communityComments
        const commentDocRef = doc(db, "postComments", newComment.id);

        // go to the firstore and into the collection users and into that specific user
        const DocRef = doc(db, "users", userMail);

        // go to the firstore and into the collection communities
        const PDocRef = doc(db, "communityPosts", Pid);

        // wait for response
        const userDocSnapshot = await getDoc(DocRef);
        const PDocSnapshot = await getDoc(PDocRef);

        // Save the comment data in the comment document
        await setDoc(commentDocRef, newComment);

        // Save the comment ID in the user document and its collection
        await updateDoc(DocRef, {
          comments: [
            ...(userDocSnapshot.data()?.comments || []),
            newComment.id,
          ],
        });

        await updateDoc(PDocRef, {
          comments: [...(PDocSnapshot.data()?.comments || []), newComment.id],
        });

        console.log("Comment saved successfully");
        setCommentDescription("");
      }
    } catch (error) {
      console.error("Error saving comment:", error);
    }
  };

  // Function to handle liking a post
  const handleLike = async (commentID: string, userId: string) => {
    try {
      const commentRef = doc(db, "postComments", commentID);
      const commentDoc = await getDoc(commentRef);
      if (commentDoc.exists()) {
        let likedBy = commentDoc.data()?.likedBy || [];
        let dislikedBy = commentDoc.data()?.dislikedBy || [];
        // Check if user already liked the post
        if (!likedBy.includes(userId)) {
          // Add user to likedBy array
          likedBy.push(userId);
          // Remove user from dislikedBy array if already disliked
          dislikedBy = dislikedBy.filter((id: string) => id !== userId);
          // Update post document
          await updateDoc(commentRef, {
            likedBy,
            dislikedBy,
          });
        } else {
          // Remove user from likedBy array
          likedBy = likedBy.filter((id: string) => id !== userId);
          // Update post document
          await updateDoc(commentRef, {
            likedBy,
          });
        }
      }
    } catch (error) {
      console.error("Error updating like:", error);
    }
  };

  // Function to handle disliking a post
  const handleDislike = async (commentId: string, userId: string) => {
    try {
      const commentRef = doc(db, "postComments", commentId);
      const commentDoc = await getDoc(commentRef);
      if (commentDoc.exists()) {
        let likedBy = commentDoc.data()?.likedBy || [];
        let dislikedBy = commentDoc.data()?.dislikedBy || [];
        // Check if user already disliked the post
        if (!dislikedBy.includes(userId)) {
          // Add user to dislikedBy array
          dislikedBy.push(userId);
          // Remove user from likedBy array if already liked
          likedBy = likedBy.filter((id: string) => id !== userId);
          // Update post document
          await updateDoc(commentRef, {
            likedBy,
            dislikedBy,
          });
        } else {
          // Remove user from dislikedBy array
          dislikedBy = dislikedBy.filter((id: string) => id !== userId);
          // Update post document
          await updateDoc(commentRef, {
            dislikedBy,
          });
        }
      }
    } catch (error) {
      console.error("Error updating dislike:", error);
    }
  };

  const deleteComment = async (commentToDelete: CommentData) => {
    try {
      // Check if the currently logged-in user is the owner of the comment
      if (commentToDelete.Uid === user?.email) {
        // Delete the comment document from Firestore
        await deleteDoc(doc(db, "postComments", commentToDelete.id));

        // Remove the comment ID from the user's comments array
        await updateDoc(doc(db, "users", commentToDelete.Uid), {
          comments: arrayRemove(commentToDelete.id),
        });

        // Remove the comment ID from the post's comments array
        await updateDoc(doc(db, "communityPosts", commentToDelete.Pid), {
          comments: arrayRemove(commentToDelete.id),
        });

        // Update the comments state to remove the deleted comment
        setComments(
          comments.filter((comment) => comment.id !== commentToDelete.id)
        );

        console.log("Comment deleted successfully");
      } else {
        console.log("Only the owner of the comment can delete it.");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const renderModalContent = () => {
    if (!commentsEnabled) {
      return (
        <Text textAlign="center" color="gray.500" mt="50px">
          Comments Disabled
        </Text>
      );
    }
    // Sort comments based on the number of likes in descending order
    const sortedComments = comments.slice().sort((a, b) => {
      const likesA =
        (a.likedBy ? a.likedBy.length : 0) -
        (a.dislikedBy ? a.dislikedBy.length : 0);
      const likesB =
        (b.likedBy ? b.likedBy.length : 0) -
        (b.dislikedBy ? b.dislikedBy.length : 0);
      return likesB - likesA;
    });

    return (
      <>
        {sortedComments.length === 0 ? (
          <Text textAlign="center" color="gray.500" mt="50px">
            Be the first to comment on this post!
          </Text>
        ) : (
          sortedComments.map((comment, index) => (
            <Comment
              key={index}
              comment={comment}
              currentUser={user?.email || ""}
              userId={comment.Uid}
              onLike={handleLike}
              onDislike={handleDislike}
              deleteComment={deleteComment}
            />
          ))
        )}
      </>
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalBody maxHeight="60vh" overflowY="auto">
          {renderModalContent()}
        </ModalBody>
        <ModalFooter position="sticky" bottom="0" bg="white" zIndex="sticky">
          <Flex alignItems="center" justify="space-between" width="100%">
            <Textarea
              placeholder="Write a comment..."
              value={commentDescription}
              onChange={handleCommentDescriptionChange}
              disabled={!commentsEnabled}
            />
            <Button
              colorScheme="blue"
              leftIcon={<BiMessageSquareAdd />}
              onClick={SaveNClose}
            >
              Send
            </Button>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CommentModal;
