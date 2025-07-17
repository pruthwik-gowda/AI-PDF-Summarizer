import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home/Home.jsx";
import YouTubeSummariser from "./Pages/YouTubeSummariser/YouTubeSummariser.jsx";
import TextSummariser from "./Pages/TextSummariser/TextSummariser.jsx";
import Login from "./Pages/Login/Login.jsx";
import Signup from "./Pages/Signup/Signup.jsx";
import Navbar from "./Pages/Navbar/Navbar.jsx";
import './App.css';
import Profile from "./Pages/Profile/Profile.jsx";

function App() {
  return (
    <Router>
      <Navbar/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/youtube" element={<YouTubeSummariser />} />
          <Route path="/text-summarise" element={<TextSummariser />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
    </Router>
  );
}

export default App;

