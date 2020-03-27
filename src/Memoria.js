import React from 'react';
import './App.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ChooseMemoria from './ChooseMemoria';
import TablaPaginas from './TablaPaginas';

class Memoria extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            flag: false
        }
        this.setClearNUR = this.setClearNUR.bind(this)
    }

    setStatePromise(that, newState) {
        return new Promise((resolve) => {
            that.setState(newState, () => {
                resolve();
            });
        });
    }

    async setClearNUR(flag){
        await this.setStatePromise(this,{
            flag: flag
        });
        this.props.setClearNURapp(flag);
    }
    
    render(){
        return(
            <Row className="d-flex justify-content-between">
                <Col sm={2}>
                    <h2>Memoria</h2>
                </Col>
                <Col sm={7}>
                <TablaPaginas running = {this.props.running} />
                </Col>
                <Col sm={3}>
                <ChooseMemoria handleSelect={this.props.selectAlgoritmoMemoria} setClearNUR = {this.setClearNUR}/>
                </Col>  
            </Row>
        );
    }
}

export default Memoria;