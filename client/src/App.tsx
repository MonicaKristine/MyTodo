import { Routes, Route } from "react-router-dom";
import Todos from "./pages/Todos";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Todos />} />
      <Route path="/users/login" element={<Login />} />
      <Route path="/users/signup" element={<Signup />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
