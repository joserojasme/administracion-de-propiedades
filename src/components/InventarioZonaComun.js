import React from 'react';
import { MdCall } from 'react-icons/md';
import { Table } from 'reactstrap';
import PropTypes from 'utils/propTypes';


const InventarioZonaComun = ({ headers, usersData, onClick, ...restProps }) => {
    return (
        <Table responsive hover {...restProps}>
            <thead>
                <tr className="text-capitalize align-middle text-center">
                    {headers.map((item, index) => <th key={index}>{item}</th>)}
                </tr>
            </thead>
            <tbody>
                {usersData.map(({ nombre, cantidad, id }, index) => (
                    <tr key={id} >

                        <td className="align-middle text-center">{nombre}</td>
                        <td className="align-middle text-center">{cantidad}</td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
};

InventarioZonaComun.propTypes = {
    headers: PropTypes.node,
    usersData: PropTypes.arrayOf(
        PropTypes.shape({
            nombre: PropTypes.string,
            cantidad: PropTypes.string,
        })
    ),
};

InventarioZonaComun.defaultProps = {
    headers: [],
    usersData: [],
};

export default InventarioZonaComun;
