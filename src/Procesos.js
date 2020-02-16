import React from 'react';
import './App.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import New from './New';
import Ready from './Ready';
import Running from './Running';
import Blocked from './Blocked';
import Finished from './Finished';

let fileReader;

class Procesos extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            //Cada uno de estos es un arreglo de los procesos que contienen
            //No hay new porque ese se crea manualmente
            ready: [],
            running: [],
            blocked: [],
            finished: []
        }

        this.llenarProcesos = this.llenarProcesos.bind(this);

        //Bind de funciones para leer archivo
        this.handleFileChosen = this.handleFileChosen.bind(this);
        this.handleFileRead = this.handleFileRead.bind(this);
    }

    llenarProcesos(archivo){
        let contadorArchivo = 3;
        let maxPaginas = archivo[0];
        let tiempoActual = archivo[1];
        let numeroProcesos = archivo[2];
        for(let i = 0; i < numeroProcesos; i++){
            let nombreProceso = i + 1;
            let llegada = archivo[contadorArchivo++];
            let tiempoEstimado = archivo[contadorArchivo++];
            let estado = archivo[contadorArchivo++];
            let numeroPaginas = archivo[contadorArchivo++];
            let paginas = new Array(numeroPaginas);
            for(let j = 0; j < numeroPaginas; j++){
                paginas[j] = new Array(6);
                for(let k = 0; k < 6; k++){
                    paginas[j][k] = archivo[contadorArchivo++];
                }
                
            }

            if(estado == 1){
                this.setState({
                    running: [...this.state.running, 
                        {
                            nombreProceso: nombreProceso,
                            llegada: llegada,
                            tiempoEstimado: tiempoEstimado,
                            estado: estado,
                            paginas: paginas
                        }
                    ]
                });
        
            }
            if(estado == 2){
                this.setState({
                    blocked: [...this.state.blocked,
                        {
                            nombreProceso: nombreProceso,
                            llegada: llegada,
                            tiempoEstimado: tiempoEstimado,
                            estado: estado,
                            paginas: paginas
                        }
                    ]
                });
            }
            if(estado == 3){
                this.setState({
                    ready: [...this.state.ready,
                        {
                            nombreProceso: nombreProceso,
                            llegada: llegada,
                            tiempoEstimado: tiempoEstimado,
                            estado: estado,
                            paginas: paginas
                        }
                    ]
                });
            } 
        }
        
        console.log(this.state.running);
        console.log(this.state.blocked);
        console.log(this.state.ready);

    }

    //Funciones para leer archivos
    handleFileRead(){
        let archivo = fileReader.result;
        archivo = archivo.replace(/\n/g, ",").split(",");
        for(let i = 0; i < archivo.length; i++) {
            archivo[i] = archivo[i].replace(" ", "");
        }
        this.llenarProcesos(archivo);
    }

    handleFileChosen(file){
        fileReader = new FileReader();
        fileReader.onloadend = this.handleFileRead;
        fileReader.readAsText(file);
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
                    <br></br>
                    <p>Cargar procesos desde archivo</p>
                    <input 
                        type = 'file'
                        id = 'file'
                        accept = '.txt'
                        onChange = {e => this.handleFileChosen(e.target.files[0])}
                    />
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
        );
    }
}

export default Procesos;