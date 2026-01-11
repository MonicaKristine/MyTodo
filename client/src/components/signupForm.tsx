import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup as signupApi } from "../api/users";
import { useAuth } from "../context/useAuth";

function SignupForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const auth = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await signupApi(firstName, lastName, email, password);
      const { token } = res.data;
      auth.login(token);
      navigate("/users/login");
    } catch {
      setError("Invalid email or password");
    }
  };

  return (
    <Form className="login-form" onSubmit={handleSubmit}>
      <h1>Signup</h1>

      <Form.Group className="mb-3" controlId="loginFirstName">
        <Form.Label>First name</Form.Label>
        <Form.Control
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="Enter first name here"
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="loginLastName">
        <Form.Label>Last name</Form.Label>
        <Form.Control
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Enter last name here"
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="loginEmail">
        <Form.Label>Email</Form.Label>
        <Form.Control
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email here"
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="loginPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password here"
        />
      </Form.Group>
      {error && <p>{error}</p>}
      <Button className="pink-btn" type="submit">
        Submit
      </Button>
    </Form>
  );
}

export default SignupForm;
