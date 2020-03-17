import React from 'react';
import './App.css';
import Table from 'react-bootstrap/Table';

class TablaPaginas extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            countPag: 0
        }

        this.setCountPag = this.setCountPag.bind(this);
    }

    setStatePromise(that, newState) {
        return new Promise((resolve) => {
            that.setState(newState, () => {
                resolve();
            });
        });
    }

    async setCountPag(){
        await this.setStatePromise(this,{
            countPag: this.state.countPag + 1
        });
    }
    render(){
        if(this.props.running.paginas !== undefined) {
            return(
                <Table striped bordered hover responsive className='tablaPaginas'>
                    <thead>
                        <tr>
                            <th>pag</th>
                            <th>r</th>
                            <th>llegada</th>
                            <th>ult acceso</th>
                            <th>accesos</th>
                            <th>NUR</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.props.running.paginas.map(pagina => 
                                    <tr>
                                        <td>{this.state.countPag}</td>
                                        <td>{pagina[0]}</td>
                                        <td>{pagina[1]}</td>
                                        <td>{pagina[2]}</td>
                                        <td>{pagina[3]}</td>
                                        <td>{pagina[4].toString() + pagina[5].toString()}</td>
                                    </tr>
                            )
                        }
                    </tbody>
                </Table>
            );
        } else {
            return(
                <Table striped bordered hover responsive className='tablaPaginas'>
                    <thead>
                        <tr>
                            <th>pag</th>
                            <th>r</th>
                            <th>llegada</th>
                            <th>ult acceso</th>
                            <th>accesos</th>
                            <th>NUR</th>
                        </tr>
                    </thead>
                </Table>
            );
        }
    }
}

export default TablaPaginas;