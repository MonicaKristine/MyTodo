import TodoNavbar from "../components/navbar";
import SignupForm from "../components/signupForm";
import { useAuth } from "../context/useAuth";
import "../App.css";

function Signup() {
  const { user, logout } = useAuth();

  if (user) {
    return (
      <div className="app">
        <TodoNavbar />
        <main>
          <p>Logged in as {user.email}</p>
          <button onClick={logout}>Logout</button>
        </main>
      </div>
    );
  }
  return (
    <div className="app">
      <TodoNavbar />
      <main>
        <SignupForm />
      </main>
    </div>
  );
}

export default Signup;
