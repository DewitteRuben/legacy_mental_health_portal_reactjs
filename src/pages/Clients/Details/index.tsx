import {
  getClientByUserId,
  getClientMoodDataByUserId,
  getTasksByUserId,
  addTaskByUserId,
  removeTask,
  getClientWeightDataByUserId
} from "../../../services/api";
import React, { CSSProperties } from "react";
import { withRouter } from "react-router";
import {
  Card,
  Button,
  Spinner,
  Nav,
  Row,
  Col,
  Tabs,
  Tab,
  Table
} from "react-bootstrap";
import QRCode from "qrcode.react";
import { getProfId } from "../../../services/localStorage";
import { Line } from "react-chartjs-2";
import { Form } from "react-bootstrap";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FormGroup } from "react-bootstrap";

interface DetailsProps {
  match: any;
}

interface DetailsState {
  clientData: any;
  moodData: any;
  loading: boolean;
  selectedEntry: any;
  taskData: any;
  selectedTab: string;
  taskForm: any;
  datePeriod: string;
  weightData: any;
}

const detailsComponent = withRouter(props => <DetailClient {...props} />);

const datePeriodMapping: { [key: string]: number } = {
  week: 604800000,
  twoWeek: 2 * 604800000,
  month: 4 * 604800000,
  twoMonth: 8 * 604800000,
  fourMonth: 16 * 604800000,
  sixMonth: 24 * 604800000,
  eightMonth: 32 * 604800000,
  year: 12 * 2600000000
};

const moodChartMapping: { [key: string]: number } = {
  veryGood: 20,
  good: 15,
  moderate: 10,
  bad: 5,
  veryBad: 0
};

const yToSmileyMapping: { [key: number]: any } = {
  20: "Very Good",
  15: "Good",
  10: "Moderate",
  5: "Bad",
  0: "Very Bad"
};

const moodToTextMapping: { [key: string]: string } = {
  veryGood: "Very Good",
  good: "Good",
  moderate: "Moderate",
  bad: "Bad",
  veryBad: "Very Bad"
};

class DetailClient extends React.Component<DetailsProps, DetailsState> {
  private dateRef = React.createRef();
  constructor(props: any) {
    super(props);
    this.state = {
      clientData: null,
      moodData: null,
      loading: true,
      selectedEntry: null,
      taskData: null,
      selectedTab: "mood",
      taskForm: null,
      datePeriod: "week",
      weightData: null
    };
  }

  handleInputChange = (event: any) => {
    const target = event.target;
    const name = target.name;

    this.setState({
      taskForm: { ...this.state.taskForm, [name]: target.value }
    });
  };

  setDatePeriod = (event: any) => {
    this.setState({ datePeriod: event.target.value });
  };

