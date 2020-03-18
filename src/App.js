import React from 'react';
import './App.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Procesos from './Procesos';
import CPU from './CPU';
import Memoria from './Memoria';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

let fileReader;

class App extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      tiempoActual: 0,
      contadorBlocked: 0,
      numeroProcesos: '',
      quantum: 0,
      //Cada uno de estos es un arreglo de los procesos que contienen
      //No hay new porque ese se crea manualmente
      ready: [],
      running: {},
      blocked: [],
      finished: [],
      algoritmoCPU: "fifo",
      algoritmoMemoria: "fifo",
      pagina: '0',
      interrupciones: [
        "SVC de solicitud de I/O",
        "SVC de terminación normal", 
        "SVC de solitud de fecha",
        "Error de programa",
        "Externa de quantum expirado",
        "Dispositivo de I/O"
      ],
      interrupcion: undefined
  }
    this.handleSelectPagina = this.handleSelectPagina.bind(this);
    this.incrementarTiempo = this.incrementarTiempo.bind(this);
    this.setReadyProcess = this.setReadyProcess.bind(this);
    this.llenarProcesos = this.llenarProcesos.bind(this);

    this.setQuantumApp = this.setQuantumApp.bind(this);

    //Bind de funciones para leer archivo
    this.handleFileChosen = this.handleFileChosen.bind(this);
    this.handleFileRead = this.handleFileRead.bind(this);
    this.selectAlgoritmoCPU = this.selectAlgoritmoCPU.bind(this);
    this.selectInterrupcion = this.selectInterrupcion.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if(this.state.running === undefined && this.state.ready.length > 0) {
      let ready = [...this.state.ready];
      let running = ready.shift();
      this.setState({ running, ready });
    }
    else if(this.state.running === undefined) {
      this.setState({ running: {} });
    }
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
  }

  async incrementarTiempo(e){
    if(this.state.interrupcion) {
      let running = this.state.running;
      switch(this.state.interrupcion) {
        case "SVC de terminación normal":
          if(this.state.running === undefined || this.state.ready.length === 0) {
            alert("No se puede ejecutar la interrupción");
          } else {
            await this.setStatePromise(this, state => ({
              running: state.ready.shift(),
              finished: [...state.finished, running],
              tiempoActual: state.tiempoActual + 1
            }));
          }
          break;
        case "Externa de quantum expirado":
          if(this.state.running === undefined || this.state.ready.length === 0) {
            alert("No se puede ejecutar la interrupción");
          } else {
            await this.setStatePromise(this, state => ({
              running: state.ready.shift(),
              ready: [...state.ready, running],
              tiempoActual: state.tiempoActual + 1
            }));
          }
          break;
        case "Dispositivo de I/O":
          if(this.state.blocked === undefined || this.state.blocked.length === 0) {
            alert("No se puede ejecutar la interrupción");
          } else {
            let blocked = this.state.blocked.shift();
            await this.setStatePromise(this, state => ({
              running: state.ready.shift(),
              ready: [...state.ready, running, blocked],
              tiempoActual: state.tiempoActual + 1
            }));
          }
          break;
        case "SVC de solicitud de I/O":
          if(this.state.running === undefined || this.state.ready.length === 0) {
            alert("No se puede ejecutar la interrupción");
          } else {
            await this.setStatePromise(this, state => ({
              running: state.ready.shift(),
              blocked: [...state.blocked, running],
              tiempoActual: state.tiempoActual + 1
            }));
          }
          break;
        case "SVC de solitud de fecha":
          if(this.state.running === undefined || this.state.ready.length === 0) {
            alert("No se puede ejecutar la interrupción");
          } else {
            await this.setStatePromise(this, state => ({
              running: state.ready.shift(),
              blocked: [...state.blocked, running],
              tiempoActual: state.tiempoActual + 1
            }));
          }
          break;
        case "Error de programa":
          if(this.state.running === undefined || this.state.ready.length === 0) {
            alert("No se puede ejecutar la interrupción");
          } else {
            await this.setStatePromise(this, state => ({
              running: state.ready.shift(),
              finished: [...state.finished, running],
              tiempoActual: state.tiempoActual + 1
            }));
          }
          break;
        default:
            break;
      }
      await this.setStatePromise(this, state => ({ interrupcion: undefined }));
    } else if(this.state.running.cpuRestante === 0) {
      let running = this.state.running;
      await this.setStatePromise(this, state => ({
        running: state.ready.shift(),
        finished: [...state.finished, running]
      }));
    } else if(this.state.running.quantumRestante === 0 && this.state.algoritmoCPU === "rr"){
      await this.setStatePromise(this, state => ({
        running: {...state.running, 
          quantumRestante: state.running.quantum, 
        }
      }));
      let running = this.state.running;
      await this.setStatePromise(this, state => ({
        running: state.ready.shift(),
        ready: [...state.ready, running],
      }));
    } else {
      await this.setStatePromise(this, state => ({
        tiempoActual: state.tiempoActual + 1,
        contadorBlocked: state.contadorBlocked + 1,
        running: {...state.running, 
          quantumRestante: state.algoritmoCPU === "rr" ? state.running.quantumRestante - 1 : state.running.quantumRestante,
          envejecimiento: state.tiempoActual - state.running.llegada - state.running.cpuAsignado,
          cpuAsignado: state.running.cpuAsignado + 1,
          cpuRestante: state.running.cpuRestante - 1
        },
        ready: this.envejecerProcesos(state.ready),
        
    }));
      if(this.state.contadorBlocked % 5 == 0) {
        let value = "Dispositivo de I/O"
        await this.setStatePromise(this, state => ({ interrupcion: value }));
        this.incrementarTiempo();
      }
    }
  }

  envejecerProcesos(procesos) { 
    return procesos.map(proceso => ({...proceso, envejecimiento: proceso.envejecimiento + 1
    }))
  }

  selectAlgoritmoCPU(algoritmoCPU) {
    let ready = [...this.state.ready];
    switch(algoritmoCPU) {
      case "fifo":
        ready = this.ordenarFIFO(ready);
        break;
      case "rr":
        ready = this.ordenarFIFO(ready);
        break;
      case "srt":
        ready = this.ordenarSRT(ready);
        break;
      case "hrrn":
        ready = this.ordenarHRRN(ready);
        break;
      default:
        break;
    }
    this.setState({ algoritmoCPU, ready });
  }

  async selectInterrupcion() {
    let value = this.refs.interrupcion.value;
    await this.setStatePromise(this, state => ({ interrupcion: value }));
    this.incrementarTiempo();
  }

  ordenarFIFO(procesos) {
    procesos.sort((a, b) => (a.llegada > b.llegada ) ? 1: -1);
    return procesos;
  }

  ordenarSRT(procesos){
    procesos.sort((a,b) => (a.cpuRestante > b.cpuRestante) ? 1: -1);
    return procesos;
  }

  ordenarHRRN(procesos){
    procesos.sort((a,b) => (this.prioridad(a) > this.prioridad(b)) ? 1 : -1);
    return procesos;
  }

  prioridad(proceso){
    return (proceso.envejecimiento + proceso.cpuRestante)/proceso.cpuRestante;
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
                running:
                    {
                        nombreProceso: nombreProceso,
                        llegada: llegada,
                        tiempoEstimado: tiempoEstimado,
                        estado: estado,
                        paginas: paginas,
                        cpuAsignado: 0,
                        envejecimiento: tiempoActual - llegada,
                        cpuRestante: tiempoEstimado,
                        quantum: state.quantum,
                        quantumRestante: state.quantum
                    }
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
                        envejecimiento: tiempoActual - llegada,
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
                        envejecimiento: tiempoActual - llegada,
                        cpuRestante: tiempoEstimado,
                        quantum: state.quantum,
                        quantumRestante: state.quantum
                    }
                ]
            }));
        } 
    }
    this.setState(state => ({
      numeroProcesos: archivo[2]
    }))

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

  setReadyProcess(nombreProceso, llegada, tiempoEstimado, estado, paginas) {
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

  handleSelectPagina() {
    let pagina = this.refs.select.value;
    this.props.handleSelectPagina(pagina);
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
                  <Form>
                    <Form.Group controlId="exampleForm.ControlSelect1">
                        <Form.Label>Ejecutar página</Form.Label>
                        <Form.Control as="select" ref="select" onChange={this.handleSelectPagina}>
                          {this.state.running !== undefined && this.state.running.paginas !== undefined && this.state.running.paginas.map((pagina,i) => <option key={i}>{i}</option>)}
                        </Form.Control>
                    </Form.Group>
                  </Form>
                </Col>
                <Col>
                    <p>Interrupción</p>
                    <Form.Control as="select" ref="interrupcion" onChange={this.selectInterrupcion}>
                      {this.state.interrupciones.map(interrupcion => <option key={interrupcion}>{interrupcion}</option>)}
                    </Form.Control>
                </Col>
            </Row>
          </Col>
        </Row>
        <Row className="procesos">
          <Col>
            <Procesos 
              incrementarTiempo = {this.incrementarTiempo}
              ready = {this.state.ready}
              running = {this.state.running}
              blocked = {this.state.blocked}
              finished = {this.state.finished}
              numeroProcesos = {this.state.numeroProcesos}
              tiempoActual = {this.state.tiempoActual}
              setReadyProcess = {this.setReadyProcess}
            />
          </Col>
        </Row>
        <Row className="cpu">
          <Col>
            <CPU 
              selectAlgoritmoCPU={this.selectAlgoritmoCPU}
              running = {this.state.running} 
              tiempoActual = {this.state.tiempoActual}
              setQuantumApp = {this.setQuantumApp}
            />
          </Col>
        </Row>
        <Row className="memoria">
          <Col>
            <Memoria running = {this.state.running} />
          </Col>
        </Row>
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
