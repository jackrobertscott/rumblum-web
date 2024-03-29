import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Switch, Route, Redirect } from 'react-router-dom';
import { redirectUnauthenticatedGuard } from '../../guards';
import { attemptGetWorkspaces, attemptGetWorkspaceUsage, currentWorkspace } from '../../workspace/workspace.reducer';
import { modalCampaign } from '../campaign.reducer';
import { MODAL_SETTINGS, MODAL_SHARE, MODAL_TEMPLATE, MODAL_INSPECT, MODAL_RENDER, MODAL_SPACE, MODAL_TEMPLATE_DEFAULTS, MODAL_CREATE_SPACE } from '../shared.constants';
import { Container } from '../components/theme/index';
import Header from './Header';
import Footer from '../components/Footer';
import ShareModal from '../../player/containers/ShareModal';
import SettingsModal from './SettingsModal';
import SpaceModal from './SpaceModal';
import CreateSpaceModal from '../../workspace/containers/CreateSpaceModal';
import InspectModal from './InspectModal';
import TemplateModal from '../../template/containers/TemplateModal';
import DefaultsModal from '../../template/containers/DefaultsModal';
import RenderModal from '../../render/containers/RenderModal';
import Splash from '../components/Splash';
import FrameWrapper from '../components/FrameWrapper';
import MainPage from './MainPage';

class Frame extends Component {

  componentDidMount() {
    this.props.attemptGetWorkspaces()
      .then(({ error, data }) => {
        if (!error && data && data.workspaces && data.workspaces.length) {
          const workspace = data.workspaces[0];
          this.props.currentWorkspace(workspace);
          this.props.attemptGetWorkspaceUsage(workspace.id);
        }
      });
  }

  render() {
    const { modal, player } = this.props;
    if (!player) {
      return <Splash />;
    }
    return (
      <FrameWrapper>
        <Header />
        <Container>
          <Switch>
            <Route path="/templates" exact component={ MainPage } />
            <Redirect to="/templates" />
          </Switch>
        </Container>
        <Footer />
        { modal && modal === MODAL_SHARE && <ShareModal handleClose={ () => this.props.modalCampaign() } /> }
        { modal && modal === MODAL_SETTINGS && <SettingsModal handleClose={ () => this.props.modalCampaign() } /> }
        { modal && modal === MODAL_SPACE && <SpaceModal handleClose={ () => this.props.modalCampaign() } /> }
        { modal && modal === MODAL_TEMPLATE && <TemplateModal handleClose={ () => this.props.modalCampaign() } /> }
        { modal && modal === MODAL_TEMPLATE_DEFAULTS && <DefaultsModal handleClose={ () => this.props.modalCampaign() } /> }
        { modal && modal === MODAL_INSPECT && <InspectModal handleClose={ () => this.props.modalCampaign() } /> }
        { modal && modal === MODAL_RENDER && <RenderModal handleClose={ () => this.props.modalCampaign() } /> }
        { modal && modal === MODAL_CREATE_SPACE && <CreateSpaceModal handleClose={ () => this.props.modalCampaign() } /> }
      </FrameWrapper>
    );
  }

}

Frame.propTypes = {
  attemptGetWorkspaces: PropTypes.func.isRequired,
  attemptGetWorkspaceUsage: PropTypes.func.isRequired,
  currentWorkspace: PropTypes.func.isRequired,
  modalCampaign: PropTypes.func.isRequired,
  player: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }),
  modal: PropTypes.string,
};

Frame.defaultProps = {
  player: null,
  modal: null,
};

const mapStateToProps = ({
  campaign: { modal },
  player,
}) => ({
  modal,
  player: player.current,
});
const mapDispatchToProps = {
  attemptGetWorkspaces,
  attemptGetWorkspaceUsage,
  currentWorkspace,
  modalCampaign,
};
export default compose(
  redirectUnauthenticatedGuard,
  connect(mapStateToProps, mapDispatchToProps),
)(Frame);