  loadWeightData = async () => {
    const userId = this.props.match.params.userId;

    this.setState({ loading: true });
    try {
      const weightData = await getClientWeightDataByUserId(userId);
      weightData.sort(
        (a: any, b: any) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      this.setState({ weightData });
    } catch (error) {
    } finally {
      this.setState({ loading: false });
    }
  };

  loadTaskData = async () => {
    const userId = this.props.match.params.userId;

    this.setState({ loading: true });
    try {
      const taskData = await getTasksByUserId(userId);
      this.setState({ taskData });
    } catch (error) {
    } finally {
      this.setState({ loading: false });
    }
  };

  loadMoodData = async () => {
    const userId = this.props.match.params.userId;

    this.setState({ loading: true });
    try {
      const moodData = await getClientMoodDataByUserId(userId);
      moodData.sort(
        (a: any, b: any) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      this.setState({ moodData });
    } catch (error) {
    } finally {
      this.setState({ loading: false });
    }
  };

  refreshCurrent = async () => {
    const { selectedTab } = this.state;
    if (selectedTab === "tasks") {
      this.loadTaskData();
    } else {
      this.loadMoodData();
      this.loadWeightData();
    }
  };

  async componentDidMount() {
    const userId = this.props.match.params.userId;
    if (userId) {
      try {
        this.setState({ loading: true });
        const profId = getProfId();
        if (profId && profId.length) {
          const res = await getClientByUserId(userId);
          const moodData = await getClientMoodDataByUserId(userId);
          const taskData = await getTasksByUserId(userId);
          const weightData = await getClientWeightDataByUserId(userId);
          weightData.sort(
            (a: any, b: any) =>
              new Date(b.date).getTime() - new Date(a.date).getTime()
          );
          moodData.sort(
            (a: any, b: any) =>
              new Date(b.date).getTime() - new Date(a.date).getTime()
          );
          if (res.client.length) {
            this.setState({
              weightData,
              moodData,
              taskData,
              clientData: res.client[0]
            });
          }
        }
      } catch (error) {
      } finally {
        this.setState({ loading: false });
      }
    }
  }

  getMoodChartData = () => {
    const { moodData } = this.state;
    let graphData = null;
    if (moodData) {
      graphData = moodData.map((entry: any) => {
        return { x: new Date(entry.date), y: moodChartMapping[entry.mood] };
      });
      graphData.sort((a: any, b: any) => {
        return b.x.getTime() - a.x.getTime();
      });
    }
    return graphData;
  };

  getWeightChartData = () => {
    const { weightData } = this.state;
    let graphData = null;
    if (weightData) {
      graphData = weightData.map((entry: any) => ({
        x: new Date(entry.date),
        y: entry.amount
      }));
      graphData.sort((a: any, b: any) => {
        return b.x.getTime() - a.x.getTime();
      });
    }
    return graphData;
  };

  getSleepChartData = () => {
    const { moodData } = this.state;
    let graphData = null;
    if (moodData) {
      graphData = moodData.map((entry: any) => ({
        x: new Date(entry.date),
        y: entry.sleep
      }));
      graphData.sort((a: any, b: any) => {
        return b.x.getTime() - a.x.getTime();
      });
    }
    return graphData;
  };

  addTask = async (ev: any) => {
    ev.preventDefault();
    const { taskForm } = this.state;
    const userId = this.props.match.params.userId;
    try {
      const res = await addTaskByUserId(userId, taskForm);
      this.setState({ taskForm: null }, this.loadTaskData);
    } catch (error) {}
  };

  handleGraphClick = (event: any) => {
    const { moodData } = this.state;
    if (event.length) {
      const activeElement = event[0];
      const index = activeElement._index;
      this.setState({ selectedEntry: moodData[index] });
    }
  };

  getWeightGraphOptions = () => {
    const { datePeriod, weightData } = this.state;
    let unit = "kg";
    if (weightData.length) {
      unit = weightData[0].unit;
    }
    const time = datePeriodMapping[datePeriod];

    const graphData = this.getWeightChartData();
    console.log("graphData", graphData);
    const amountArray = graphData.map((e: any) => e.y);
    const minWeight = Math.min.apply(Math, amountArray);
    const maxWeight = Math.max.apply(Math, amountArray);

    const minDate = graphData
      .map((e: any) => e.x)
      .reduce((acc: any, curVal: any) => {
        if (curVal.getTime() < acc.getTime()) {
          return curVal;
        }
        return acc;
      }, new Date());
    const maxDate = graphData
      .map((e: any) => e.x)
      .reduce((acc: any, curVal: any) => {
        if (curVal.getTime() > acc.getTime()) {
          return curVal;
        }
        return acc;
      }, new Date());

    return {
      title: {
        display: true,
        text: "Weight"
      },
      legend: {
        position: "bottom"
      },
      tooltips: {
        callbacks: {
          label: function(item: any, data: any) {
            return `Weight: ${item.yLabel} ${unit}`;
          }
        }
      },
      scales: {
        yAxes: [
          {
            ticks: {
              // Include a dollar sign in the ticks
              min: minWeight,
              max: maxWeight + 5,
              stepSize: 2
            }
          }
        ],
        xAxes: [
          {
            type: "time",
            time: {
              unit:
                datePeriod === "year" ||
                datePeriod === "fourMonth" ||
                datePeriod === "sixMonth" ||
                datePeriod === "eightMonth"
                  ? "week"
                  : "day",
              unitStepSize:
                datePeriod === "year" ||
                datePeriod === "twoMonth" ||
                datePeriod === "fourMonth" ||
                datePeriod === "sixMonth" ||
                datePeriod === "eightMonth"
                  ? 2
                  : 1,
              min: minDate.getTime(),
              max: minDate.getTime() + time
            },
            ticks: {
              callback: function(value: any) {
                return value;
              }
            }
          }
        ]
      }
    };
  };

  getSleepGraphOptions = () => {
    const { datePeriod } = this.state;
    const time = datePeriodMapping[datePeriod];

    const graphData = this.getSleepChartData();
    const minDate = graphData
      .map((e: any) => e.x)
      .reduce((acc: any, curVal: any) => {
        if (curVal.getTime() < acc.getTime()) {
          return curVal;
        }
        return acc;
      }, new Date());
    const maxDate = graphData
      .map((e: any) => e.x)
      .reduce((acc: any, curVal: any) => {
        if (curVal.getTime() > acc.getTime()) {
          return curVal;
        }
        return acc;
      }, new Date());

    return {
      title: {
        display: true,
        text: "Sleep"
      },
      legend: {
        position: "bottom"
      },
      tooltips: {
        callbacks: {
          label: function(item: any, data: any) {
            return `Sleep: ${item.yLabel} hour(s)`;
          }
        }
      },
      scales: {
        yAxes: [
          {
            ticks: {
              // Include a dollar sign in the ticks
              min: 1,
              max: 24,
              stepSize: 1
            }
          }
        ],
        xAxes: [
          {
            type: "time",
            time: {
              unit:
                datePeriod === "year" ||
                datePeriod === "fourMonth" ||
                datePeriod === "sixMonth" ||
                datePeriod === "eightMonth"
                  ? "week"
                  : "day",
              unitStepSize:
                datePeriod === "year" ||
                datePeriod === "twoMonth" ||
                datePeriod === "fourMonth" ||
                datePeriod === "sixMonth" ||
                datePeriod === "eightMonth"
                  ? 2
                  : 1,
              min: minDate.getTime(),
              max: minDate.getTime() + time
            },
            ticks: {
              callback: function(value: any) {
                return value;
              }
            }
          }
        ]
      }
    };
  };

  getGraphOptions = () => {
    const { datePeriod } = this.state;
    const time = datePeriodMapping[datePeriod];

    const graphData = this.getMoodChartData();
    const minDate = graphData
      .map((e: any) => e.x)
      .reduce((acc: any, curVal: any) => {
        if (curVal.getTime() < acc.getTime()) {
          return curVal;
        }
        return acc;
      }, new Date());
    const maxDate = graphData
      .map((e: any) => e.x)
      .reduce((acc: any, curVal: any) => {
        if (curVal.getTime() > acc.getTime()) {
          return curVal;
        }
        return acc;
      }, new Date());

    return {
      title: {
        display: true,
        text: "Mood"
      },
      legend: {
        position: "bottom"
      },
      tooltips: {
        callbacks: {
          label: function(item: any, data: any) {
            return `Mood: ${yToSmileyMapping[item.yLabel]}`;
          }
        }
      },
      scales: {
        yAxes: [
          {
            ticks: {
              // Include a dollar sign in the ticks
              callback: function(value: any, index: any, values: any) {
                return yToSmileyMapping[value];
              },
              min: 0,
              max: 20,
              stepSize: 5
            }
          }
        ],
        xAxes: [
          {
            type: "time",
            time: {
              unit:
                datePeriod === "year" ||
                datePeriod === "fourMonth" ||
                datePeriod === "sixMonth" ||
                datePeriod === "eightMonth"
                  ? "week"
                  : "day",
              unitStepSize:
                datePeriod === "year" ||
                datePeriod === "twoMonth" ||
                datePeriod === "fourMonth" ||
                datePeriod === "sixMonth" ||
                datePeriod === "eightMonth"
                  ? 2
                  : 1,
              min: minDate.getTime(),
              max: minDate.getTime() + time
            },
            ticks: {
              callback: function(value: any) {
                return value;
              }
            }
          }
        ]
      }
    };
  };

  deleteTask = async (taskId: string) => {
    const userId = this.props.match.params.userId;
    this.setState({ loading: true });

    try {
      const res = await removeTask(userId, taskId);
      this.loadTaskData();
    } catch (error) {
      console.log(error);
    }
  };

  renderTableItems = () => {
    const { taskData } = this.state;
    return taskData.map((task: any, index: any) => (
      <tr key={task._id}>
        <td>{index + 1}</td>
        <td>{new Date(task.dateOfAssignement).toLocaleString()}</td>
        <td>{task.title}</td>
        <td>{task.description}</td>
        <td>{task.isDone ? "Yes" : "No"}</td>
        <td>
          {task.completionDate
            ? new Date(task.completionDate).toLocaleString()
            : "Not completed yet"}
        </td>
        <td>
          <Button onClick={() => this.deleteTask(task._id)}>Delete</Button>
        </td>
      </tr>
    ));
  };

  public render() {
    const {
      clientData,
      loading,
      selectedEntry,
      selectedTab,
      weightData
    } = this.state;

    console.log(this.getMoodChartData());
    if (loading) {
      return (
        <div
          style={{
            display: "flex",
            flex: 1,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Spinner animation="border" variant="primary" />
        </div>
      );
    }

    return (
      <React.Fragment>
        <main style={mainStyle}>
          <Row>
            <Col>
              <Card style={{ width: "70%" }}>
                <Card.Header>General information</Card.Header>
                <Card.Body style={cardBody}>
                  <div>
                    <Card.Title>Client Details</Card.Title>
                    <Card.Text>Id: {clientData.userId}</Card.Text>
                    <Card.Text>First name: {clientData.firstName}</Card.Text>
                    <Card.Text>Last name: {clientData.lastName}</Card.Text>
                    <Card.Text>
                      Birth date:{" "}
                      {new Date(clientData.dateOfBirth).toLocaleDateString()}
                    </Card.Text>
                  </div>
                  <div style={qrCodeContainer}>
                    <Card.Title>Client QR Code</Card.Title>
                    <QRCode value={clientData.userId} />
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Row style={{ marginTop: "20px", flex: 0, alignItems: "center" }}>
            <Col>
              <Card>
                <Card.Header>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <span>Analytics overview</span>
                    <Form.Control
                      style={{ width: "30%" }}
                      onChange={this.setDatePeriod}
                      as="select"
                    >
                      <option value="week">Week</option>
                      <option value="twoWeek">2 Weeks</option>
                      <option value="month">Month</option>
                      <option value="twoMonth">2 Months</option>
                      <option value="fourMonth">4 Months</option>
                      <option value="sixMonth">6 Months</option>
                      <option value="eightMonth">8 Months</option>
                      <option value="year">1 Year</option>
                    </Form.Control>
                    <Button onClick={this.refreshCurrent}>
                      <FontAwesomeIcon icon="sync" />
                    </Button>
                  </div>
                </Card.Header>
                <Card.Header style={{ backgroundColor: "#ffff" }}>
                  <Tabs
                    onSelect={(tab: any) => this.setState({ selectedTab: tab })}
                    defaultActiveKey={selectedTab}
                    id="clientTabs"
                  >
                    <Tab eventKey="mood" title="Mood">
                      <div style={{ marginTop: "50px", marginBottom: "50px" }}>
                        <Line
                          data={{
                            datasets: [
                              {
                                label: "Mood entry",
                                fill: false,
                                lineTension: 0.1,
                                backgroundColor: "rgba(75,192,192,0.4)",
                                borderColor: "rgba(75,192,192,1)",
                                borderCapStyle: "butt",
                                borderDash: [],
                                borderDashOffset: 0.0,
                                borderJoinStyle: "miter",
                                pointBorderColor: "rgba(75,192,192,1)",
                                pointBackgroundColor: "#fff",
                                pointBorderWidth: 1,
                                pointHoverRadius: 5,
                                pointHoverBackgroundColor: "rgba(75,192,192,1)",
                                pointHoverBorderColor: "rgba(220,220,220,1)",
                                pointHoverBorderWidth: 2,
                                pointRadius: 5,
                                pointHitRadius: 10,
                                data: this.getMoodChartData()
                              }
                            ],
                            labels: ["Test1"]
                          }}
                          options={this.getGraphOptions()}
                          getElementAtEvent={this.handleGraphClick}
                        />
                        <Line
                          data={{
                            datasets: [
                              {
                                label: "Sleep",
                                fill: false,
                                lineTension: 0.1,
                                backgroundColor: "rgba(107,179,91,0.4)",
                                borderColor: "rgba(107,179,91,1)",
                                borderCapStyle: "butt",
                                borderDash: [],
                                borderDashOffset: 0.0,
                                borderJoinStyle: "miter",
                                pointBorderColor: "rgba(107,179,91,1)",
                                pointBackgroundColor: "#fff",
                                pointBorderWidth: 1,
                                pointHoverRadius: 5,
                                pointHoverBackgroundColor: "rgba(107,179,91,1)",
                                pointHoverBorderColor: "rgba(220,220,220,1)",
                                pointHoverBorderWidth: 2,
                                pointRadius: 5,
                                pointHitRadius: 10,
                                data: this.getSleepChartData()
                              }
                            ],
                            labels: ["Test1"]
                          }}
                          options={this.getSleepGraphOptions()}
                          getElementAtEvent={this.handleGraphClick}
                        />
                      </div>
                    </Tab>
                    <Tab eventKey="tasks" title="Tasks">
                      <div style={{ marginTop: "50px", marginBottom: "50px" }}>
                        <Table bordered>
                          <thead>
                            <tr>
                              <th>#</th>
                              <th>Assignment date</th>
                              <th>Task title</th>
                              <th>Task description</th>
                              <th>Has been completed</th>
                              <th>Completion Date</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>{this.renderTableItems()}</tbody>
                        </Table>
                      </div>
                    </Tab>
                    <Tab eventKey="weight" title="Weight">
                      <div style={{ marginTop: "50px", marginBottom: "50px" }}>
                        <Line
                          data={{
                            datasets: [
                              {
                                label: "Weight",
                                fill: false,
                                lineTension: 0.1,
                                backgroundColor: "rgba(255,91,91,0.4)",
                                borderColor: "rgba(255,91,91,1)",
                                borderCapStyle: "butt",
                                borderDash: [],
                                borderDashOffset: 0.0,
                                borderJoinStyle: "miter",
                                pointBorderColor: "rgba(255,91,91,1)",
                                pointBackgroundColor: "#fff",
                                pointBorderWidth: 1,
                                pointHoverRadius: 5,
                                pointHoverBackgroundColor: "rgba(255,91,91,1)",
                                pointHoverBorderColor: "rgba(220,220,220,1)",
                                pointHoverBorderWidth: 2,
                                pointRadius: 5,
                                pointHitRadius: 10,
                                data: this.getWeightChartData()
                              }
                            ],
                            labels: ["Test1"]
                          }}
                          options={this.getWeightGraphOptions()}
                          getElementAtEvent={this.handleGraphClick}
                        />
                      </div>
                    </Tab>
                  </Tabs>
                </Card.Header>
              </Card>
            </Col>
            <Col>
              {selectedTab !== "weight" && (
                <Card>
                  <Card.Body>
                    {selectedTab === "mood" && (
                      <div>
                        <Card.Title>Selected Mood Entry</Card.Title>
                        {!selectedEntry && (
                          <Card.Text>
                            Click on the graph to select an entry
                          </Card.Text>
                        )}
                        {selectedEntry && (
                          <div>
                            <Card.Text>
                              Entry date:{" "}
                              {new Date(selectedEntry.date).toLocaleString()}
                            </Card.Text>
                            <Card.Text>Mood:</Card.Text>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                flexDirection: "column",
                                alignItems: "center",
                                flex: 1
                              }}
                            >
                              <img
                                src={require(`../../../assets/images/icons/smiley_${selectedEntry.mood.toLowerCase()}.png`)}
                                style={{ width: "80px", height: "80px" }}
                              />
                              <Card.Text>
                                {moodToTextMapping[selectedEntry.mood]}
                              </Card.Text>
                            </div>
                            <div>
                              <Card.Text>Emotions:</Card.Text>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center"
                                }}
                              >
                                {selectedEntry.emotions.map(
                                  (emotion: any, index: any) => (
                                    <Button
                                      key={index}
                                      variant="primary"
                                      active={true}
                                      style={{
                                        borderRadius: "25px",
                                        marginRight: "5px"
                                      }}
                                    >
                                      {emotion}
                                    </Button>
                                  )
                                )}
                              </div>
                            </div>
                            <div>
                              <Card.Text>Experiences:</Card.Text>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  flexDirection: "column"
                                }}
                              >
                                {selectedEntry.experiences.map(
                                  (experience: any, index: any) => (
                                    <Button
                                      key={index}
                                      variant={
                                        experience.positive ? "success" : "dark"
                                      }
                                      active={true}
                                      style={{
                                        marginBottom: "5px",
                                        borderRadius: "25px"
                                      }}
                                    >
                                      {experience.value}
                                    </Button>
                                  )
                                )}
                              </div>
                            </div>
                            <div style={{ marginBottom: "10px" }}>
                              <React.Fragment>
                                <Card.Text>Hours of sleep:</Card.Text>
                                <Form.Control
                                  disabled={true}
                                  style={{ textAlign: "center" }}
                                  value={
                                    selectedEntry.sleep.toString() + " hour(s)"
                                  }
                                />
                              </React.Fragment>
                            </div>
                            <div>
                              {selectedEntry.thoughts.length > 0 && (
                                <React.Fragment>
                                  <Card.Text>Thoughts:</Card.Text>
                                  <Form.Control
                                    as="textarea"
                                    style={{ resize: "none" }}
                                    disabled={true}
                                    value={selectedEntry.thoughts}
                                  />
                                </React.Fragment>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    {selectedTab === "tasks" && (
                      <div>
                        <Card.Title>Assign a new task</Card.Title>
                        <Form>
                          <Form.Group>
                            <Form.Label>Assignment Date</Form.Label>
                            <Form.Control
                              name="dateOfAssignement"
                              onChange={this.handleInputChange}
                              type="date"
                              defaultValue={moment().format("YYYY-MM-DD")}
                              placeholder="Assignment Date"
                            />
                          </Form.Group>
                          <Form.Group>
                            <Form.Label>Task title</Form.Label>
                            <Form.Control
                              name="title"
                              onChange={this.handleInputChange}
                              type="text"
                              placeholder="Enter a task title"
                            />
                          </Form.Group>
                          <Form.Group>
                            <Form.Label>Task description</Form.Label>
                            <Form.Control
                              name="description"
                              placeholder="Enter a descripion"
                              onChange={this.handleInputChange}
                              as="textarea"
                            />
                          </Form.Group>
                        </Form>
                        <Button
                          style={{ float: "right" }}
                          onClick={this.addTask}
                          variant="primary"
                        >
                          Assign task
                        </Button>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              )}
            </Col>
          </Row>
        </main>
      </React.Fragment>
    );
  }
}

const qrCodeContainer = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center"
} as CSSProperties;

const card = {} as CSSProperties;

const cardBody = {
  display: "flex",
  justifyContent: "space-between"
} as CSSProperties;

const mainStyle = {
  padding: "20px",
  width: "100%",
  height: "100vh",
  overflow: "auto"
} as CSSProperties;

export default detailsComponent;
