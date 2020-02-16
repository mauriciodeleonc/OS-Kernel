import React from 'react';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';

class Ready extends React.Component{
    
    constructor(props){
        super(props);
        this.state = {
            nombre: 1,
            pagina: '0',
            ejecTotal: '0'
        }
    }

    render(){
        return(
            <Card style={{ width: '100%' }}>
                <Card.Header>Ready</Card.Header>
                <Card.Body>
                    {this.props.procesos.nombreProceso}
                </Card.Body>
            </Card>
        );
    }
}

export default Ready;