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

class DiyCategories extends Component {
  constructor(args) {
    super(args);
    this.state = {
      diyCategoryName: "",
      allDiyCategories: [],
      showAddDiyCategoryModal: false,
      gettingDiyCategories: false,
      uploadingDiyCategory: false,
      showDiyCategoryAddSuccessAlert: false,
      addDiyCategorySuccessMessage: "",
      dropdownOpen: new Array(6).fill(false)
    };
    this.updateDiyCategoryNameValue = this.updateDiyCategoryNameValue.bind(
      this
    );
    this.addDiyCategory = this.addDiyCategory.bind(this);
    this.getAllDiyCategories = this.getAllDiyCategories.bind(this);
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
    this.getAllDiyCategories();
  }

  updateDiyCategoryNameValue(event) {
    this.setState({ diyCategoryName: event.target.value });
  }

  async addDiyCategory() {
    const upload = await fetch(`/api/diy-category/upload`, {
      method: "POST",
      headers: utils.getHeaders(),
      body: JSON.stringify({ name: this.state.diyCategoryName })
    });
    upload
      .json()
      .then(response => {
        this.setState({ diyCategoryName: "" });
        this.getAllDiyCategories();
        this.setState({
          showDiyAddSuccessAlert: true,
          addDiyCategorySuccessMessage: response.message
        });
        setInterval(() => {
          this.setState({
            showDiyAddSuccessAlert: false,
            addDiyCategorySuccessMessage: ""
          });
        }, 3000);
      })
      .catch(err => {
        console.log(err);
      });
  }

  async getAllDiyCategories() {
    this.setState({ gettingDiyCategories: true });
    const categories = await fetch(`/api/diy-category/allDiyCategories`, {
      method: "GET",
      headers: utils.getHeaders()
    });
    categories
      .json()
      .then(response => {
        this.setState({
          allDiyCategories: response.data,
          gettingDiyCategories: false
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  async removeDiyCategory(diyCategoryId) {
    const remove = await fetch(`/api/diy-category/delete`, {
      method: "POST",
      headers: utils.getHeaders(),
      body: JSON.stringify({ id: diyCategoryId })
    });
    remove
      .json()
      .then(response => {
        if (response.success) {
          this.getAllDiyCategories();
          alert(response.message);
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    const {
      showAddDiyCategoryModal,
      showDiyCategoryAddSuccessAlert,
      addDiyCategorySuccessMessage
    } = this.state;
    return (
      <div className="animated fadeIn">
        <Card>
          <div className="float-right">
            <Button
              block
              color="primary"
              onClick={() => this.setState({ showAddDiyCategoryModal: true })}
            >
              Add Diy Category
            </Button>
          </div>
          <CardHeader>
            <i className="fa fa-align-justify"></i>
            <strong>Diy Category</strong>
          </CardHeader>
          <CardBody>
            <ListGroup>
              {this.state.allDiyCategories &&
              this.state.allDiyCategories.length ? (
                <div>
                  {this.state.allDiyCategories.map(category => {
                    return (
                      <ListGroupItem
                        key={category._id}
                        className="justify-content-between"
                      >
                        <Row>
                          <Col md="6" xs="6">
                            {category.name}
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
                <div className="w3-center">No Categories Added</div>
              )}
            </ListGroup>
          </CardBody>
        </Card>

        <Modal
          isOpen={showAddDiyCategoryModal}
          toggle={() => {
            this.setState({
              showAddDiyCategoryModal: !showAddDiyCategoryModal
            });
          }}
          className={"modal-lg " + this.props.className}
        >
          <ModalHeader
            toggle={() => {
              this.setState({
                showAddDiyCategoryModal: !showAddDiyCategoryModal
              });
            }}
          >
            Add Diy Category
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
                    id="diytitle"
                    name="text-input"
                    placeholder="Enter Name"
                    value={this.state.diyCategoryName}
                    onChange={this.updateDiyCategoryNameValue}
                  />
                </Col>
              </FormGroup>
            </Form>
            {showDiyCategoryAddSuccessAlert ? <Alert color="success">{addDiyCategorySuccessMessage}</Alert> : null}
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              disabled={this.state.uploadingDiyCategory}
              onClick={this.addDiyCategory}
            >
              Add
            </Button>{" "}
            <Button
              color="secondary"
              disabled={this.state.uploadingDiyCategory}
              onClick={() => {
                this.setState({ showAddDiyCategoryModal: false });
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

export default DiyCategories;
