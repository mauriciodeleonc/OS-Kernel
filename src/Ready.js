import React from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Button';

class Ready extends React.Component{
    /*constructor(props){
        super(props);
        this.state = {
            nombre: 1,
            pagina: '0',
            ejecTotal: '0'
        }
    }*/

    render(){
        return(
            <Card style={{ width: '18rem' }}>
                <Card.Header>Ready</Card.Header>
                <Card.Body>
                    <p>Prueba</p>
                </Card.Body>
            </Card>
        );
    }
}

export default Ready;