import React from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';

class New extends React.Component{
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
                <Card.Header>Featured</Card.Header>
                <Card.Body>
                    <Form>
                        <Form.Group as={Row} controlId="formHorizontalEmail">
                            <Form.Label column sm={5}>
                                Nombre
                            </Form.Label>
                            <Col sm={5}>
                            <Form.Control type="text" placeholder="" />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} controlId="formHorizontalPassword">
                            <Form.Label column sm={5}>
                                Páginas
                            </Form.Label>
                            <Col sm={5}>
                            <Form.Control type="text" placeholder=" " />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} controlId="formHorizontalEmail">
                            <Form.Label column sm={5}>
                                Ejec. Total
                            </Form.Label>
                            <Col sm={5}>
                            <Form.Control type="text" placeholder="" />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row}>
                            <Col sm={{ span: 10 }}>
                            <Button type="submit">Agregar proceso</Button>
                            </Col>
                        </Form.Group>
                    </Form>
                </Card.Body>
            </Card>
        );
    }
}

export default New;