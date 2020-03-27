import React from 'react';
import Card from 'react-bootstrap/Card';

class Scheduling extends React.Component {

    render(){
        return(
            <Card style={{ width: '100%' }}>
                <Card.Header>Scheduling</Card.Header>
                <Card.Body>
                    {this.props.running ? <>
                        <p>Nombre: {this.props.running.nombreProceso}</p>
                        <p>Tpo Llegada: {this.props.running.llegada}</p>
                        <p>CPU Asignado: {this.props.running.cpuAsignado}</p>
                        <p>Envejecimiento: {this.props.tiempoActual - this.props.running.llegada - this.props.running.cpuAsignado} </p>
                        <p>CPU Restante: {this.props.running.cpuRestante}</p>
                        <p>Quantum Restante: {this.props.running.quantumRestante}</p>
                        </>
                        : ''
                    }
                </Card.Body>
            </Card>
        );
    }
}

export default Scheduling;