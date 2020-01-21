import React from 'react'
import styled from 'styled-components'
import Box from './components/Box'
import Button from './components/Button'
import BoxWithButtons from './components/BoxWithButtons'
import { yellow } from './components/Box.bojagi'

const Container = styled.div`
  margin: 2rem;
  padding: 2rem;
  border: 2px solid grey;
`
// This is the App component with a box inside
export default function(props) {
  return (
    <Container>
      <Box color="green">green><Button color="yellow">click</Button></Box>
      <Box color="yellow">yellow</Box>
      <BoxWithButtons color="white" buttons={[{text: 'stop', color: 'red'},{text: 'ready', color: 'yellow'}, {text: 'go', color: 'green'}]}/>
    </Container>
  )
}