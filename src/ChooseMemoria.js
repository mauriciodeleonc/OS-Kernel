import React from 'react';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';

class ChooseMemoria extends React.Component {
    constructor(props){
        super(props);

        this.handleSelect = this.handleSelect.bind(this);
    }

    handleSelect() {
        let value = this.refs.select.value;
        this.props.handleSelect(value);
    }
    
    render(){
        return(
            <Card style={{ width: '100%' }}>
                <Card.Header>Memoria</Card.Header>
                <Card.Body>
                    <Form>
                    <Form.Group controlId="exampleForm.ControlSelect1">
                        <Form.Label>Algoritmo</Form.Label>
                        <Form.Control as="select" ref="select" onChange={this.handleSelect}>
                            <option value="fifo">FIFO</option>
                            <option value="lru">LRU</option>
                            <option value="lfu">LFU</option>
                            <option value="nur">NUR</option>
                        </Form.Control>
                    </Form.Group>
                    </Form>
                </Card.Body>
            </Card>
        );
    }
}

export default ChooseMemoria;