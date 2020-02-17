import React from 'react';
import './App.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Scheduling from './Scheduling';
import ChooseCPU from './ChooseCPU';

class CPU extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            quantum: 0
        }

        this.setQuantum = this.setQuantum.bind(this);
    }

    setStatePromise(that, newState) {
        return new Promise((resolve) => {
            that.setState(newState, () => {
                resolve();
            });
        });
    }

    async setQuantum(quantum){
        await this.setStatePromise(this,{
            quantum: quantum
        });
        this.props.setQuantumApp(quantum);
    }

    render(){
        return(
            <Row className="d-flex justify-content-between">
                <Col sm={2}>
                    <h2>CPU</h2>
                </Col>
                <Col sm={7}>
                    <Scheduling 
                        running = {this.props.running} 
                        tiempoActual = {this.props.tiempoActual} 
                        quantum = {this.state.quantum}
                    />
                </Col>
                <Col sm={3}>
                    <ChooseCPU setQuantum = {this.setQuantum}/>
                </Col>  
            </Row>
        );
    }
}

export default CPU;