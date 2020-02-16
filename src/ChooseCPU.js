import React from 'react';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';

class ChooseCPU extends React.Component {
    
    render(){
        return(
            <Card style={{ width: '100%' }}>
                <Card.Header>CPU</Card.Header>
                <Card.Body>
                    <Form>
                    <Form.Group controlId="exampleForm.ControlSelect1">
                        <Form.Label>Algoritmo</Form.Label>
                        <Form.Control as="select">
                            <option>FIFO</option>
                            <option>Round Robin</option>
                            <option>SRT (apropiativo)</option>
                            <option>HRRN (apropiativo)</option>
                        </Form.Control>
                    </Form.Group>
                    </Form>
                    <p>Tam Quantum:</p>
                    <input></input>
                </Card.Body>
            </Card>
        );
    }
}

export default ChooseCPU;