import React from 'react';
import Card from 'react-bootstrap/Card';

class Ready extends React.Component{
    render(){
        //('quedan: ' + this.props.procesos.length + ' procesos');
        //console.log(this.props.procesos);
        return(
            <Card style={{ width: '100%' }}>
                <Card.Header>Ready</Card.Header>
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

export default Ready;