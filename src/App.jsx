import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";

function App() {
  return (
    <Router>
      {/* navigation */}
      <nav className="p-4 flex items-center justify-between">
        <img src="/pokeball.svg" width={50} alt="Pokemon Explorer" />
        <div className="grow-4">
          <Link to="/">Home</Link>
        </div>
      </nav>

      {/*routes */}
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
