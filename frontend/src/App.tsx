import './styles/App.css';
import { Route, Routes } from "react-router-dom";
import { HashRouter as Router } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login/" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
