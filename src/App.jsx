import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Pokemon from "./pages/Pokemon";

function App() {
  return (
    <Router>
      {/* navigation */}
      <nav className="p-4 flex items-center justify-between">
        <Link to="/">
          <img src="/pokeball.svg" width={50} alt="Pokemon Explorer" />
        </Link>
      </nav>

      {/*routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pokemon/:name" element={<Pokemon />} />
      </Routes>
    </Router>
  );
}

export default App;
