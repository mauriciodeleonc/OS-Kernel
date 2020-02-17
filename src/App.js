import React from 'react';
import './App.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Procesos from './Procesos';
import CPU from './CPU';
import Memoria from './Memoria';
import Button from 'react-bootstrap/Button';

let fileReader;

class App extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      tiempoActual: 0,
      quantum: 0,
      //Cada uno de estos es un arreglo de los procesos que contienen
      //No hay new porque ese se crea manualmente
      ready: [],
      running: [],
      blocked: [],
      finished: []
  }
    this.incrementarTiempo = this.incrementarTiempo.bind(this);

    this.llenarProcesos = this.llenarProcesos.bind(this);

    this.setQuantumApp = this.setQuantumApp.bind(this);

    //Bind de funciones para leer archivo
    this.handleFileChosen = this.handleFileChosen.bind(this);
    this.handleFileRead = this.handleFileRead.bind(this);
  }

  setStatePromise(that, newState) {
    return new Promise((resolve) => {
        that.setState(newState, () => {
            resolve();
        });
    });
  }

  async setQuantumApp(quantum){
    await this.setStatePromise(this, {
        quantum: quantum
    });
    alert("quantum changed on App.js: " + this.state.quantum);
  }

  async incrementarTiempo(e){
    await this.setStatePromise(this, state => ({
        tiempoActual: state.tiempoActual + 1
    }));
  }

  async llenarProcesos(archivo){
    let contadorArchivo = 3;
    let maxPaginas = archivo[0];
    let tiempoActual = archivo[1];
    await this.setStatePromise(this,{
      tiempoActual: parseInt(tiempoActual,10)
    });
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
            this.setState(state => ({ 
                running: [...this.state.running,
                    {
                        nombreProceso: nombreProceso,
                        llegada: llegada,
                        tiempoEstimado: tiempoEstimado,
                        estado: estado,
                        paginas: paginas,
                        cpuAsignado: 0,
                        envejecimiento: '',
                        cpuRestante: tiempoEstimado,
                        quantum: state.quantum,
                        quantumRestante: state.quantum
                    }
                ]
            }));
    
        }
        if(estado == 2){
            this.setState(state => ({
                blocked: [...this.state.blocked,
                    {
                        nombreProceso: nombreProceso,
                        llegada: llegada,
                        tiempoEstimado: tiempoEstimado,
                        estado: estado,
                        paginas: paginas,
                        cpuAsignado: 0,
                        envejecimiento: '',
                        cpuRestante: tiempoEstimado,
                        quantum: state.quantum,
                        quantumRestante: state.quantum
                    }
                ]
            }));
        }
        if(estado == 3){
            this.setState(state => ({ 
                ready: [...this.state.ready,
                    {
                        nombreProceso: nombreProceso,
                        llegada: llegada,
                        tiempoEstimado: tiempoEstimado,
                        estado: estado,
                        paginas: paginas,
                        cpuAsignado: 0,
                        envejecimiento: '',
                        cpuRestante: tiempoEstimado,
                        quantum: state.quantum,
                        quantumRestante: state.quantum
                    }

                ]
            }));
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

  render(){
    return (
      <Container fluid>
        <Row className="control">
          <Col>
          <Row>
                <Col>
                    <p>Tiempo Actual: {this.state.tiempoActual}</p>
                    <Button variant="primary" onClick={this.incrementarTiempo}>Ejecutar Instrucción</Button>
                </Col>
                <Col>
                    <p>Prueba</p>
                </Col>
            </Row>
          </Col>
        </Row>
        <Row className="procesos">
          <Col>
            <Procesos 
              ready = {this.state.ready}
              running = {this.state.running}
              blocked = {this.state.blocked}
              finished = {this.state.finished}
            />
          </Col>
        </Row>
        <Row className="cpu">
          <Col>
            <CPU 
              running = {this.state.running} 
              tiempoActual = {this.state.tiempoActual}
              setQuantumApp = {this.setQuantumApp}
            />
          </Col>
        </Row>
        {/*
        <Row>
          <Col>
            <Memoria />
          </Col>
        </Row>
        */}
        <Row>
          <Col>
            <p>Cargar procesos desde archivo</p>
            <input 
                type = 'file'
                id = 'file'
                accept = '.txt'
                onChange = {e => this.handleFileChosen(e.target.files[0])}
            />
          </Col>
        </Row>
      </Container>
    );
  }
}

export default App;
