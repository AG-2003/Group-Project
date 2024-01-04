import { Navbar } from "../components/Landing/Navbar";
import { Body } from "../components/Landing/Body";
import { Footer } from "../components/Landing/Footer";

const Landing: React.FC = () => {
  return (
    <div className="app">
      <Navbar />
      <div className="body-content">
        <Body />
        <Footer />
      </div>
    </div>
  );
};

export default Landing;
