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
  Alert
} from "reactstrap";
const utils = require("../../utils/utils");

class Diy extends Component {
  constructor(args) {
    super(args);
    this.state = {
      diyTitle: "",
      diyDescription: "",
      diyCategory: "0",
      allDiys: [],
      allDiyCategories: [],
      showAddDiyModal: false,
      gettingDiys: false,
      uploadingDiy: false,
      diyVideoUrl: "",
      showDiyAddSuccessAlert: false,
      addDiySuccessMessage: "",
      showDeleteDiyConfirmModal: false,
      deleteDiyId: "",
      deleteDiyInProgress: false,
      showDiyDeleteErrorAlert: false,
      diyDeleteErrorMessage: ""
    };
    this.updateDiyDescriptionValue = this.updateDiyDescriptionValue.bind(this);
    this.updateDiyTitleValue = this.updateDiyTitleValue.bind(this);
    this.updateDiyVideoUrlValue = this.updateDiyVideoUrlValue.bind(this);
    this.uploadDiy = this.uploadDiy.bind(this);
    this.getAllDiys = this.getAllDiys.bind(this);
    this.getAllDiyCategories = this.getAllDiyCategories.bind(this);
    this.addDiyCategory = this.addDiyCategory.bind(this);
    this.resetDiyDetails = this.resetDiyDetails.bind(this);
    this.clearAddDiyFormData = this.clearAddDiyFormData.bind(this);
    this.removeDiy = this.removeDiy.bind(this);
  }

  componentWillMount() {
    this.getAllDiys();
    this.getAllDiyCategories();
  }

  async getAllDiys() {
    this.setState({ gettingDiys: true });
    const diys = await fetch(`/api/diy/allDiy`, {
      method: "GET",
      headers: utils.getHeaders()
    });
    diys
      .json()
      .then(response => {
        this.setState({ allDiys: response.data, gettingDiys: false });
      })
      .catch(err => {
        console.log(err);
      });
  }

  async getAllDiyCategories() {
    const diyCategories = await fetch(`/api/diy-category/allDiyCategories`, {
      method: "GET",
      headers: utils.getHeaders()
    });
    diyCategories
      .json()
      .then(response => {
        this.setState({ allDiyCategories: response.data });
      })
      .catch(err => {
        console.log(err);
      });
  }

  resetDiyDetails() {
    this.setState({
      diyTitle: "",
      diyDescription: "",
      diyVideoUrl: "",
      diyCategory: ""
    });
  }

  updateDiyTitleValue(event) {
    this.setState({ diyTitle: event.target.value });
  }

  updateDiyDescriptionValue(event) {
    this.setState({ diyDescription: event.target.value });
  }

  updateDiyVideoUrlValue(event) {
    this.setState({ diyVideoUrl: event.target.value });
  }

  addDiyCategory(event) {
    this.setState({ diyCategory: event.target.value });
  }

  clearAddDiyFormData() {
    this.setState({
      uploadingDiy: false,
      diyTitle: "",
      diyDescription: "",
      diyVideoUrl: "",
      diyCategory: "0"
    });
  }

