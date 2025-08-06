import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Layout from "./pages/Layout";
import Dashbord from "./pages/Dashbord";
import WriteArticle from "./pages/WriteArticle";
import BlogTitle from "./pages/BlogTitle";
import GenerateImage from "./pages/GenerateImage";
import ReviewResume from "./pages/ReviewResume";
import RemoveBackground from "./pages/RemoveBackground";
import RemoveObject from "./pages/RemoveObject";
import Community from "./pages/Community";
import { useAuth } from "@clerk/clerk-react";
import { useEffect } from "react";

function App() {
  const { getToken } = useAuth();
  useEffect(() => {
    getToken().then((token) => console.log(token));
  }, []);
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ai" element={<Layout />}>
          <Route index element={<Dashbord />} />
          <Route path="write-article" element={<WriteArticle />} />
          <Route path="blog-titles" element={<BlogTitle />} />
          <Route path="generate-image" element={<GenerateImage />} />
          <Route path="review-resume" element={<ReviewResume />} />
          <Route path="remove-background" element={<RemoveBackground />} />
          <Route path="remove-object" element={<RemoveObject />} />
          <Route path="community" element={<Community />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
