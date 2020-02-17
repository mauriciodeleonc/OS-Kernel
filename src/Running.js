import React from 'react';
import Card from 'react-bootstrap/Card';

class Running extends React.Component{
    render(){
        return(
            <Card style={{ width: '100%' }}>
                <Card.Header>Running</Card.Header>
                <Card.Body>
                    <p>{this.props.proceso ? this.props.proceso.nombreProceso : ' '}</p>
                </Card.Body>
            </Card>
        );
    }
}

export default Running;