  async uploadDiy() {
    this.setState({ uploadingDiy: true });
    const postData = JSON.stringify({
      diyTitle: this.state.diyTitle,
      diyDescription: this.state.diyDescription,
      diyVideoUrl: this.state.diyVideoUrl,
      diyCategory: this.state.diyCategory
    });
    const upload = await fetch(`/api/diy/upload`, {
      method: "POST",
      headers: utils.getHeaders(),
      body: postData
    });
    upload
      .json()
      .then(response => {
        if (response.success) {
          this.clearAddDiyFormData();
          this.getAllDiys();
          this.setState({
            showDiyAddSuccessAlert: true,
            addDiySuccessMessage: response.message
          });
          setInterval(() => {
            this.setState({
              showDiyAddSuccessAlert: false,
              addDiySuccessMessage: ""
            });
          }, 3000);
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  editDiyData(diyData) {
    this.setState({
      diyCategory: diyData.category,
      showAddDiyModal: true,
      diyTitle: diyData.title,
      diyDescription: diyData.description,
      diyVideoUrl: diyData.videoUrl
    });
  }

  confirmDiyDelete(diyData) {
    this.setState({
      showDeleteDiyConfirmModal: true,
      deleteDiyId: diyData._id
    });
  }

  async removeDiy() {
    this.setState({ deleteDiyInProgress: true });
    const remove = await fetch(`/api/diy/delete`, {
      method: "POST",
      headers: utils.getHeaders(),
      body: JSON.stringify({ id: this.state.deleteDiyId })
    });
    remove
      .json()
      .then(response => {
        if (!response.success) {
          this.setState({
            showDiyDeleteErrorAlert: true,
            diyDeleteErrorMessage: response.message,
            deleteDiyInProgress: false
          });
          return;
        }
        this.getAllDiys();
        this.setState({
          showDeleteDiyConfirmModal: false,
          deleteDiyInProgress: false
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    const {
      showAddDiyModal,
      showDiyAddSuccessAlert,
      addDiySuccessMessage,
      showDeleteDiyConfirmModal,
      showDiyDeleteErrorAlert,
      diyDeleteErrorMessage
    } = this.state;
    return (
      <div className="animated fadeIn">
        <Card>
          <CardHeader>
            <Row>
              <Col>
                <strong>Do It Yourself</strong>
              </Col>
              <Col md={{ span: 3, offset: 8 }}>
                <Button
                  block
                  color="primary"
                  onClick={() => this.setState({ showAddDiyModal: true })}
                >
                  Add Diy
                </Button>
              </Col>
            </Row>
          </CardHeader>
          <CardBody>
            <Table hover bordered striped responsive size="sm">
              <thead>
                <tr>
                  <th className="text-center">Title</th>
                  <th className="text-center">Description</th>
                  <th className="text-center">URL</th>
                  <th className="text-center">Category</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {this.state.allDiys && this.state.allDiys.length ? (
                  this.state.allDiys.map(diy => {
                    return (
                      <tr>
                        <td className="text-center">{diy.title}</td>
                        <td className="text-center">{diy.description}</td>
                        <td className="text-center">{diy.videoUrl}</td>
                        <td className="text-center">{diy.category}</td>
                        <td className="text-center">
                          <Row>
                            <Col>
                              <Button
                                block
                                color="info"
                                onClick={this.editDiyData.bind(this, diy)}
                              >
                                Edit
                              </Button>
                            </Col>
                            <Col>
                              <Button
                                block
                                color="danger"
                                onClick={this.confirmDiyDelete.bind(this, diy)}
                              >
                                Delete
                              </Button>
                            </Col>
                          </Row>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colspan="12" className="text-center">
                      No Diys Added
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </CardBody>
        </Card>

        <Modal
          isOpen={showAddDiyModal}
          toggle={() => {
            this.setState({ showAddDiyModal: !showAddDiyModal });
          }}
          className={"modal-lg " + this.props.className}
        >
          <ModalHeader
            toggle={() => {
              this.setState({ showAddDiyModal: !showAddDiyModal });
            }}
          >
            Add Diy
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
                    value={this.state.diyTitle}
                    onChange={this.updateDiyTitleValue}
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
                    value={this.state.diyDescription}
                    onChange={this.updateDiyDescriptionValue}
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
                    value={this.state.diyVideoUrl}
                    onChange={this.updateDiyVideoUrlValue}
                  />
                </Col>
              </FormGroup>

              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="select">Category</Label>
                </Col>
                <Col xs="12">
                  <select
                    name="select"
                    id="diycategory"
                    value={this.state.diyCategory}
                    onChange={this.addDiyCategory}
                  >
                    <option value="0" disabled>
                      Please select category
                    </option>
                    {this.state.allDiyCategories &&
                    this.state.allDiyCategories.length
                      ? this.state.allDiyCategories.map(category => {
                          return (
                            <option key={category._id} value={category.name}>
                              {category.name}
                            </option>
                          );
                        })
                      : null}
                  </select>
                </Col>
              </FormGroup>
            </Form>
            {showDiyAddSuccessAlert ? (
              <Alert color="success">{addDiySuccessMessage}</Alert>
            ) : null}
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              disabled={this.state.uploadingDiy}
              onClick={this.uploadDiy}
            >
              Add
            </Button>{" "}
            <Button
              color="secondary"
              disabled={this.state.uploadingDiy}
              onClick={() => {
                this.setState({ showAddDiyModal: false });
              }}
            >
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
        <Modal
          isOpen={showDeleteDiyConfirmModal}
          toggle={showDeleteDiyConfirmModal}
          className={"modal-danger " + this.props.className}
        >
          <ModalHeader
            toggle={() => {
              this.setState({
                showDeleteDiyConfirmModal: !showDeleteDiyConfirmModal,
                diyDeleteErrorMessage: "",
                showDiyDeleteErrorAlert: false
              });
            }}
          >
            Delete Diy
          </ModalHeader>
          <ModalBody className="text-center">
            <div className="m-5">
              <strong>Are you sure?</strong>
            </div>
            {showDiyDeleteErrorAlert ? (
              <Alert color="danger">{diyDeleteErrorMessage}</Alert>
            ) : null}
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              disabled={this.state.deleteDiyInProgress}
              onClick={this.removeDiy}
            >
              Confirm
            </Button>{" "}
            <Button
              color="secondary"
              disabled={this.state.deleteDiyInProgress}
              onClick={() => {
                this.setState({
                  showDeleteDiyConfirmModal: false,
                  showDiyDeleteErrorAlert: false,
                  diyDeleteErrorMessage: ""
                });
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

export default Diy;
