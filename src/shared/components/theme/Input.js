import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import moment from 'moment';
import { Icon, Button } from './index';
import { sizeBig, sizeNormal, sizeSmall, sizeTiny } from './style';
import Checkbox from './Checkbox';

export const InputStyled = styled.input`
  background-color: ${props => props.theme.colors.dark};
  border: 1px solid ${props => props.theme.colors.darker};
  color: ${props => props.theme.colors.white};
  border-radius: ${props => props.theme.size.radius};
  outline: none;
  box-sizing: border-box;
  line-height: 1.5em;
  margin-bottom: 10px;
  width: 100%;
  max-width: 100%;
  transition: .2s;
  &:disabled {
    background-color: ${props => props.theme.colors.darklesser};
    cursor: default;
  }
  &:hover:not(:disabled) {
    background-color: ${props => props.theme.colors.darkover};
  }
  ${sizeNormal}
  ${props => props.big && sizeBig}
  ${props => props.small && sizeSmall}
  ${props => props.tiny && sizeTiny}
`;

const InputTextarea = InputStyled.withComponent('textarea').extend`
  background-color: ${props => props.theme.colors.dark};
  resize: none;
  height: 130px;
  ${props => props.dynamic && !props.higher && css`
    height: 39px;
  `}
`;

const File = styled.input`
  opacity: 0;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  width: 100%;
  cursor: pointer;
`;

const Holo = InputStyled.withComponent('div').extend`
  height: 130px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  i {
    font-size: 40px;
    margin-bottom: 10px;
    color: ${props => props.theme.colors.grey};
  }
  ${props => props.active && css`
    background-color: ${props.theme.colors.electric};
    border: 1px solid ${props.theme.colors.info};
  `}
`;

const InputFile = ({ active, ...props }) => (
  <Holo active={ active }>
    <Icon name="upload" />
    <Button tiny flatten>Upload File</Button>
    <File { ...props } />
  </Holo>
);

InputFile.propTypes = {
  active: PropTypes.bool,
};

InputFile.defaultProps = {
  active: false,
};

const Input = ({ type, input: { value, ...input }, ...props }) => {
  if (type === 'date') {
    return (
      <InputStyled
        type={ type }
        value={ moment(value).format('YYYY-MM-DD') }
        { ...input }
        { ...props }
      />
    );
  }
  if (type === 'file') {
    return (
      <InputFile
        type={ type }
        active={ value && !!value.length }
        { ...input }
        { ...props }
      />
    );
  }
  if (type === 'checkbox') {
    return (
      <Checkbox
        type={ type }
        checked={ value }
        value={ value }
        { ...input }
        { ...props }
      />
    );
  }
  if (type === 'textarea') {
    return (
      <InputTextarea
        type={ type }
        value={ value }
        higher={ props.dynamic && value && (value.length >= 26 || value.indexOf('\n') >= 0) }
        { ...input }
        { ...props }
      />
    );
  }
  return (
    <InputStyled
      type={ type }
      value={ value }
      { ...input }
      { ...props }
    />
  );
};

Input.propTypes = {
  type: PropTypes.string,
  input: PropTypes.object,
  dynamic: PropTypes.bool,
};

Input.defaultProps = {
  type: 'text',
  input: {},
  dynamic: false,
};

export default Input;
