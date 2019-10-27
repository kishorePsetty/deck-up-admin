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

class Categories extends Component {
  constructor(args) {
    super(args);
    this.state = {
      categoryName: "",
      allCategories: [],
      showAddCategoryModal: false,
      gettingCategories: false,
      uploadingCategories: false,
      showAddCategorySuccessAlert: false,
      addCategorySuccessMessage: "",
      dropdownOpen: new Array(6).fill(false)
    };
    this.updateCategoryNameValue = this.updateCategoryNameValue.bind(this);
    this.addCategory = this.addCategory.bind(this);
    this.getAllCategories = this.getAllCategories.bind(this);
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
    this.getAllCategories();
  }

  updateCategoryNameValue(event) {
    this.setState({ categoryName: event.target.value });
  }

  async addCategory() {
    const upload = await fetch(`/api/category/addCategory`, {
      method: "POST",
      headers: utils.getHeaders(),
      body: JSON.stringify({ name: this.state.categoryName })
    });
    upload
      .json()
      .then(response => {
        this.setState({ categoryName: "" });
        this.getAllCategories();
        this.setState({
          showAddCategorySection: true,
          addCategorySuccessMessage: response.message
        });
        setInterval(() => {
          this.setState({
            showAddCategorySection: false,
            addCategorySuccessMessage: ""
          });
        }, 3000);
      })
      .catch(err => {
        console.log(err);
      });
  }

  async getAllCategories() {
    this.setState({ gettingCategories: true });
    const categories = await fetch(`/api/category/allCategories`, {
      method: "GET",
      headers: utils.getHeaders()
    });
    categories
      .json()
      .then(response => {
        this.setState({
          allCategories: response.data,
          gettingCategories: false
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  async removeCategory(categoryId) {
    const remove = await fetch(`/api/category/delete`, {
      method: "POST",
      headers: utils.getHeaders(),
      body: JSON.stringify({ id: categoryId })
    });
    remove
      .json()
      .then(response => {
        if (response.success) {
          this.getAllCategories();
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    const {
      showAddCategoryModal,
      showAddCategorySuccessAlert,
      addCategorySuccessMessage
    } = this.state;
    return (
      <div className="animated fadeIn">
        <Card>
          <div className="float-right">
            <Button
              block
              color="primary"
              onClick={() => this.setState({ showAddCategoryModal: true })}
            >
              Add Category
            </Button>
          </div>
          <CardHeader>
            <i className="fa fa-align-justify"></i>
            <strong>Category</strong>
          </CardHeader>
          <CardBody>
            <ListGroup>
              {this.state.allCategories && this.state.allCategories.length ? (
                <div>
                  {this.state.allCategories.map(category => {
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
          isOpen={showAddCategoryModal}
          toggle={() => {
            this.setState({
                showAddCategoryModal: !showAddCategoryModal
            });
          }}
          className={"modal-lg " + this.props.className}
        >
          <ModalHeader
            toggle={() => {
              this.setState({
                showAddCategoryModal: !showAddCategoryModal
              });
            }}
          >
            Add Brand
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
                    id="categoryname"
                    name="text-input"
                    placeholder="Enter Name"
                    value={this.state.categoryName}
                    onChange={this.updateCategoryNameValue}
                  />
                </Col>
              </FormGroup>
            </Form>
            {showAddCategorySuccessAlert ? (
              <Alert color="success">{addCategorySuccessMessage}</Alert>
            ) : null}
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              disabled={this.state.uploadingCategories}
              onClick={this.addCategory}
            >
              Add
            </Button>{" "}
            <Button
              color="secondary"
              disabled={this.state.uploadingCategories}
              onClick={() => {
                this.setState({ showAddCategoryModal: false });
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

export default Categories;
