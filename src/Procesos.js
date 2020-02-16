import React from 'react';
import './App.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import New from './New';
import Ready from './Ready';
import Running from './Running';
import Blocked from './Blocked';
import Finished from './Finished';

class Procesos extends React.Component {
    render(){
        this.props.setRunning(this.props.running[0]);
        return(
            <Row>
                <Col>
                    <h2>Procesos</h2>
                </Col>
                <Col>
                    <New />
                </Col>
                <Col>
                    <Ready procesos = {this.props.ready}/>
                </Col>
                <Col>
                    <Running procesos = {this.props.running}/>
                </Col>
                <Col>
                    <Blocked procesos = {this.props.blocked}/>
                </Col>
                <Col>
                    <Finished procesos = {this.props.finished}/>
                </Col>
            </Row>
        );
    }
}

export default Procesos;