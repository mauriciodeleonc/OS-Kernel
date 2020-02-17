import React from 'react';
import Card from 'react-bootstrap/Card';

class Scheduling extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            scheduling: [
                {
                    nombreProceso: '',
                    llegada: '',
                    cpuAsignado: '',
                    envejecimiento: '',
                    cpuRestante: '',
                    quantumRestante: ''
                }
            ]
        }
    }

    componentDidUpdate() {
        this.props.running.map(proceso => {
            if(proceso.nombreProceso !== this.state.scheduling.nombreProceso) {
                this.setState({ 
                    scheduling: {
                            nombreProceso: proceso.nombreProceso,
                            llegada: proceso.llegada,
                            cpuAsignado: 0,
                            envejecimiento: this.props.tiempoActual - proceso.llegada,
                            cpuRestante: proceso.tiempoEstimado,
                            quantumRestante: 5,
                    }
            })
        }})
        console.log(this.props)
    }

    render(){
        return(
            <Card style={{ width: '100%' }}>
                <Card.Header>Scheduling</Card.Header>
                <Card.Body>
                    <p>Nombre: {this.state.scheduling.nombreProceso}</p>
                    <p>Tpo Llegada: {this.state.scheduling.llegada}</p>
                    <p>CPU Asignado: {this.state.scheduling.cpuAsignado}</p>
                    <p>Envejecimiento: {this.state.scheduling.envejecimiento}</p>
                    <p>CPU Restante: {this.state.scheduling.cpuRestante}</p>
                    <p>Quantum Restante: {this.state.scheduling.quantumRestante}</p>
                </Card.Body>
            </Card>
        );
    }
}

export default Scheduling;