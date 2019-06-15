// import QRCode from "qrcore.react";
import React, { CSSProperties } from "react";
import { Button, Spinner, ListGroup, Table } from "react-bootstrap";
import { getAvailableClients, removeClient } from "../../services/api";
import { withRouter } from "react-router";
import { getProfId } from "../../services/localStorage";

interface ClientsProps {
  history: any;
}

interface ClientsState {
  clients: object[];
  loading: boolean;
}

const clientsComponent = withRouter(props => <Clients {...props} />);

class Clients extends React.Component<ClientsProps, ClientsState> {
  constructor(props: any) {
    super(props);
    this.state = {
      loading: false,
      clients: []
    };
  }

  async componentDidMount() {
    this.loadClients();
  }

  loadClients = async () => {
    this.setState({ loading: true });
    const profId = getProfId();
    if (profId && profId.length) {
      const res = await getAvailableClients();
      if (res.code === 200) {
        this.setState({ clients: res.clients });
      }
    }
    this.setState({ loading: false });
  };

  renderListItems = () => {
    const { clients } = this.state;
    return clients.map((client: any) => (
      <tr
        style={tableRowStyle}
        key={client._id}
        onClick={() => this.props.history.push(`/clients/${client.userId}`)}
      >
        <td>{client.userId}</td>
        <td>
          {client.firstName} {client.lastName}
        </td>
        <td>{new Date(client.dateOfBirth).toLocaleDateString()}</td>
        <td>
          <Button
            onClick={async (ev: any) => {
              ev.preventDefault();
              ev.stopPropagation();
              try {
                const res = await removeClient(client.userId);
                this.loadClients();
              } catch (error) {}
            }}
          >
            Delete
          </Button>
        </td>
      </tr>
    ));
  };

  public render() {
    const { loading, clients } = this.state;

    console.log(clients);
    if (loading) {
      return <Spinner animation="border" variant="primary" />;
    }

    return (
      <React.Fragment>
        <main style={mainStyle}>
          <h1>Your clients</h1>
          <div style={head}>
            <Button href="/clients/register">Register new Client</Button>
          </div>
          <div style={content}>
            <Table bordered hover>
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Full Name</th>
                  <th>Date of birth</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>{this.renderListItems()}</tbody>
            </Table>
          </div>
        </main>
      </React.Fragment>
    );
  }
}

const mainStyle = {
  padding: "20px",
  width: "100%",
  overflow: "auto"
} as CSSProperties;

const head = {
  marginBottom: "20px"
} as CSSProperties;

const content = {
  display: "flex",
  justifyContent: "center"
} as CSSProperties;

const tableRowStyle = {
  cursor: "pointer"
} as CSSProperties;

export default clientsComponent;
