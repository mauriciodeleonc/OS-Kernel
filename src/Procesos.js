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
    constructor(props){
        super(props);
        this.state = {
            //Cada uno de estos es un arreglo de los procesos que contienen
            //No hay new porque ese se crea manualmente
            ready: [2,3,5],
            running: [1],
            blocked: [4],
            finished: []
        }
    }
    /*
        Pasar a cada uno de los estados la lista de procesos 
        que van en cada uno como props
    */

    //Despues de la ultima col se pasa a otro row y se pone el boton para cargar archivo
    /*
        Este componente se encarga de ese archivo para que con 
        eso se puedan cargar los arreglos del state
    */

    /*
        <Row>
                <Col>
                    <h2>Procesos</h2>
                </Col>
                <Col>
                    <New />
                </Col>
                <Col>
                    <Ready procesos = {this.state.ready}/>
                </Col>
                <Col>
                    <Running procesos = {this.state.running}/>
                </Col>
                <Col>
                    <Blocked procesos = {this.state.blocked}/>
                </Col>
                <Col>
                    <Finished procesos = {this.state.finished}/>
                </Col>
            </Row>
    */

    render(){
        return(
            <Row>
                <Col>
                    <h2>Procesos</h2>
                </Col>
                <Col>
                    <New />
                </Col>
                <Col>
                    <Ready />
                </Col>
                <Col>
                    <Running />
                </Col>
                <Col>
                    <Blocked />
                </Col>
                <Col>
                    <Finished />
                </Col>
            </Row>
        );
    }
}

export default Procesos;