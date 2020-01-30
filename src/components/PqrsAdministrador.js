import React from 'react';
import PropTypes from 'utils/propTypes';

import { Table, Button, ButtonGroup } from 'reactstrap';


const PqrsAdministrador = ({ headers, usersData, onClick, ...restProps }) => {
    return (
        <Table responsive hover {...restProps}>
            <thead>
                <tr className="text-capitalize align-middle text-center">
                    {headers.map((item, index) => <th key={index}>{item}</th>)}
                </tr>
            </thead>
            <tbody>
                {usersData.length > 0 &&
                    usersData.map(({ nomenclatura, tblPqrs, id }, index) => (
                        tblPqrs.length > 0 &&
                        tblPqrs.map(({categoria, titulo, descripcion, estado, fechaRegistro, respuesta,fechaRespuesta, id}, index) =>(
                            <tr style={estado == "ACTIVO" ? {backgroundColor:'#FFF'} : {backgroundColor:'#CEF6CE'}} key={id}>

                            <td> <ButtonGroup>
                                <Button
                                    color={'info'}
                                    outline
                                    onClick={onClick}
                                    value={id}
                                >
                                    Ver
                  </Button>
                            </ButtonGroup></td>
                            <td className="align-middle text-center">{nomenclatura}</td>
                            <td className="align-middle text-center">{categoria}</td>
                            <td className="align-middle text-center">{titulo}</td>
                            <td className="align-middle text-center">{`${descripcion.substring(0, 30)}...`}</td>
                            <td className="align-middle text-center">{estado}</td>
                            <td className="align-middle text-center">{fechaRegistro.substring(0, 19)}</td>
                            <td className="align-middle text-center">{`${respuesta.substring(0, 30)}...`}</td>
                            <td className="align-middle text-center">{fechaRespuesta != null ? `${fechaRespuesta.substring(0, 19)}` : ''}</td>

                        </tr>
                        ))
                        
                    ))}
            </tbody>
        </Table>
    );
};

PqrsAdministrador.propTypes = {
    headers: PropTypes.node,
    usersData: PropTypes.arrayOf(
        PropTypes.shape({
            urlImagen: PropTypes.string,
            nombre: PropTypes.string,
        })
    ),
};

PqrsAdministrador.defaultProps = {
    headers: [],
    usersData: [],
};

export default PqrsAdministrador;
