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
      //Cada uno de estos es un arreglo de los procesos que contienen
      //No hay new porque ese se crea manualmente
      ready: [],
      running: [],
      blocked: [],
      finished: []
  }

    this.setRunning = this.setRunning.bind(this);

    this.incrementarTiempo = this.incrementarTiempo.bind(this);

    this.llenarProcesos = this.llenarProcesos.bind(this);

    //Bind de funciones para leer archivo
    this.handleFileChosen = this.handleFileChosen.bind(this);
    this.handleFileRead = this.handleFileRead.bind(this);
  }

  setRunning(proceso){
    this.setState({
      running: [proceso]
    })
  }

  incrementarTiempo(e){
    this.setState(state => ({
        tiempoActual: state.tiempoActual + 1
    }));
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

  render(){
    return (
      <Container fluid>
        <Row className="control">
          <Col>
          <Row>
                <Col>
                    <p>Tiempo Actual: {this.state.tiempoActual}</p>
                    <Button variant="primary" onClick={this.incrementarTiempo}>Agregar tiempo</Button>
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
              setRunning = {this.setRunning}
              ready = {this.state.ready}
              running = {this.state.running}
              blocked = {this.state.blocked}
              finished = {this.state.finished}
              />
          </Col>
        </Row>
        <Row className="cpu">
          <Col>
            <CPU running = {this.state.running[0]} />
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
