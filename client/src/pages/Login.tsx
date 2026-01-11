import TodoNavbar from "../components/navbar";
import LoginForm from "../components/loginForm";
import { useAuth } from "../context/useAuth";
import "../App.css";

function Login() {
  const { user, logout } = useAuth();

  if (user) {
    return (
      <div className="app">
        <TodoNavbar />
        <main>
          <p>Logged in as {user.name}</p>
          <button onClick={logout}>Logout</button>
        </main>
      </div>
    );
  }
  return (
    <div className="app">
      <TodoNavbar />
      <main>
        <LoginForm />
      </main>
    </div>
  );
}

export default Login;
