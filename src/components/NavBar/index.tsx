import React from "react";
import { Nav, Navbar, NavDropdown } from "react-bootstrap";
import {
  getJWTToken,
  clearJWTToken,
  clearProfId
} from "../../services/localStorage";

interface NavBarProps {
  loggedIn: boolean;
}

interface NavBarState {}

export default class NavBar extends React.Component<NavBarProps, NavBarState> {
  constructor(props: NavBarProps) {
    super(props);
  }

  logout = () => {
    clearJWTToken();
    clearProfId();
  };

  public render() {
    const { loggedIn } = this.props;

    return (
      <Navbar collapseOnSelect={true} expand="lg" bg="primary" variant="dark">
        <Navbar.Brand href="#home">Mental Health Portal</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto" />
          <Nav>
            {loggedIn ? (
              <Nav.Link onSelect={this.logout} href="/">
                Logout
              </Nav.Link>
            ) : (
              <React.Fragment>
                <Nav.Link>Register</Nav.Link>
              </React.Fragment>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}
