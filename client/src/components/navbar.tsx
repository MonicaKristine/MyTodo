import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { useAuth } from "../context/useAuth";

function TodoNavbar() {
  const { user } = useAuth();
  return (
    <Navbar
      expand="lg"
      className="todo-navbar w-100"
      data-bs-theme="light"
      fixed="top"
    >
      <Container>
        <Navbar.Brand href="/">My Todos</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto" activeKey="/">
            <Nav.Link href="/">Home</Nav.Link>

            {user ? (
              <Nav.Link href="/users/login">Log out</Nav.Link>
            ) : (
              <>
                <Nav.Link href="/users/login">Log in</Nav.Link>
                <Nav.Link href="/users/signup">Sign up</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default TodoNavbar;
