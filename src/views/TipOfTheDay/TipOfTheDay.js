import React, { Component } from "react";
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Collapse,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Fade,
  Form,
  FormGroup,
  FormText,
  FormFeedback,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupButtonDropdown,
  InputGroupText,
  Label,
  Row,
  Table,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader
} from "reactstrap";
const utils = require("../../utils/utils");

class TipOfTheDay extends Component {
  constructor(args) {
    super(args);
    this.state = {
      tipofTheDayCelebrity: "",
      allTipOfTheDay: [],
      showAddTipOfTheDayModal: false,
      gettingTipOfTheDay: false,
      uploadingTipOfTheDay: false,
      tipOfTheDayVideoUrl: "",
      tipOfTheDayTitle: "",
      tipOfTheDayDescription: "",
      allCelebrities: []
    };
    this.updateTipOfTheDayVideoUrlValue = this.updateTipOfTheDayVideoUrlValue.bind(
      this
    );
    this.updateTipOfTheDayTitleValue = this.updateTipOfTheDayTitleValue.bind(
      this
    );
    this.updateTipOfTheDayDescriptionValue = this.updateTipOfTheDayDescriptionValue.bind(
      this
    );
    this.uploadTipOfTheDay = this.uploadTipOfTheDay.bind(this);
    this.getAllTipOfTheDay = this.getAllTipOfTheDay.bind(this);
    this.getAllCelebrities = this.getAllCelebrities.bind(this);
  }

  componentWillMount() {
    this.getAllTipOfTheDay();
    this.getAllCelebrities();
  }

  async getAllCelebrities() {
    const celebrities = await fetch(`/api/celebrity/allCelebrities`, {
      method: "GET"
    });
    celebrities
      .json()
      .then(response => {
        this.setState({ allCelebrities: response.data });
      })
      .catch(err => {
        console.log(err);
      });
  }

  updateTipOfTheDayTitleValue(event) {
    this.setState({ tipOfTheDayTitle: event.target.value });
  }

  updateTipOfTheDayDescriptionValue(event) {
    this.setState({ tipOfTheDayDescription: event.target.value });
  }

  updateTipOfTheDayVideoUrlValue(event) {
    this.setState({ tipOfTheDayVideoUrl: event.target.value });
  }

