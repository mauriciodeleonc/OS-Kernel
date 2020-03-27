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
      pagina: '',
      interrupciones: [
        "Escoge una interrupción",
        "SVC de solicitud de I/O",
        "SVC de terminación normal", 
        "SVC de solitud de fecha",
        "Error de programa",
        "Externa de quantum expirado",
        "Dispositivo de I/O"
      ],
      interrupcion: undefined,
      maxPaginasActivas: 0
  }

    //Bind de funciones de Memoria
    this.selectAlgoritmoMemoria = this.selectAlgoritmoMemoria.bind(this);
    this.handleSelectPagina = this.handleSelectPagina.bind(this);
    this.ejecutarPagina = this.ejecutarPagina.bind(this);

    this.setClearNURapp = this.setClearNURapp.bind(this);

    this.incrementarTiempo = this.incrementarTiempo.bind(this);
    this.setReadyProcess = this.setReadyProcess.bind(this);
    this.llenarProcesos = this.llenarProcesos.bind(this);

    this.setQuantumApp = this.setQuantumApp.bind(this);

    //Bind de funciones para leer archivo
    this.handleFileChosen = this.handleFileChosen.bind(this);
    this.handleFileRead = this.handleFileRead.bind(this);

    //Bind de funciones de CPU
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
            alert("No se puede ejecutar la interrupción 'SVC de terminación normal'");
          } else {
            await this.setStatePromise(this, state => ({
              running: state.ready.shift(),
              finished: [...state.finished, running],
              tiempoActual: state.tiempoActual + 1
            }));
            this.selectAlgoritmoCPU(this.state.algoritmoCPU);
          }
          
          break;
        case "Externa de quantum expirado":
          if(this.state.running === undefined || this.state.ready.length === 0) {
            alert("No se puede ejecutar la interrupción 'Externa de quantum expirado'");
          } else {
            await this.setStatePromise(this, state => ({
              running: state.ready.shift(),
              ready: [...state.ready, running],
              tiempoActual: state.tiempoActual + 1
            }));
            this.selectAlgoritmoCPU(this.state.algoritmoCPU);
          }
          break;
        case "Dispositivo de I/O":
          if(this.state.blocked === undefined || this.state.blocked.length === 0) {
            alert("No se puede ejecutar la interrupción 'Dispositivo de I/O'");
          } else {
            let blocked = this.state.blocked.shift();
            await this.setStatePromise(this, state => ({
              running: state.ready.shift(),
              ready: [...state.ready, running, blocked],
              tiempoActual: state.tiempoActual + 1,
            }));
            this.selectAlgoritmoCPU(this.state.algoritmoCPU); 
          }
          break;
        case "SVC de solicitud de I/O":
          
          if(this.state.running === undefined || this.state.ready.length === 0) {
            alert("No se puede ejecutar la interrupción 'SVC de solicitud de I/O'");
          } else {
            console.log('hola')
            console.log(JSON.stringify(this.state.ready));
            console.log(" ");
            await this.setStatePromise(this, state => ({
              tiempoActual: state.tiempoActual + 1,
              running: state.ready.shift(),
              blocked: [...state.blocked, running],
              //ready: this.envejecerProcesos(state.ready)
            }));
            console.log(this.state.ready);
            this.selectAlgoritmoCPU(this.state.algoritmoCPU);
          }
          break;
        case "SVC de solitud de fecha":
          if(this.state.running === undefined || this.state.ready.length === 0) {
            alert("No se puede ejecutar la interrupción 'SVC de solitud de fecha'");
          } else {
            await this.setStatePromise(this, state => ({
              running: state.ready.shift(),
              blocked: [...state.blocked, running],
              tiempoActual: state.tiempoActual + 1
            }));
            this.selectAlgoritmoCPU(this.state.algoritmoCPU);
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
            this.selectAlgoritmoCPU(this.state.algoritmoCPU);
          }
          break;
        case "Escoge una interrupción":
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
      //console.log(this.state.tiempoActual)
      //console.log(this.state.running.llegada)
      await this.setStatePromise(this, state => ({
        tiempoActual: state.tiempoActual + 1,
        contadorBlocked: state.contadorBlocked + 1,
        running: {...state.running, 
          quantumRestante: state.algoritmoCPU === "rr" ? state.running.quantumRestante - 1 : state.running.quantumRestante,
          cpuAsignado: state.running.cpuAsignado + 1,
          cpuRestante: state.running.cpuRestante - 1,
          envejecimiento: state.tiempoActual - state.running.llegada - state.running.cpuAsignado,
        },
        ready: this.envejecerProcesos(state.ready)
        
        
    }));
      if(this.state.contadorBlocked % 5 == 0) {
        let value = "Dispositivo de I/O"
        await this.setStatePromise(this, state => ({ interrupcion: value }));
        this.incrementarTiempo();
        this.selectAlgoritmoCPU(this.state.algoritmoCPU);
      }
    }
  }

  envejecerProcesos(procesos) { 
    return procesos.map(proceso => ({...proceso, envejecimiento: proceso.envejecimiento + 1
    }))
  }

  async selectAlgoritmoCPU(algoritmoCPU) {
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
    await this.setStatePromise(this, state => ({ algoritmoCPU, ready }));
  }

  async selectInterrupcion() {
    let value = this.refs.interrupcion.value;
    await this.setStatePromise(this, state => ({ interrupcion: value }));
    this.incrementarTiempo();
  }

  ordenarFIFO(procesos) {
    procesos.sort((a, b) => (a.llegada > b.llegada) ? 1 : -1);
    return procesos;
  }

  ordenarSRT(procesos){
    procesos.sort((a,b) => (a.cpuRestante > b.cpuRestante) ? 1 : -1);
    return procesos;
  }

  ordenarHRRN(procesos){
    procesos.sort((a,b) => (this.prioridad(a) < this.prioridad(b)) ? 1 : -1);
    return procesos;
  }

  prioridad(proceso){
    return (proceso.envejecimiento + proceso.tiempoEstimado) / proceso.tiempoEstimado;
  }

  async llenarProcesos(archivo){
    let contadorArchivo = 3;
    let maxPaginasActivas = archivo[0];
    let tiempoActual = archivo[1];
    await this.setStatePromise(this,{
      tiempoActual: parseInt(tiempoActual,10),
      maxPaginasActivas: maxPaginasActivas
    });
    let numeroProcesos = archivo[2];
    for(let i = 0; i < numeroProcesos; i++){
        let nombreProceso = i + 1;
        let llegada = archivo[contadorArchivo++];
        let tiempoEstimado = archivo[contadorArchivo++];
        let estado = archivo[contadorArchivo++];
        let numeroPaginas = archivo[contadorArchivo++];
        let paginas = new Array(numeroPaginas);
        let paginasActivas = 0;
        for(let j = 0; j < numeroPaginas; j++){
            paginas[j] = new Array(6);
            for(let k = 0; k < 6; k++){
                paginas[j][k] = archivo[contadorArchivo++];
            }
            if(paginas[j][0] === "1"){ 
              paginasActivas++;
            }
        }

        if(estado == 1){
            await this.setStatePromise(this, state => ({ 
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
                        quantumRestante: state.quantum,
                        paginasActivas: paginasActivas
                    }
            }));
        }
        if(estado == 2){
            await this.setStatePromise(this, state => ({
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
                        quantumRestante: state.quantum,
                        paginasActivas: paginasActivas
                    }
                ]
            }));
        }
        if(estado == 3){
            await this.setStatePromise(this, state => ({ 
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
                        quantumRestante: state.quantum,
                        paginasActivas: paginasActivas
                    }
                ]
            }));
        } 
    }
    await this.setStatePromise(this, state => ({
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

  async setReadyProcess(nombreProceso, llegada, tiempoEstimado, estado, paginas) {
    await this.setStatePromise(this, state => ({ 
      ready: [...this.state.ready,
          {
              nombreProceso: nombreProceso,
              llegada: llegada,
              tiempoEstimado: tiempoEstimado,
              estado: estado,
              paginas: paginas
          }

      ]
    }));
  }

  async setClearNURapp(flag) {
    let paginas = this.state.running.paginas;
    console.log(this.state.running.paginas)
    for(let i = 0; i < this.state.running.paginas.length; i++ ){
      paginas[i][4] = "0";
      paginas[i][5] = "0";
    }
    await this.setStatePromise(this, {
      paginas: paginas
    });
  }

  //Funcion que recibe el algoritmo con el que se va a estar trabajando en memoria
  async selectAlgoritmoMemoria(algoritmoMemoria) {
    await this.setStatePromise(this, state => ({ algoritmoMemoria }));
  }

  async ejecutarPagina() {
    console.log(this.state.running);
    console.log("");
    console.log(this.state.ready);
    let paginaPorEjecutar = this.state.pagina; //Llega el numero pagina que se quiere ejecutar
    //console.log(paginaPorEjecutar);
    let paginas = this.state.running.paginas; //Todas las páginas que tiene actualmente el proceso en running
    let paginaActual = this.state.running.paginas[paginaPorEjecutar]; //Solo la página que se quiere reemplazar de todas
    let bitResidencia = paginaActual[0]; //Bit de residencia de la pagina que se quiere reemplazar
    
    //la cantidad maxina de paginas ha sido alcanzada por lo tanto se debe realizar un reemplazo
    if(bitResidencia == 0 && this.state.maxPaginasActivas == this.state.running.paginasActivas){ //Se realizan los algoritmos de reemplazo
      /*
        Si el bit de residencia está en 0 entonces se realiza el reemplazo
        FIFO:
          Se "reemplaza" por el que tenga su bit de residencia en 1 y que su tiempo de llegada sea el menor
          Y se realiza un "solicitud de I/O" porque tuvo que ir a memoria secundaria por la info y cargarla en RAM

        NUR:
          Se reemplaza por el que tenga su bit de residencia en 1 y se va en el siguiente orden:
            00
            01
            10
            11
            (el primero que encuentre en ese orden)

        LRU:
          Se reemplaza por el que tenga su bit de residencia en 1 y que su ultimo acceso sea el menor
          Y se realiza un "solicitud de I/O" porque tuvo que ir a memoria secundaria por la info y cargarla en RAM

        LFU:
          Se reemplaza por el que tenga su bit de residencia en 1 y que su cantidad de accesos sea la menor
          Y se realiza un "solicitud de I/O" porque tuvo que ir a memoria secundaria por la info y cargarla en RAM
      */


      let value = "SVC de solicitud de I/O"
      await this.setStatePromise(this, state => ({ 
        interrupcion: value
        
      }));
      let arrLlegadas = [];
      let arrUltAcceso = [];
      let arrAccesos = [];
      let arrNUR = [];

      //console.log(paginas)
      for(let i = 0; i < paginas.length; i++){
        arrLlegadas[i] = parseInt(paginas[i][1]);
        arrUltAcceso[i] = paginas[i][2];
        arrAccesos[i] = paginas[i][3];
        arrNUR[i] = paginas[i][4].trim() + paginas[i][5].trim();
      }

      let algoritmoMemoria = this.state.algoritmoMemoria;
      switch(algoritmoMemoria){
        case "fifo":
          //console.log(arrLlegadas);
          //console.log(paginas)
          let menorLlegada = 5000;
          let indexMenorLlegada = 0;
          for(let i = 0; i < arrLlegadas.length; i++){
            //console.log(paginas[i][0]);
            //console.log(arrLlegadas[i]);
            //console.log(menorLlegada);
            if(paginas[i][0] == 1){
              if(menorLlegada > arrLlegadas[i] ){ 
                menorLlegada = arrLlegadas[i];
                indexMenorLlegada = i;
              }
            }
          }
          //console.log(paginas[indexMenorLlegada]);
          for(let i = 0; i < paginas[indexMenorLlegada].length; i++) {
            paginas[indexMenorLlegada][i] = '0';
          }
           //apago el que estoy reemplazando

          //console.log(this.state.running);
          paginaActual[0] = 1; //r
          paginaActual[1] = this.state.tiempoActual; //llegada
          paginaActual[2] = this.state.tiempoActual; //ult acceso
          paginaActual[3]++; //accesos
          if(paginaActual[4] == 0)
            paginaActual[4] = '1'; //NUR
          if(paginaActual[3] % 5 == 0)
            paginaActual[5] = '1';

          paginas[paginaPorEjecutar] = paginaActual;
          
          await this.setStatePromise(this, state => ({
            running: {
              ...state.running, 
              paginas: paginas, 
            },
            //tiempoActual: state.tiempoActual + 1 
          }));
          //console.log(this.state.running);
          this.incrementarTiempo();
          break;

        case "lru":
          let menorUltAcceso = arrUltAcceso[0];
          let indexMenorUltAcceso = 0;
          for(let i = 0; i < arrUltAcceso.length; i++){
            if(paginas[i][0] == 1){
              if(arrUltAcceso[i] < menorUltAcceso){ 
                menorUltAcceso = arrUltAcceso[i];
                indexMenorUltAcceso= i;
              }
            }
          }

          //console.log(this.state.running);
          for(let i = 0; i < paginas[indexMenorUltAcceso].length; i++) {
            paginas[indexMenorUltAcceso][i] = '0';
          }

          //console.log(this.state.running);
          paginaActual[0] = 1; //r
          paginaActual[1] = this.state.tiempoActual; //llegada
          paginaActual[2] = this.state.tiempoActual; //ult acceso
          paginaActual[3]++; //accesos
          if(paginaActual[4] == 0)
            paginaActual[4] = '1'; //NUR
          if(paginaActual[3] % 5 == 0)
            paginaActual[5] = '1';

          paginas[paginaPorEjecutar] = paginaActual;
          
          await this.setStatePromise(this, state => ({
            running: {
              ...state.running, 
              paginas: paginas, 
            },
            //tiempoActual: state.tiempoActual + 1 
          }));
          //console.log(this.state.running);
          this.incrementarTiempo();
          break;

        case "lfu":
          let menorAccesos = arrAccesos[0];
          let indexMenorAccesos = 0;
          for(let i = 0; i < arrAccesos.length; i++){
            if(paginas[i][0] == 1){
              if(arrAccesos[i] < menorAccesos){ 
                menorAccesos = arrAccesos[i];
                indexMenorAccesos = i;
              }
            }
          }
          for(let i = 0; i < paginas[indexMenorAccesos].length; i++) {
            paginas[indexMenorAccesos][i] = '0';
          }

          //console.log(this.state.running);
          paginaActual[0] = 1; //r
          paginaActual[1] = this.state.tiempoActual; //llegada
          paginaActual[2] = this.state.tiempoActual; //ult acceso
          paginaActual[3]++; //accesos
          if(paginaActual[4] == 0)
            paginaActual[4] = '1'; //NUR
          if(paginaActual[3] % 5 == 0)
            paginaActual[5] = '1';

          paginas[paginaPorEjecutar] = paginaActual;
          
          await this.setStatePromise(this, state => ({
            running: {
              ...state.running, 
              paginas: paginas, 
            },
            //tiempoActual: state.tiempoActual + 1 
          }));
          //console.log(this.state.running);
          this.incrementarTiempo();
          break;

        case "nur":
          //console.log(this.state.running);
          let indexNUR = -1;
          for(let i = 0; i < arrNUR.length; i++){
            if(paginas[i][0] == 0) {
              arrNUR[i] = '-1';
            }
          }
          if(arrNUR.includes("00")) {
            indexNUR = arrNUR.indexOf("00");
          } else if (arrNUR.includes("01")){
            indexNUR = arrNUR.indexOf("01");
          } else if (arrNUR.includes("10")){
            indexNUR = arrNUR.indexOf("10");
          } else if (arrNUR.includes("11")){
            indexNUR = arrNUR.indexOf("11");
          }
          
          for(let i = 0; i < paginas[indexNUR].length; i++) {
            paginas[indexNUR][i] = '0';
          }

          //console.log(this.state.running);
          paginaActual[0] = 1; //r
          paginaActual[1] = this.state.tiempoActual; //llegada
          paginaActual[2] = this.state.tiempoActual; //ult acceso
          paginaActual[3]++; //accesos
          if(paginaActual[4] == 0)
            paginaActual[4] = '1'; //NUR
          if(paginaActual[3] % 5 == 0)
            paginaActual[5] = '1';

          paginas[paginaPorEjecutar] = paginaActual;
          
          await this.setStatePromise(this, state => ({
            running: {
              ...state.running, 
              paginas: paginas, 
            },
          }));
          //console.log(this.state.running);
          this.incrementarTiempo();
          break;
        default:
          break;
      }
    } else if (bitResidencia == 0 && this.state.maxPaginasActivas > this.state.running.paginasActivas){ //No se requiere hacer reemplazo porque todavía hay espacio disponible
      /*
        Se "manda a traer" la página desde memoria secundaria a RAM, entonces después de hacer todos los cambios se ejecuta un "Solicitud de I/O"
        para llevarlo de Running a Blocked.
        r: se cambia a 1
        llegada: se cambia al tiempo actual
        ult acceso: se modifica por el tiempo actual y se le suma 1 al tiempo actual
        accesos: accesos + 1
        NUR: se transforma en 1x (x es el bit de modificación, ese nunca cambia a menos que se le haga reset)
          Si se le hace reset entonces todos los NURS de todas las páginas se vuelven 00
      */
      //console.log(this.state.running);
      paginaActual[0] = 1; //r
      paginaActual[1] = this.state.tiempoActual; //llegada
      paginaActual[2] = this.state.tiempoActual; //ult acceso
      paginaActual[3]++; //accesos
      if(paginaActual[4] == 0)
        paginaActual[4] = '1'; //NUR
      if(paginaActual[3] % 5 == 0)
        paginaActual[5] = '1';

      paginas[paginaPorEjecutar] = paginaActual;
      
      await this.setStatePromise(this, state => ({
        running: {
          ...state.running, 
          paginas: paginas, 
        },
      }));
      //console.log(this.state.running);
      this.incrementarTiempo();

    } else if(bitResidencia == 1){
      /*
      Si el bit de residencia está en 1 entonces se ignora el algoritmo de reemplazo,
      r: se mantiene igual
      llegada: se mantiene igual
      ult acceso: se modifica por el tiempo actual y se le suma 1 al tiempo actual
      accesos: accesos + 1
      NUR: se transforma en 1x (x es el bit de modificación, ese nunca cambia a menos que se le haga reset)
        Si se le hace reset entonces todos los NURS de todas las páginas se vuelven 00
      */
      //console.log(this.state.running);
      paginaActual[2] = this.state.tiempoActual; //ult acceso
      paginaActual[3]++; //accesos
      if(paginaActual[4] == 0)
        paginaActual[4] = '1'; //NUR
      if(paginaActual[3] % 5 == 0)
        paginaActual[5] = '1';

      paginas[paginaPorEjecutar] = paginaActual;
      
      await this.setStatePromise(this, state => ({
        running: {
          ...state.running, 
          paginas: paginas, 
        },
      }));
      this.incrementarTiempo();
    }
  }

  async handleSelectPagina() {
    await this.setStatePromise(this, state => ({ 
      pagina: this.refs.select.value  
    }));
  }

  render(){
    return (
      <Container fluid>
        <Row className="control">
          <Col>
            <Row className="d-flex justify-content-between">
              <Col md={2}>
                  <p>Tiempo Actual: {this.state.tiempoActual}</p>
                  <Button variant="primary" onClick={this.ejecutarPagina}>Ejecutar página {this.state.pagina}</Button>
              </Col>
              <Col md={4}>
                <p>Ejecutar página</p>
                <Form.Control as="select" ref="select" onChange={this.handleSelectPagina}>
                  
                  {this.state.running !== undefined && this.state.running.paginas !== undefined && this.state.running.paginas.map((pagina,i) => <option key={i}>{i}</option>)}
                </Form.Control>
              </Col>
              <Col md={5}>
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
            <Memoria 
              running = {this.state.running} 
              selectAlgoritmoMemoria = {this.selectAlgoritmoMemoria}
              setClearNURapp= {this.setClearNURapp}
            />
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
