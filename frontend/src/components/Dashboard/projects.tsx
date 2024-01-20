import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../firebase-config";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./Projects.scss";
import { SuiteData } from "../../interfaces/SuiteData";



const Projects: React.FC = () => {
  const [projects, setProjects] = useState<SuiteData[]>([]);
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      if (user?.email) {
        const userDocRef = doc(db, "users", user.email);
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          const userDocuments: SuiteData[] = userData.documents || [];
          const userSheets: SuiteData[] = userData.sheets || [];
          const userWhiteboards: SuiteData[] = userData.whiteboards || [];
          const userPowerpoints: SuiteData[] = userData.powerpoints || [];

          // Use the existing lastEdited field from Firestore data, don't generate a new one
          const combinedProjects: SuiteData[] = [
            ...userDocuments,
            ...userSheets,
            ...userWhiteboards,
            ...userPowerpoints,
          ];

          setProjects(combinedProjects);
        }
      }
    };

    fetchProjects();


    fetchProjects();
  }, [user]);

  const handleCardClick = (projectId: string, projectTitle: string, type: string) => {
    // Adjust the navigation path based on the project type
    let path: string = '';
    switch (type) {
      case 'document':
        path = `/doc/?id=${encodeURIComponent(projectId)}&title=${encodeURIComponent(projectTitle)}`;
        break;
      case 'sheet':
        path = `/sheet/?id=${encodeURIComponent(projectId)}&title=${encodeURIComponent(projectTitle)}`;
        break;
      // Add cases for 'whiteboard' and 'powerpoint' as necessary
    }
    navigate(path);
  };

  const stripHtml = (html: string): string => {
    // Create a new div element and set its innerHTML to the HTML string
    const temporalDivElement = document.createElement('div');
    temporalDivElement.innerHTML = html;
    // Retrieve the text content from the div, which will be the plain text without HTML tags
    return temporalDivElement.textContent || temporalDivElement.innerText || '';
  };

  const formatDate = (dateString: string): string => {
    const date: Date = new Date(dateString);
    const hours: number = date.getHours();
    const minutes: number = date.getMinutes();
    const day: number = date.getDate();
    const month: number = date.getMonth() + 1; // Month is 0-indexed
    const year: number = date.getFullYear();

    // Convert 24hr time to 12hr time and set am/pm
    const hours12: number = hours % 12 || 12; // Convert hour to 12-hour format
    const amPm: string = hours < 12 ? 'AM' : 'PM';

    // Format minutes to always be two digits
    const formattedMinutes: string | number = minutes < 10 ? `0${minutes}` : minutes;

    // Format the date string
    return `${hours12}:${formattedMinutes} ${amPm}, ${day}/${month}/${year}`;
  };


  return (
    <div className="projects-container">
      <h2 className="projects-heading">Recent Designs</h2>
      <div className="projects-list">
        {projects.map((project: SuiteData) => (
          <div
            key={project.id}
            className="project-card"
            onClick={() => handleCardClick(project.id, project.title, project.type)}
          >
            <h3 className="project-title">{project.title}</h3>
            <p className="project-content">
              {typeof project.content === 'string' ? stripHtml(project.content).substring(0, 20) : 'No content available'}...
            </p>
            <p className="last-edited">
              Last edited: {formatDate(project.lastEdited)}
            </p>
          </div>
        ))}
        {projects.length === 0 && (
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
