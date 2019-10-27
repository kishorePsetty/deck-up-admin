import React, { Component } from 'react';
import { Button, Card, CardBody, CardGroup, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
const utils = require('../../../utils/utils');

class Login extends Component {

  constructor(args) {
    super(args);
    this.state = {
        email: '',
        password: '',
        loginError: false,
        loginSuccess: false,
        loggingInUser: false
    }
    this.updateEmailValue = this.updateEmailValue.bind(this);
    this.updatePasswordValue = this.updatePasswordValue.bind(this);
  }

  updateEmailValue(value) {
    this.setState({
        email: value.target.value
    });
}

updatePasswordValue(value) {
    this.setState({
        password: value.target.value
    });
}

async validateLogin() {
    this.setState({loggingInUser: true});
    const { history } = this.props;
    const login = await fetch(`/api/user/login`, {
        headers: utils.getHeadersWithAuth(),
        method: 'POST',
        body: JSON.stringify({
            userId: this.state.email,
            password: this.state.password
        })
    });
    login.json().then(loginDetails => {
        if (!loginDetails.success === false) {
            this.setState({
                loginError: true
            });
        }
        if (loginDetails.token) {
            this.setState({loggingInUser: false});
            localStorage.setItem('loginToken', loginDetails.token);
            this.setState({
                loginError: false,
                loginSuccess: true
            });
            history.push('/');
        } else {
            this.setState({loggingInUser: false});
            this.setState({
                loginError: true,
                loginSuccess: false
            });
        }
    }).catch(err => {
        console.log(err);
        this.setState({
            loginError: true,
            loggingInUser: false
        });
    });
  }

  render() {
    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="8">
              <CardGroup>
                <Card className="p-4">
                  <CardBody>
                    <Form>
                      <h1>Login</h1>
                      <p className="text-muted">Sign In to your account</p>
                      <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-user"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input type="text" placeholder="Username" autoComplete="username" value={this.state.email} onChange={this.updateEmailValue}/>
                      </InputGroup>
                      <InputGroup className="mb-4">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-lock"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input type="password" placeholder="Password" autoComplete="current-password" value={this.state.password} onChange={this.updatePasswordValue}/>
                      </InputGroup>
                      <Row>
                        <Col xs="6">
                          <Button color="primary" className="px-4" onClick={this.validateLogin.bind(this)}>Login</Button>
                        </Col>
                      </Row>
                    </Form>
                  </CardBody>
                </Card>
              </CardGroup>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Login;
