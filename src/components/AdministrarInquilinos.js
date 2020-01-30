import React from 'react';
import { Button, ButtonGroup, Table } from 'reactstrap';
import PropTypes from 'utils/propTypes';

const AdministrarInquilinos = ({ headers, usersData, onClick,onClickBorrar, ...restProps }) => {
  return (
    <Table responsive hover {...restProps}>
      <thead>
        <tr className="text-capitalize align-middle text-center">
          {headers.map((item, index) => <th key={index}>{item}</th>)}
        </tr>
      </thead>
      <tbody>
        {usersData.length > 0 &&
            usersData.map(({ nombre,documento,telefono,celular,id }, index) => (
          <tr key={id}>
            
            <td> <ButtonGroup>
                                            <Button
                                                color={'info'}
                                                outline
                                                onClick={onClick}
                                                value={id}
                                            >
                                                  Modificar
                  </Button>
                                        </ButtonGroup></td>
            <td className="align-middle text-center">{nombre}</td>
            <td className="align-middle text-center">{documento}</td>
            <td className="align-middle text-center">{telefono}</td>
            <td className="align-middle text-center">{celular}</td>
            <td> <ButtonGroup>
                                            <Button
                                                color={'info'}
                                                outline
                                                onClick={onClickBorrar}
                                                value={id}
                                            >
                                                  Borrar
                  </Button>
                                        </ButtonGroup></td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

AdministrarInquilinos.propTypes = {
  headers: PropTypes.node,
  usersData: PropTypes.arrayOf(
    PropTypes.shape({
      urlImagen: PropTypes.string,
      nombre: PropTypes.string,
    })
  ),
};

AdministrarInquilinos.defaultProps = {
  headers: [],
  usersData: [],
};

export default AdministrarInquilinos;
