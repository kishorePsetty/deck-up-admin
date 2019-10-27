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

class Brands extends Component {
  constructor(args) {
    super(args);
    this.state = {
      brandName: "",
      allBrands: [],
      showAddBrandModal: false,
      gettingBrands: false,
      uploadingBrand: false,
      showAddBrandSuccessAlert: false,
      addBrandSuccessMessage: "",
      dropdownOpen: new Array(6).fill(false)
    };
    this.updateBrandyNameValue = this.updateBrandyNameValue.bind(this);
    this.addBrand = this.addBrand.bind(this);
    this.getAllBrands = this.getAllBrands.bind(this);
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
    this.getAllBrands();
  }

  async getAllBrands() {
    this.setState({ gettingBrands: true });
    const brands = await fetch(`/api/brand/allBrands`, {
      method: "GET"
    });
    brands
      .json()
      .then(response => {
        this.setState({ allBrands: response.data, gettingBrands: false });
      })
      .catch(err => {
        console.log(err);
      });
  }

  updateBrandyNameValue(event) {
    this.setState({ brandName: event.target.value });
  }

  async addBrand() {
    const upload = await fetch(`/api/brand/addBrand`, {
      method: "POST",
      headers: utils.getHeaders(),
      body: JSON.stringify({ name: this.state.brandName })
    });
    upload
      .json()
      .then(response => {
        this.getAllBrands();
        this.setState({ brandName: "" });
        this.setState({
          showDiyAddSuccessAlert: true,
          addBrandSuccessMessage: response.message
        });
        setInterval(() => {
          this.setState({
            showDiyAddSuccessAlert: false,
            addBrandSuccessMessage: ""
          });
        }, 3000);
      })
      .catch(err => {
        console.log(err);
      });
  }

  async removeBrand(brandId) {
    const remove = await fetch(`/api/brand/delete`, {
      method: "POST",
      headers: utils.getHeaders(),
      body: JSON.stringify({ id: brandId })
    });
    remove
      .json()
      .then(response => {
        if (response.success) {
          this.getAllBrands();
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    const {
      showAddBrandModal,
      showAddBrandSuccessAlert,
      addBrandSuccessMessage
    } = this.state;
    return (
      <div className="animated fadeIn">
        <Card>
          <div className="float-right">
            <Button
              block
              color="primary"
              onClick={() => this.setState({ showAddBrandModal: true })}
            >
              Add Brand
            </Button>
          </div>
          <CardHeader>
            <i className="fa fa-align-justify"></i>
            <strong>Brand</strong>
          </CardHeader>
          <CardBody>
            <ListGroup>
              {this.state.allBrands && this.state.allBrands.length ? (
                <div>
                  {this.state.allBrands.map(brand => {
                    return (
                      <ListGroupItem
                        key={brand._id}
                        className="justify-content-between"
                      >
                        <Row>
                          <Col md="6" xs="6">
                            {brand.name}
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
                <div className="w3-center">No Brands Added</div>
              )}
            </ListGroup>
          </CardBody>
        </Card>

        <Modal
          isOpen={showAddBrandModal}
          toggle={() => {
            this.setState({
              showAddBrandModal: !showAddBrandModal
            });
          }}
          className={"modal-lg " + this.props.className}
        >
          <ModalHeader
            toggle={() => {
              this.setState({
                showAddBrandModal: !showAddBrandModal
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
                    id="brandname"
                    name="text-input"
                    placeholder="Enter Name"
                    value={this.state.brandName}
                    onChange={this.updateBrandyNameValue}
                  />
                </Col>
              </FormGroup>
            </Form>
            {showAddBrandSuccessAlert ? (
              <Alert color="success">{addBrandSuccessMessage}</Alert>
            ) : null}
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              disabled={this.state.uploadingBrand}
              onClick={this.addBrand}
            >
              Add
            </Button>{" "}
            <Button
              color="secondary"
              disabled={this.state.uploadingBrand}
              onClick={() => {
                this.setState({ showAddBrandModal: false });
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

export default Brands;
