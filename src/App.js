import React from 'react';
import './App.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Control from './Control';
import Procesos from './Procesos';
import CPU from './CPU';
import Memoria from './Memoria';

function App() {
  return (
    <Container>
      <Row>
        <Col>
          <Control />
        </Col>
      </Row>
      <Row>
        <Col>
          <Procesos />
        </Col>
      </Row>
      {/*
      <Row>
        <Col>
          <CPU />
        </Col>
      </Row>
      <Row>
        <Col>
          <Memoria />
        </Col>
      </Row>
      */}
    </Container>
  );
}

export default App;
