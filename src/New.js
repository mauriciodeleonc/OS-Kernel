import React from 'react';
import './App.css';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';


class New extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            nombreProceso: '',
            pagina: '',
            ejecTotal: '',
            estado: '3',

        }
        this.handleName = this.handleName.bind(this);
        this.handlePags = this.handlePags.bind(this);
        this.handleExecution = this.handleExecution.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }

    handleName(event) {
        this.setState({nombreProceso: event.target.value});
    }

    handlePags(event) {
        this.setState({pagina: event.target.value});
    }
    
    handleExecution(event) {
        this.setState({ejecTotal: event.target.value});
    }

    handleSubmit(event) {
        event.preventDefault();
        this.props.setReadyProcess(this.state.nombreProceso, this.props.tiempoActual, this.state.ejecTotal, this.state.estado, [[0,0,0,3,3,3],[0,0,0,3,3,3]])
        this.props.incrementarTiempo()
    }



    render(){
        return(
            <Card style={{ width: '100%' }}>
                <Card.Header>New</Card.Header>
                <Card.Body>
                    <Form onSubmit={this.handleSubmit}>
                        <Form.Group as={Row} controlId="formHorizontalEmail">
                            <Form.Label column sm={6}>
                                Nombre         
                            </Form.Label>
                            <Col sm={5}>
                            <Form.Control type="text" value={this.state.nombreProceso} onChange={this.handleName}/>
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} controlId="formHorizontalPassword">
                            <Form.Label column sm={6}>
                                Páginas
                            </Form.Label>
                            <Col sm={5}>
                            <Form.Control type="text" value={this.state.pagina}  onChange={this.handlePags} />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} controlId="formHorizontalEmail">
                            <Form.Label column sm={6}>
                                Ejec. Total
                            </Form.Label>
                            <Col sm={5}>
                            <Form.Control type="text" value={this.state.ejecTotal}  onChange={this.handleExecution} />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row}>
                            <Col>
                            <Button type="submit" style={{width: '100%'}} onClick ={() => this.handleSubmit}>Agregar proceso</Button>
                            </Col>
                        </Form.Group>
                    </Form>
                </Card.Body>
            </Card>
        );
    }
}

export default New;