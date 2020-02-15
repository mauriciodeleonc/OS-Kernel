import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

class Control extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            tiempoActual: 0
        };

        this.incrementarTiempo = this.incrementarTiempo.bind(this);
    }

    incrementarTiempo(e){
        this.setState(state => ({
            tiempoActual: state.tiempoActual + 1
        }));
    }

    render(){
        return (
            <Row>
                <Col>
                    <p>Tiempo Actual</p>
                    <p>{this.state.tiempoActual}</p>
                    <Button variant="primary" onClick={this.incrementarTiempo}>Agregar tiempo</Button>
                </Col>
                <Col>
                    <p>Prueba</p>
                </Col>
            </Row>
        );
    }

}

export default Control;