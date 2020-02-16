import React from 'react';
import Card from 'react-bootstrap/Card';

class Ready extends React.Component{
    render(){
        return(
            <Card style={{ width: '100%' }}>
                <Card.Header>Ready</Card.Header>
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

export default Ready;