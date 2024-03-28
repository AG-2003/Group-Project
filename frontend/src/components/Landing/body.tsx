import React from "react";
import landingBg from "../../assets/landing-bg.png";
import create from "../../assets/Create.png";
import collaborate from "../../assets/Collaborate.png";
import communities from "../../assets/Communities.png";
import share from "../../assets/Share.png";
import leaderboard from "../../assets/Leaderboard.png";
import "./body.scss"; 

export const Body: React.FC = () => {
  return (
    <div className="landing-container">
      <img
        src={landingBg}
        alt="Landing Background"
        className="background-image"
      />
      <div className="header">
        <div className="heading">
          <h1>Welcome to Your Design Platform</h1>
          <p>Create stunning designs, collaborate with others, and more!</p>
        </div>
      </div>
      <div className="centered-rectangle">
        <div className="feature">
          <div className="text-content-left">
            <h2>Create Designs</h2>
            <p>
              Design beautiful documents, slides, spreadsheets, and whiteboards.
            </p>
          </div>
          <div className="image-content-left">
            <img src={create} />
          </div>
        </div>
      </div>

      <div className="centered-rectangle">
        <div className="feature">
          <div className="text-content-right">
            <h2>Collaborate Effortlessly</h2>
            <p>Work with others in real-time to bring your ideas to life.</p>
          </div>
          <div className="image-content-right">
            <img src={collaborate} />
          </div>
        </div>
      </div>
      <div className="centered-rectangle">
        <div className="feature">
          <div className="text-content-left">
            <h2>Join Communities</h2>
            <p>Connect with like-minded creators in communities and teams.</p>
          </div>
          <div className="image-content-left">
            <img src={communities} />
          </div>
        </div>
      </div>
      <div className="centered-rectangle">
        <div className="feature">
          <div className="text-content-right">
            <h2>Share Your Work</h2>
            <p>Showcase your designs and posts to the world.</p>
          </div>
          <div className="image-content-right">
            <img src={share} />
          </div>
        </div>
      </div>
      <div className="centered-rectangle">
        <div className="feature">
          <div className="text-content-left">
            <h2>Compete on the Leaderboard</h2>
            <p>Rise to the top and earn recognition for your creativity.</p>
          </div>
          <div className="image-content-left">
            <img src={leaderboard} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Body;
