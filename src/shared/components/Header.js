import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Container, Icon } from '../components/theme';
import Dropdown, { DropItem } from './Dropdown';

const Wrap = styled.div`
  background-color: ${props => props.theme.colors.dark};
  border-bottom: 1px solid ${props => props.theme.colors.darker};
  color: ${props => props.theme.colors.off};
`;

const Content = styled.div`
  height: 50px;
  display: flex;
  align-items: center;
  font-size: 12px;
  text-transform: uppercase;
`;

const Brand = styled.div`
  font-weight: bold;
  font-size: 13px;
  span {
    font-size: 11px;
    color: ${props => props.theme.colors.grey};
  }
`;

const Menu = styled.div`
  margin-left: auto;
  display: flex;
`;

const MenuItem = styled.div`
  margin-left: 10px;
  transition: .2s;
  padding: 5px 7px;
  cursor: pointer;
  position: relative;
  border-radius: ${props => props.theme.size.radius};
  i {
    margin-right: 3px;
  }
  &:hover {
    color: ${props => props.theme.colors.white};
    background-color: ${props => props.theme.colors.darkless};
  }
`;

class Bar extends Component {

  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
  }

  toggleDropdown() {
    this.setState({ open: !this.state.open });
  }

  render() {
    const { handleShare, handleSettings, handleLogout } = this.props;
    const { open } = this.state;
    return (
      <Wrap>
        <Container>
          <Content>
            <Brand>
              Rumblum
              <br />
              <span>Document Templates</span>
            </Brand>
            <Menu>
              <MenuItem onClick={ handleShare }>Share</MenuItem>
              <MenuItem onClick={ () => this.toggleDropdown() }>
                <Icon name="cog" /> Settings
                <Dropdown
                  handleClose={ () => this.toggleDropdown() }
                  active={ open }
                >
                  <DropItem onClick={ handleSettings }>Profile</DropItem>
                  <DropItem onClick={ handleSettings }>Security</DropItem>
                  <DropItem onClick={ handleSettings }>Billing</DropItem>
                  <DropItem onClick={ handleLogout }>Logout</DropItem>
                </Dropdown>
              </MenuItem>
            </Menu>
          </Content>
        </Container>
      </Wrap>
    );
  }
}

Bar.propTypes = {
  handleLogout: PropTypes.func.isRequired,
  handleShare: PropTypes.func.isRequired,
  handleSettings: PropTypes.func.isRequired,
};

export default Bar;