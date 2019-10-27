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
  ModalHeader,
  ListGroup,
  ListGroupItem,
  Dropdown,
  Alert
} from "reactstrap";
const utils = require("../../utils/utils");

class Celebrities extends Component {
  constructor(args) {
    super(args);
    this.state = {
      celebrityName: "",
      showAddCelebrityModal: false,
      allCelebrities: [],
      gettingCelebrities: false,
      uploadingCelebrities: false,
      showAddCelebritySuccessAlert: false,
      addCelebritySuccessMessage: "",
      dropdownOpen: new Array(6).fill(false)
    };
    this.updateCelebrityNameValue = this.updateCelebrityNameValue.bind(this);
    this.addCelebrity = this.addCelebrity.bind(this);
    this.getAllCelebrities = this.getAllCelebrities.bind(this);
  }

  toggle(i) {
    const newArray = this.state.dropdownOpen.map((element, index) => {
      return index === i ? !element : false;
    });
    this.setState({
      dropdownOpen: newArray
    });
  }

  componentWillMount() {
    this.getAllCelebrities();
  }

  updateCelebrityNameValue(event) {
    this.setState({ celebrityName: event.target.value });
  }

  async addCelebrity() {
    const upload = await fetch(`/api/celebrity/addCelebrity`, {
      method: "POST",
      headers: utils.getHeaders(),
      body: JSON.stringify({ name: this.state.celebrityName })
    });
    upload
      .json()
      .then(response => {
        this.getAllCelebrities();
        this.setState({
          celebrityName: "",
          showAddCelebritySuccessAlert: true,
          addCelebritySuccessMessage: response.message
        });
        setInterval(() => {
          this.setState({
            showAddCelebritySuccessAlert: false,
            addCelebritySuccessMessage: ""
          });
        }, 3000);
      })
      .catch(err => {
        console.log(err);
      });
  }

  async removeCelebrity(celebrityId) {
    const remove = await fetch(`/api/celebrity/delete`, {
      method: "POST",
      headers: utils.getHeaders(),
      body: JSON.stringify({ id: celebrityId })
    });
    remove
      .json()
      .then(response => {
        if (response.success) {
          this.getAllCelebrities();
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  async getAllCelebrities() {
    this.setState({ gettingCelebrities: true });
    const celebrities = await fetch(`/api/celebrity/allCelebrities`, {
      method: "GET"
    });
    celebrities
      .json()
      .then(response => {
        this.setState({
          allCelebrities: response.data,
          gettingCelebrities: false
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    const {
      showAddCelebrityModal,
      showAddCelebritySuccessAlert,
      addCelebritySuccessMessage
    } = this.state;
    return (
      <div className="animated fadeIn">
        <Card>
          <div className="float-right">
            <Button
              block
              color="primary"
              onClick={() => this.setState({ showAddCelebrityModal: true })}
            >
              Add Celebrity
            </Button>
          </div>
          <CardHeader>
            <i className="fa fa-align-justify"></i>
            <strong>Celebrity</strong>
          </CardHeader>
          <CardBody>
            <ListGroup>
              {this.state.allCelebrities && this.state.allCelebrities.length ? (
                <div>
                  {this.state.allCelebrities.map(celebrity => {
                    return (
                      <ListGroupItem
                        key={celebrity._id}
                        className="justify-content-between"
                      >
                        <Row>
                          <Col md="6" xs="6">
                            {celebrity.name}
                          </Col>
                          <Col md="6" xs="6">
                            <Dropdown
                              className="float-right"
                              isOpen={this.state.dropdownOpen[5]}
                              toggle={() => {
                                this.toggle(5);
                              }}
                            >
                              <DropdownToggle
                                tag="span"
                                onClick={() => {
                                  this.toggle(5);
                                }}
                                data-toggle="dropdown"
                                aria-expanded={this.state.dropdownOpen[5]}
                              >
                                <i className="cui-options icons font-2xl d-block"></i>
                              </DropdownToggle>
                              <DropdownMenu>
                                <div
                                  className="dropdown-item"
                                  onClick={() => {
                                    this.toggle(5);
                                  }}
                                >
                                  <Row>
                                    <Col md="3" xs="3">
                                      <i className="cui-pencil icons font-2xl d-block"></i>
                                    </Col>
                                    <Col md="4" xs="4">
                                      Edit
                                    </Col>
                                  </Row>
                                </div>
                                <div
                                  className="dropdown-item"
                                  onClick={() => {
                                    this.toggle(5);
                                  }}
                                >
                                  <Row>
                                    <Col md="3" xs="3">
                                      <i className="cui-delete icons font-2xl d-block"></i>
                                    </Col>
                                    <Col md="4" xs="4">
                                      Delete
                                    </Col>
                                  </Row>
                                </div>
                              </DropdownMenu>
                            </Dropdown>
                          </Col>
                        </Row>
                      </ListGroupItem>
                    );
                  })}
                </div>
              ) : (
                <div className="w3-center">No Celebrities Added</div>
              )}
            </ListGroup>
          </CardBody>
        </Card>

        <Modal
          isOpen={showAddCelebrityModal}
          toggle={() => {
            this.setState({
              showAddCelebrityModal: !showAddCelebrityModal
            });
          }}
          className={"modal-lg " + this.props.className}
        >
          <ModalHeader
            toggle={() => {
              this.setState({
                showAddCelebrityModal: !showAddCelebrityModal
              });
            }}
          >
            Add Celebrity
          </ModalHeader>
          <ModalBody>
            <Form className="form-horizontal">
              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="text-input">Name</Label>
                </Col>
                <Col xs="12">
                  <Input
                    type="text"
                    id="celebrityname"
                    name="text-input"
                    placeholder="Enter Name"
                    value={this.state.celebrityName}
                    onChange={this.updateCelebrityNameValue}
                  />
                </Col>
              </FormGroup>
            </Form>
            {showAddCelebritySuccessAlert ? (
              <Alert color="success">{addCelebritySuccessMessage}</Alert>
            ) : null}
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              disabled={this.state.uploadingCelebrities}
              onClick={this.addCelebrity}
            >
              Add
            </Button>{" "}
            <Button
              color="secondary"
              disabled={this.state.uploadingCelebrities}
              onClick={() => {
                this.setState({ showAddCelebrityModal: false });
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

export default Celebrities;
