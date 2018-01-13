import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { attemptChangePassword } from '../player.reducer';
import PasswordForm from './PasswordForm';

class PasswordTab extends Component {

  handleSubmit(event) {
    event.preventDefault();
    this.props.attemptChangePassword(this.props.player.id);
  }

  render() {
    return (
      <PasswordForm
        handleSubmit={ event => this.handleSubmit(event) }
        { ...this.props }
      />
    );
  }

}

PasswordTab.propTypes = {
  attemptChangePassword: PropTypes.func.isRequired,
  player: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
};

const mapStateToProps = ({
  player: { current, loading, problem },
}) => ({ loading, problem, player: current });
const mapDispatchToProps = { attemptChangePassword };
export default connect(mapStateToProps, mapDispatchToProps)(PasswordTab);