  async getAllTipOfTheDay() {
    this.setState({ gettingTipOfTheDay: true });
    const tips = await fetch(`/api/tipoftheday/allTipOfTheDay`, {
      method: "GET",
      headers: utils.getHeaders()
    });
    tips
      .json()
      .then(response => {
        this.setState({
          allTipOfTheDay: response.data,
          gettingTipOfTheDay: false
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  async uploadTipOfTheDay() {
    const postData = {
      tipOfTheDayVideoUrl: this.state.tipOfTheDayVideoUrl,
      tipOfTheDayTitle: this.state.tipOfTheDayTitle,
      tipOfTheDayDescription: this.state.tipOfTheDayDescription,
      tipofTheDayCelebrity: this.state.tipofTheDayCelebrity
    };
    const upload = await fetch(`/api/tipoftheday/upload`, {
      method: "POST",
      body: postData
    });
    upload
      .json()
      .then(response => {
        if (response.success) {
          this.setState({
            uploadingTipOfTheDay: false,
            tipOfTheDayVideoUrl: "",
            tipOfTheDayTitle: "",
            tipOfTheDayDescription: "",
            tipofTheDayCelebrity: ""
          });
          this.getAllTipOfTheDay();
          alert(response.message);
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    const { showAddTipOfTheDayModal } = this.state;
    return (
      <div className="animated fadeIn">
        <Card>
          <div style={{ float: "right" }}>
            <Button
              block
              color="primary"
              onClick={() => this.setState({ showAddTipOfTheDayModal: true })}
            >
              Add Tip Of The Day
            </Button>
          </div>
          <CardHeader>
            <i className="fa fa-align-justify"></i>
            <strong>Tip Of The Day</strong>
          </CardHeader>
          <CardBody>
            <Table hover bordered striped responsive size="sm">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Description</th>
                  <th>URL</th>
                  <th>Category</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Vishnu Serghei</td>
                  <td>2012/01/01</td>
                  <td>Member</td>
                  <td>
                    <Badge color="success">Active</Badge>
                  </td>
                </tr>
                <tr>
                  <td>Zbyněk Phoibos</td>
                  <td>2012/02/01</td>
                  <td>Staff</td>
                  <td>
                    <Badge color="danger">Banned</Badge>
                  </td>
                </tr>
                <tr>
                  <td>Einar Randall</td>
                  <td>2012/02/01</td>
                  <td>Admin</td>
                  <td>
                    <Badge color="secondary">Inactive</Badge>
                  </td>
                </tr>
                <tr>
                  <td>Félix Troels</td>
                  <td>2012/03/01</td>
                  <td>Member</td>
                  <td>
                    <Badge color="warning">Pending</Badge>
                  </td>
                </tr>
                <tr>
                  <td>Aulus Agmundr</td>
                  <td>2012/01/21</td>
                  <td>Staff</td>
                  <td>
                    <Badge color="success">Active</Badge>
                  </td>
                </tr>
              </tbody>
            </Table>
          </CardBody>
        </Card>

        <Modal
          isOpen={showAddTipOfTheDayModal}
          toggle={() => {
            this.setState({ showAddTipOfTheDayModal: !showAddTipOfTheDayModal });
          }}
          className={"modal-lg " + this.props.className}
        >
          <ModalHeader
            toggle={() => {
              this.setState({ showAddTipOfTheDayModal: !showAddTipOfTheDayModal });
            }}
          >
            Add Tip Of The Day
          </ModalHeader>
          <ModalBody>
            <Form className="form-horizontal">
              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="text-input">Title</Label>
                </Col>
                <Col xs="12">
                  <Input
                    type="text"
                    id="diytitle"
                    name="text-input"
                    placeholder="Enter Title"
                    value={this.state.tipOfTheDayTitle}
                    onChange={this.updateTipOfTheDayTitleValue}
                  />
                </Col>
              </FormGroup>

              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="textarea-input">Description</Label>
                </Col>
                <Col xs="12">
                  <Input
                    type="textarea"
                    name="textarea-input"
                    id="diydescription"
                    rows="6"
                    placeholder="Enter Description"
                    value={this.state.tipOfTheDayDescription}
                    onChange={this.updateTipOfTheDayDescriptionValue}
                  />
                </Col>
              </FormGroup>

              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="email-input">Video URL</Label>
                </Col>
                <Col xs="12">
                  <Input
                    type="text"
                    id="diyVideoUrl"
                    name="text-input"
                    placeholder="Enter URL"
                    value={this.state.tipOfTheDayVideoUrl}
                    onChange={this.updateTipOfTheDayVideoUrlValue}
                  />
                </Col>
              </FormGroup>

              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="select">Associate Celebrity</Label>
                </Col>
                <Col xs="12">
                  <Input type="select" name="select" id="select">
                    <option value="0" disabled selected>
                      Please select celebrity
                    </option>
                    {this.state.allCelebrities &&
                    this.state.allCelebrities.length
                      ? this.state.allCelebrities.map(celebrity => {
                          return (
                            <option key={celebrity._id} value={celebrity._id}>
                              {celebrity.name}
                            </option>
                          );
                        })
                      : null}
                  </Input>
                </Col>
              </FormGroup>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              disabled={this.state.uploadingTipOfTheDay}
              onClick={this.uploadTipOfTheDay}
            >
              Add
            </Button>{" "}
            <Button
              color="secondary"
              disabled={this.state.uploadingTipOfTheDay}
              onClick={() => {
                this.setState({ showAddTipOfTheDayModal: false });
              }}
            >
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default TipOfTheDay;
