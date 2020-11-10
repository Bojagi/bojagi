import React from 'react';
import styled from 'styled-components';
// eslint-disable-next-line import/no-cycle
import Ping from './Ping';

export default function Pong(props) {
  if (props.ping) {
    return <Ping>Pong</Ping>;
  }
  return <div>{props.children}Pong</div>;
}
