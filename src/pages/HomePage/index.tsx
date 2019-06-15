import React, { CSSProperties } from "react";
import { Button, Form } from "react-bootstrap";
import { NavBar } from "../../components";
import { authProfessional } from "../../services/api";
import {
  setJWTToken,
  getJWTToken,
  getProfId,
  setProfId
} from "../../services/localStorage";
import { withRouter } from "react-router";

interface HomePageProps {
  history: any;
}

interface HomePageState {
  credentials: any;
}

const homePageComponent = withRouter(props => <HomePage {...props} />);

class HomePage extends React.Component<HomePageProps, HomePageState> {
  constructor(props: HomePageProps) {
    super(props);
    this.state = { credentials: {} };
  }

  componentWillMount() {
    const { history } = this.props;
    const token = getJWTToken();
    const profId = getProfId();
    if (token && token.length && profId && profId.length) {
      history.push(`/clients`);
    }
  }

  handleInputChange = (event: any) => {
    const target = event.target;
    const name = target.name;

    this.setState({
      credentials: { ...this.state.credentials, [name]: target.value }
    });
  };

  authenticate = async (event: any) => {
    const { history } = this.props;
    event.preventDefault();
    const { credentials } = this.state;
    if (credentials.email.length && credentials.password.length) {
      const res = await authProfessional(
        credentials.email,
        credentials.password
      );
      if (res.code === 200 && res.token) {
        setJWTToken(res.token);
        setProfId(res.profId);
        history.push(`/clients`);
      }
    }
  };

  public render() {
    const token = getJWTToken();
    const loggedIn = token && token.length ? true : false;

    return (
      <React.Fragment>
        <NavBar loggedIn={loggedIn} />
        <main style={container}>
          <h1>Mental Health Portal:</h1>
          <Form style={form}>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                onInput={this.handleInputChange}
                name="email"
                type="email"
                placeholder="Enter email"
              />
              <Form.Text className="text-muted">
                We'll never share your email with anyone else.
              </Form.Text>
            </Form.Group>
            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                onInput={this.handleInputChange}
                name="password"
                type="password"
                placeholder="Password"
              />
            </Form.Group>
            <Form.Group controlId="formBasicChecbox">
              <Form.Check type="checkbox" label="Remember me" />
            </Form.Group>
            <Button
              onClick={this.authenticate}
              style={{ float: "right" }}
              variant="primary"
              type="submit"
            >
              Submit
            </Button>
          </Form>
        </main>
      </React.Fragment>
    );
  }
}

const form = {
  maxWidth: "50%"
} as CSSProperties;

const container = {
  display: "flex",
  flex: 1,
  justifyContent: "center",
  flexDirection: "column",
  alignItems: "center",
  height: "100%"
} as CSSProperties;

export default homePageComponent;
