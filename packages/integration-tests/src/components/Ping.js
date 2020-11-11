import React from 'react';
import styled from 'styled-components';
// eslint-disable-next-line import/no-cycle
import Pong from './Pong';

export default function Ping(props) {
  if (props.pong) {
    return <Pong>Ping</Pong>;
  }
  return <div>{props.children}Ping</div>;
}
