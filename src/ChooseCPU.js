import React from 'react';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

class ChooseCPU extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            value: 0
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    handleSelect() {
        let value = this.refs.select.value;
        this.props.handleSelect(value);
    }
    
    render(){
        return(
            <Card style={{ width: '100%' }}>
                <Card.Header>CPU</Card.Header>
                <Card.Body>
                    <Form>
                    <Form.Group controlId="exampleForm.ControlSelect1">
                        <Form.Label>Algoritmo</Form.Label>
                        <Form.Control as="select" ref="select" onChange={this.handleSelect}>
                            <option value="fifo">FIFO</option>
                            <option value="rr">Round Robin</option>
                            <option value="srt">SRT (apropiativo)</option>
                            <option value="hrrn">HRRN (apropiativo)</option>
                        </Form.Control>
                    </Form.Group>
                    </Form>
                    <p>Tam Quantum:</p>
                    <input type="number" value={this.state.value} onChange={this.handleChange} />
                    <Button onClick = {() => this.props.setQuantum(this.state.value)} >Asignar Quantum</Button>
                </Card.Body>
            </Card>
        );
    }
}

export default ChooseCPU;