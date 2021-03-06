import React from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';

class Finished extends React.Component{
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
            <Card style={{ width: '100%' }}>
                <Card.Header>Finished</Card.Header>
                <Card.Body>
                    {this.props.procesos.map(proceso => {
                        return(
                            <p key={proceso.nombreProceso}>{proceso.nombreProceso}</p>
                        );
                    })}
                </Card.Body>
            </Card>
        );
    }
}

export default Finished;