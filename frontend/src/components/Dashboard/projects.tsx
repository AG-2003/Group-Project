import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../firebase-config";
import { doc, getDoc } from "firebase/firestore";
import "./Projects.scss";

interface Document {
  id: string;
  title: string;
  content: string;
  // Add other fields as necessary, like lastEdited, if available
}

const Projects: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [user] = useAuthState(auth);

  useEffect(() => {
    const fetchDocuments = async () => {
      if (user?.email) {
        const userDocRef = doc(db, "users", user.email);
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          const userDocuments = userData.documents || [];
          setDocuments(userDocuments);
        }
      }
    };

    fetchDocuments();
  }, [user]);

  return (
    <div className="projects-container">
      <h2 className="projects-heading">Recent Designs</h2>
      <div className="projects-list">
        {documents.map((doc) => (
          <div key={doc.id} className="project-card">
            <h3 className="project-title">{doc.title}</h3>
            <p className="project-content">
              {doc.content.substring(0, 100)}...
            </p>
            {/* <button
              className="edit-button"
              onClick={() => {
                // TODO: Implement navigation to the document editor
              }}
            >
              Edit Design
            </button> */}
          </div>
        ))}
        {documents.length === 0 && (
          <div className="no-projects">
            <h3 className="no-projects-title">Don't have a design?</h3>
            <p className="no-projects-text">Create your first design now!</p>
            <button className="create-button">Create a design</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
