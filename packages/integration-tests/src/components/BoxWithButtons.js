// @bojagi
import React from 'react';
import styled from 'styled-components';
import Box from './Box';
import Button from './Button';

export default function BoxWithButtons(props) {
  return (
    <Box color={props.color}>
      {props.buttons.map((b, i) => {
        return (
          <Button color={b.color} key={i}>
            {b.text}
          </Button>
        );
      })}
    </Box>
  );
}
