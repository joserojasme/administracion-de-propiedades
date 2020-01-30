import React from 'react';
import PropTypes from 'utils/propTypes';
import { MdCall } from 'react-icons/md';

import { Table, Button, ButtonGroup, Badge } from 'reactstrap';


const TableroControl = ({ headers, usersData, onClick,onClickEditarPropiedad, onClickEditarUsuarios, ...restProps }) => {
    return (
        <Table responsive hover {...restProps}>
            <thead>
                <tr className="text-capitalize align-middle text-center">
                    {headers.map((item, index) => <th key={index}>{item}</th>)}
                </tr>
            </thead>
            <tbody>
                {usersData.length > 0 &&
                    usersData.map(({ nomenclatura, chipInmueble, matriculaInmobiliaria, areaPrivada, torre, piso, tipoPropiedad, nombreArrendatario,
                        celularArrendatario, telefonoArrendatario, administracionAlDia, id,nombrePropietario , celularPropietario}, index) => (
                            <tr style={administracionAlDia == 1 ? { backgroundColor: '#CEF6CE' } : { backgroundColor: '#fff' }} key={id}>
                                <td className="align-middle text-center">{administracionAlDia == 1 ?
                                    <Badge color="success"  >Al día</Badge>
                                    :
                                    <Badge color="danger"  >Pendiente</Badge>
                                }</td>
                                <td className="align-middle text-center">{nomenclatura}</td>
                                <td className="align-middle text-center">{chipInmueble}</td>
                               
                                <td className="align-middle text-center">{tipoPropiedad}</td>
                                <td> <ButtonGroup>
                                    <Button
                                        color={'info'}
                                        outline
                                        onClick={onClickEditarUsuarios}
                                        value={id}
                                    >
                                        Editar
                  </Button>
                                </ButtonGroup></td>
                                

                                <td> <ButtonGroup>
                                    <Button
                                        color={'info'}
                                        outline
                                        onClick={onClick}
                                        value={id}
                                    >
                                        Notificaciones
                  </Button>
                                </ButtonGroup></td>
                                <td> <ButtonGroup>
                                    <Button
                                        color={'info'}
                                        outline
                                        onClick={onClickEditarPropiedad}
                                        value={id}
                                    >
                                        Editar
                  </Button>
                                </ButtonGroup></td>
                            </tr>

                        ))}
            </tbody>
        </Table>
    );
};

TableroControl.propTypes = {
    headers: PropTypes.node,
    usersData: PropTypes.arrayOf(
        PropTypes.shape({
          
        })
    ),
};

TableroControl.defaultProps = {
    headers: [],
    usersData: [],
};

export default TableroControl;
