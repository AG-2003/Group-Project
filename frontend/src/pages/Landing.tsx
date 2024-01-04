import Navbar from "../components/Landing/navbar";
import Body from "../components/Landing/body";
import Footer from "../components/Landing/footer";

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
