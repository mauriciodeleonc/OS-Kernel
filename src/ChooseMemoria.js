import React from 'react';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button'

class ChooseMemoria extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            algoritmo: 'fifo'
        }

        this.handleSelect = this.handleSelect.bind(this);
    }

    handleSelect() {
        let algoritmo = this.refs.select.value;
        this.props.handleSelect(algoritmo);
        this.setState({algoritmo});
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
                    {
                        this.state.algoritmo == 'nur' && <Button onClick = {() => this.props.setQuantum(this.state.value)} >Reset bits NUR</Button>
                    }
                </Card.Body>
            </Card>
        );
    }
}

export default ChooseMemoria;