import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import queryString from 'query-string';
import DocumentTitle from 'react-document-title';
import { redirectAuthenticatedGuard } from '../../guards';
import { attemptLoginPlayer, cleanPlayer } from '../player.reducer';
import { Container, Title, Button, Group, Heading } from '../../shared/components/theme';
import LoginForm from './LoginForm';
import Page from '../components/Page';

class LoginPage extends Component {

  constructor(props) {
    super(props);
    const { redirect, email } = queryString.parse(props.location.search);
    this.state = {
      redirect,
      init: { email },
    };
  }

  componentWillUnmount() {
    this.props.cleanPlayer();
  }

  handleSubmit(event) {
    event.preventDefault();
    const { redirect } = this.state;
    this.props.attemptLoginPlayer()
      .then(({ error }) => !error && this.props.history.push(redirect || '/templates'));
  }

  render() {
    return (
      <DocumentTitle title="Login | Rumblum">
        <Page>
          <Container>
            <Title flatten>Login</Title>
            <Heading style={{ marginTop: '10px', fontSize: '16px' }}>Rumblum document automation.</Heading>
            <LoginForm
              handleSubmit={ event => this.handleSubmit(event) }
              initialValues={ this.state.init }
              { ...this.props }
            />
            <Group>
              <Button small="true" dull="true" to="/register">Sign Up</Button>
              <Button small="true" dull="true" to="/forgot">Forgot Password</Button>
            </Group>
          </Container>
        </Page>
      </DocumentTitle>
    );
  }

}

LoginPage.propTypes = {
  attemptLoginPlayer: PropTypes.func.isRequired,
  cleanPlayer: PropTypes.func.isRequired,
  location: PropTypes.shape({
    search: PropTypes.string.isRequired,
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

const mapStateToProps = ({
  player: { loading, problem },
}) => ({ loading, problem });
const mapDispatchToProps = { attemptLoginPlayer, cleanPlayer };
export default compose(
  redirectAuthenticatedGuard,
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(LoginPage);
