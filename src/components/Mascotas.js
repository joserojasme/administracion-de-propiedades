import React from 'react';
import PropTypes from 'utils/propTypes';

import { Table, Button,ButtonGroup } from 'reactstrap';

import Avatar from 'components/Avatar';

import withBadge from 'hocs/withBadge';

const Mascotas = ({ headers, usersData, onClick,onClickBorrar, ...restProps }) => {
  return (
    <Table responsive hover {...restProps}>
      <thead>
        <tr className="text-capitalize align-middle text-center">
          {headers.map((item, index) => <th key={index}>{item}</th>)}
        </tr>
      </thead>
      <tbody>
        {usersData.length > 0 &&
            usersData.map(({ nombre, raza, genero,color, observaciones,id }, index) => (
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
            <td className="align-middle text-center">{raza}</td>
            <td className="align-middle text-center">{genero == 'M' ?'MACHO': 'HEMBRA'}</td>
            <td className="align-middle text-center">{color}</td>
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

Mascotas.propTypes = {
  headers: PropTypes.node,
  usersData: PropTypes.arrayOf(
    PropTypes.shape({
      urlImagen: PropTypes.string,
      nombre: PropTypes.string,
    })
  ),
};

Mascotas.defaultProps = {
  headers: [],
  usersData: [],
};

export default Mascotas;
