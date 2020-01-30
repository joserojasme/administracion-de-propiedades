import React from 'react';
import PropTypes from 'utils/propTypes';

import { Table, Button,ButtonGroup } from 'reactstrap';

import Avatar from 'components/Avatar';

import withBadge from 'hocs/withBadge';

const ZonasComunes = ({ headers, usersData, onClick, ...restProps }) => {
  return (
    <Table responsive hover {...restProps}>
      <thead>
        <tr className="text-capitalize align-middle text-center">
          {headers.map((item, index) => <th key={index}>{item}</th>)}
        </tr>
      </thead>
      <tbody>
        {usersData.map(({ urlImagen, nombre, descripcion, id }, index) => (
          <tr key={id}>
            <td className="align-middle text-center">
              <Avatar src={urlImagen} />
            </td>
            <td> <ButtonGroup>
                                            <Button
                                                color={'info'}
                                                outline
                                                onClick={onClick}
                                                value={id}
                                            >
                                                  Reservar
                  </Button>
                                        </ButtonGroup></td>
            <td className="align-middle text-center">{nombre}</td>
            <td className="align-middle text-center">{descripcion}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

ZonasComunes.propTypes = {
  headers: PropTypes.node,
  usersData: PropTypes.arrayOf(
    PropTypes.shape({
      urlImagen: PropTypes.string,
      nombre: PropTypes.string,
    })
  ),
};

ZonasComunes.defaultProps = {
  headers: [],
  usersData: [],
};

export default ZonasComunes;
