import React from 'react';
import { MdCall } from 'react-icons/md';
import { Table } from 'reactstrap';
import PropTypes from 'utils/propTypes';


const Inquilinos = ({ headers, usersData,onClick, ...restProps }) => {
  return (
    <Table responsive hover {...restProps}>
      <thead>
        <tr className="text-capitalize align-middle text-center">
          {headers.map((item, index) => <th key={index}>{item}</th>)}
        </tr>
      </thead>
      <tbody>
         <tr key={8944} >
          
          <td className="align-middle text-center">{usersData.nombreArrendatario}</td>
          <td className="align-middle text-center"><a href={`tel:${usersData.celularArrendatario}`}><MdCall/></a></td>
          <td className="align-middle text-center"><a href={`tel:${usersData.telefonoArrendatario}`}><MdCall/></a></td>
        </tr>
        {usersData.tblInquilinos.map(({ nombre, telefono, celular, id, visible }, index) => (
          <tr style={!visible ? {display:'none'} : null} key={id} >
          
            <td className="align-middle text-center">{nombre}</td>
            <td className="align-middle text-center"><a href={`tel:${celular}`}><MdCall/></a></td>
            <td className="align-middle text-center"><a href={`tel:${telefono}`}><MdCall/></a></td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

Inquilinos.propTypes = {
  headers: PropTypes.node,
  usersData: PropTypes.arrayOf(
    PropTypes.shape({
      nombre: PropTypes.string,
      telefono: PropTypes.string,
      celular: PropTypes.string,
    })
  ),
};

Inquilinos.defaultProps = {
  headers: [],
  usersData: [],
};

export default Inquilinos;
