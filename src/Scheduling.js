import React from 'react';
import Card from 'react-bootstrap/Card';

class Scheduling extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            nombre: this.props.nombreProceso,
            llegada: this.props.llegada,
            cpuAsignado: 0,
            envejecimiento: 0 - this.props.llegada - this.props.cpuAsignado,
            cpuRestante: this.props.tiempoEstimado,
            quantumRestante: ''
        }
    }
    render(){
        return(
            <Card style={{ width: '100%' }}>
                <Card.Header>Scheduling</Card.Header>
                <Card.Body>
                    <p>Nombre: {this.state.nombre}</p>
                    <p>Tpo Llegada: {this.state.nombre}</p>
                    <p>CPU Asignado: {this.state.nombre}</p>
                    <p>Envejecimiento: {this.state.nombre}</p>
                    <p>CPU Restante: {this.state.nombre}</p>
                    <p>Quantum Restante: {this.state.nombre}</p>
                </Card.Body>
            </Card>
        );
    }
}

export default Scheduling;