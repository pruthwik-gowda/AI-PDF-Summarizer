import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home/Home.jsx";
import YouTubeSummariser from "./Pages/YouTubeSummariser/YouTubeSummariser.jsx";
import TextSummariser from "./Pages/TextSummariser/TextSummariser.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/youtube" element={<YouTubeSummariser />} />
        <Route path="/text-summarise" element={<TextSummariser />} />
      </Routes>
    </Router>
  );
}

export default App;

