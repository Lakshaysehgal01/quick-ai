import React from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import AiTool from "../components/AiTool";
import Testinomial from "../components/Testinomial";
import Plan from "../components/Plan";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <AiTool />
      <Testinomial />
      <Plan/>
      <Footer/>
    </>
  );
};

export default Home;
