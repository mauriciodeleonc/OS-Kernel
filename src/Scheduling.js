import React from 'react';
import Card from 'react-bootstrap/Card';

class Scheduling extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            nombre: '',
            llegada: '',
            cpuAsignado: '',
            envejecimiento: '',
            cpuRestante: '',
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