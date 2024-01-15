import "./JoinedTeams.scss";

const JoinedTeams = () => {
  return (
    <div className="your-teams-container">
      <div className="heading-container">
        <h2 className="heading">Your Teams</h2>
      </div>
      <div className="message-container">
        <p className="message">You are not in any teams.</p>
      </div>
    </div>
  );
};

export default JoinedTeams;
