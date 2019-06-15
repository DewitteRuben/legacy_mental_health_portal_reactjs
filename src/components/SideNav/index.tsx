import React, { CSSProperties } from "react";
import { Nav, Navbar, NavDropdown } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { withRouter } from "react-router";

interface SideNavProps {
  location?: any;
}

interface SideNavState {}

const sideBarComponent = withRouter(props => <SideNav {...props} />);

class SideNav extends React.Component<SideNavProps, SideNavState> {
  public render() {
    const { location } = this.props;

    return (
      <Navbar style={sideNav} bg="light" variant="light">
        <Nav activeKey={location.pathname} className="flex-column">
          <Nav.Link href={"/clients"}>
            <FontAwesomeIcon icon="users" /> Clients
          </Nav.Link>
          <Nav.Link style={subItem} href={"/clients/register"}>
            Register Client
          </Nav.Link>
        </Nav>
      </Navbar>
    );
  }
}

export default sideBarComponent;

const subItem = {
  fontSize: "13px",
  marginLeft: "8px"
} as CSSProperties;

const sideNav = {
  alignItems: "flex-start",
  width: "15%"
} as CSSProperties;
