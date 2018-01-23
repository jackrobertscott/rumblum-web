import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { modalCampaign } from '../../shared/campaign.reducer';
import { Spread, Sidebar, Main } from '../components/Sidebar';
import { MODAL_TEMPLATE } from '../../shared/shared.constants';
import { Icon, Button, Group } from '../components/theme';
import SpaceList from '../../workspace/containers/SpaceList';
import TemplateList from '../../template/containers/TemplateList';

const MainPage = ({ workspace, ...props }) => (
  <Spread>
    <Sidebar>
      <SpaceList />
    </Sidebar>
    <Main>
      <Group>
        { workspace && (
          <Button onClick={ () => props.modalCampaign(MODAL_TEMPLATE) }>
            <Icon name="plus" /> Template
          </Button>
        ) }
      </Group>
      { workspace && <TemplateList /> }
    </Main>
  </Spread>
);

MainPage.propTypes = {
  modalCampaign: PropTypes.func.isRequired,
  workspace: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }),
};

MainPage.defaultProps = {
  workspace: null,
};

const mapStateToProps = ({
  workspace,
}) => ({
  workspace: workspace.current,
});
const mapDispatchToProps = { modalCampaign };
export default connect(mapStateToProps, mapDispatchToProps)(MainPage);
