import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';

const Wrap = styled.div`
  display: flex;
  padding: 0 0 10px;
  margin: 20px 0 0;
  min-height: 50px;
  ${props => !props.noline && css`
    border-bottom: 1px solid ${props.theme.colors.greyer};
  `}
  ${props => props.upline && css`
    margin-top: 10px;
    padding-top: 20px;
    border-top: 1px solid ${props.theme.colors.greyer};
  `}
  &:last-of-type {
    border-bottom: none;
  }
`;

const Description = styled.div`
  margin-right: 10px;
  margin-bottom: 10px;
  flex-grow: 1;
  flex-basis: 0;
  ${props => props.padding && css`
    padding-top: 10px;
  `}
`;

const Label = styled.label`
  font-size: 16px;
  color: ${props => props.theme.colors.off};
`;

const Help = styled.div`
  font-size: 12px;
  color: ${props => props.theme.colors.grey};
  margin-top: 2px;
`;

const Data = styled.div`
  width: 300px;
  max-width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
  flex-grow: 1;
  flex-basis: 0;
`;

const Control = ({ label, help, children, ...props }) => (
  <Wrap { ...props }>
    <Description padding={ !help }>
      <Label>{ label }</Label>
      { help && <Help>{ help }</Help> }
    </Description>
    { children && <Data>{ children }</Data> }
  </Wrap>
);

Control.propTypes = {
  label: PropTypes.string.isRequired,
  children: PropTypes.node,
  help: PropTypes.string,
};

Control.defaultProps = {
  help: null,
  children: null,
};

export default Control;
