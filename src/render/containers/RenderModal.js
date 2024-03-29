import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { attemptCreateRender, resetRender } from '../render.reducer';
import { currentTemplate } from '../../template/template.reducer';
import { Heading, Modal } from '../../shared/components/theme';
import Popup from '../../shared/components/Popup';
import RenderForm from './RenderForm';
import LoadingCircles from '../../shared/components/LoadingCircles';

class RenderModal extends Component {

  componentWillUnmount() {
    this.props.resetRender();
    this.props.currentTemplate();
  }

  handleSubmit(event) {
    event.preventDefault();
    if (this.props.template) {
      this.props.attemptCreateRender(this.props.template.id);
    }
  }

  render() {
    const { template, loading } = this.props;
    const tags = template && template.tags ? template.tags : [];
    const data = tags.reduce((accum, next) => ({
      ...accum,
      [next.name]: next.placeholder || '',
    }), {});
    return (
      <Modal handleClose={ this.props.handleClose }>
        <Popup>
          <Heading inverted>Render Document</Heading>
          { loading && !template ? <LoadingCircles space /> : template && <RenderForm
            handleSubmit={ event => this.handleSubmit(event) }
            initialValues={{ data }}
            tags={ tags }
            { ...this.props }
          /> }
        </Popup>
      </Modal>
    );
  }

}

RenderModal.propTypes = {
  attemptCreateRender: PropTypes.func.isRequired,
  resetRender: PropTypes.func.isRequired,
  currentTemplate: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
  template: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }),
  loading: PropTypes.bool.isRequired,
};

RenderModal.defaultProps = {
  template: null,
};

const mapStateToProps = ({
  render: { loading, problem },
  template,
}) => ({
  loading: loading || template.loading,
  problem,
  template: template.current,
});
const mapDispatchToProps = { attemptCreateRender, currentTemplate, resetRender };
export default connect(mapStateToProps, mapDispatchToProps)(RenderModal);
