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
        return(
            <Row>
                <Col>
                    <h2>Procesos</h2>
                </Col>
                <Col>
                    <New numeroProcesos = {this.props.numeroProcesos}
                    incrementarTiempo = {this.props.incrementarTiempo}
                    procesos = {this.props.ready}
                    tiempoActual = {this.props.tiempoActual}
                    setReadyProcess = {this.props.setReadyProcess}
                    />
                </Col>
                <Col>
                    <Ready procesos = {this.props.ready}/>
                </Col>
                <Col>
                    <Running proceso = {this.props.running}/>
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