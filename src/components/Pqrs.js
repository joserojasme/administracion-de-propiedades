import React from 'react';
import PropTypes from 'utils/propTypes';

import { Table, Button,ButtonGroup } from 'reactstrap';


const Pqrs = ({ headers, usersData, onClick,onClickBorrar, ...restProps }) => {
  return (
    <Table responsive hover {...restProps}>
      <thead>
        <tr className="text-capitalize align-middle text-center">
          {headers.map((item, index) => <th key={index}>{item}</th>)}
        </tr>
      </thead>
      <tbody>
        {usersData.length > 0 &&
            usersData.map(({ categoria, titulo, descripcion, estado,id }, index) => (
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
            <td className="align-middle text-center">{categoria}</td>
            <td className="align-middle text-center">{titulo}</td>
            <td className="align-middle text-center">{`${descripcion.substring(0,20)}...`}</td>
            <td className="align-middle text-center">{estado}</td>
            
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

Pqrs.propTypes = {
  headers: PropTypes.node,
  usersData: PropTypes.arrayOf(
    PropTypes.shape({
      urlImagen: PropTypes.string,
      nombre: PropTypes.string,
    })
  ),
};

Pqrs.defaultProps = {
  headers: [],
  usersData: [],
};

export default Pqrs;
