import React from 'react';
import './App.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Scheduling from './Scheduling';
import ChooseCPU from './ChooseCPU';

class CPU extends React.Component{
    render(){
        return(
            <Row className="d-flex justify-content-between">
                <Col sm={2}>
                    <h2>CPU</h2>
                </Col>
                <Col sm={7}>
                    <Scheduling running = {this.props.running}/>
                </Col>
                <Col sm={3}>
                    <ChooseCPU />
                </Col>  
            </Row>
        );
    }
}

export default CPU;