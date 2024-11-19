import React from "react";
import PolicyList from "../components/policies/PolicyList";
import Navbar from "../components/NavBar";
import Hero from "../components/Hero";
import Footer from "../components/Footer";

const HomePage: React.FC = () => {
  return (
    <div>
      <Navbar active="home"/>
      <Hero />
      <PolicyList />
      <Footer />
    </div>
  );
};

export default HomePage;