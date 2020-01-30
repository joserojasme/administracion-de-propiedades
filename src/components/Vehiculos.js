import React from 'react';
import { Button, ButtonGroup, Table } from 'reactstrap';
import PropTypes from 'utils/propTypes';

const Vehiculos = ({ headers, usersData, onClick,onClickBorrar, ...restProps }) => {
  return (
    <Table responsive hover {...restProps}>
      <thead>
        <tr className="text-capitalize align-middle text-center">
          {headers.map((item, index) => <th key={index}>{item}</th>)}
        </tr>
      </thead>
      <tbody>
        {usersData.length > 0 &&
            usersData.map(({ placa,marca,referencia,modelo,tipoServicio,color,tipoVehiculo,id }, index) => (
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
            <td className="align-middle text-center">{placa}</td>
            <td className="align-middle text-center">{marca}</td>
            <td className="align-middle text-center">{referencia}</td>
            <td className="align-middle text-center">{modelo}</td>
            <td className="align-middle text-center">{tipoServicio}</td>
            <td className="align-middle text-center">{color}</td>
            <td className="align-middle text-center">{tipoVehiculo}</td>
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

Vehiculos.propTypes = {
  headers: PropTypes.node,
  usersData: PropTypes.arrayOf(
    PropTypes.shape({
      urlImagen: PropTypes.string,
      nombre: PropTypes.string,
    })
  ),
};

Vehiculos.defaultProps = {
  headers: [],
  usersData: [],
};

export default Vehiculos;
