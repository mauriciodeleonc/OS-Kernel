import React from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';

class Running extends React.Component{
    render(){
        return(
            <Card style={{ width: '100%' }}>
                <Card.Header>Running</Card.Header>
                <Card.Body>
                    {this.props.procesos.map(proceso => {
                        return(
                            <p>{proceso.nombreProceso}</p>
                        );
                    })}
                </Card.Body>
            </Card>
        );
    }
}

export default Running;