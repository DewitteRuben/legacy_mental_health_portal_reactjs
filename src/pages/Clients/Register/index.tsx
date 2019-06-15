// import QRCode from "qrcore.react";
import React, { CSSProperties } from "react";
import { Button, Form, Row, Col, Alert, Card } from "react-bootstrap";
import { registerClient } from "../../../services/api";
import QRCode from "qrcode.react";
import { getProfId } from "../../../services/localStorage";

interface RegisterClientProps {}

interface RegisterClientState {
  clientData?: any;
  createdClientId: string;
  isSuccess: boolean;
  alertMessage: string;
}

export default class RegisterClient extends React.Component<
  RegisterClientProps,
  RegisterClientState
> {
  constructor(props: any) {
    super(props);
    this.state = {
      clientData: null,
      createdClientId: "",
      isSuccess: false,
      alertMessage: ""
    };
  }

  handleInputChange = (event: any) => {
    const target = event.target;
    const name = target.name;

    this.setState({
      clientData: { ...this.state.clientData, [name]: target.value }
    });
  };

  clearInput = () => {
    this.setState({ clientData: null });
  };

  createClient = async () => {
    const { clientData } = this.state;
    const profId = getProfId();
    if (
      profId &&
      profId.length &&
      clientData &&
      clientData.firstName &&
      clientData.lastName &&
      clientData.dateOfBirth
    ) {
      try {
        const response = await registerClient(clientData, profId);
        if (response.userId) {
          this.setState({
            createdClientId: response.userId
          });
          this.clearInput();
        }
        this.setState({
          isSuccess: response.code === 200,
          alertMessage: response.message
        });
      } catch (error) {
        console.log("Failed to register user!");
      }
    }
  };

  isRegistered = () => {
    const { createdClientId } = this.state;
    return createdClientId.length > 0;
  };

  public render() {
    const { createdClientId, alertMessage, isSuccess } = this.state;

    return (
      <React.Fragment>
        <main style={container}>
          {this.isRegistered() && (
            <Alert variant={isSuccess ? "success" : "danger"}>
              {alertMessage}
            </Alert>
          )}
          <h1>Register new client</h1>
          <Row>
            <Col>
              <Form>
                <Form.Group>
                  <Form.Label>First name</Form.Label>
                  <Form.Control
                    name="firstName"
                    onChange={this.handleInputChange}
                    type="text"
                    placeholder="First name"
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Last name</Form.Label>
                  <Form.Control
                    name="lastName"
                    onChange={this.handleInputChange}
                    type="text"
                    placeholder="Last name"
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Date of birth</Form.Label>
                  <Form.Control
                    name="dateOfBirth"
                    onChange={this.handleInputChange}
                    type="date"
                  />
                </Form.Group>
              </Form>
              <Button onClick={this.createClient} variant="primary">
                Register client
              </Button>
            </Col>
            <Col>
              {this.isRegistered() && (
                <Card className="text-center">
                  <Card.Header>New Client</Card.Header>
                  <Card.Body>
                    <Card.Title>QR Code of registered client</Card.Title>
                    <Card.Text>
                      <QRCode value={createdClientId} />
                    </Card.Text>
                    <Button href={"/clients/" + createdClientId}>
                      View client Details
                    </Button>
                  </Card.Body>
                </Card>
              )}
            </Col>
            <Col />
          </Row>
        </main>
      </React.Fragment>
    );
  }
}

const container = {
  padding: "2rem",
  width: "100%",
  overflow: "auto"
} as CSSProperties;
