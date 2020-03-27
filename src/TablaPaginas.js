import React from 'react';
import './App.css';
import Table from 'react-bootstrap/Table';

class TablaPaginas extends React.Component{
    render(){
        //console.log(this.props.running);
        if(this.props.running.paginas !== undefined) {
            //console.log(this.props.running);
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
                            this.props.running.paginas.map((pagina, i) => 
                                    <tr key={i}>
                                        <td>{i}</td>
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