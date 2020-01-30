import React from 'react';
import PropTypes from 'utils/propTypes';
import {formatofecha} from '../utils/utilsFunctions';
import { Table, Progress } from 'reactstrap';

import Avatar from 'components/Avatar';

import withBadge from 'hocs/withBadge';

const AvatarWithBadge = withBadge({
  position: 'bottom-right',
  color: 'success',
})(Avatar);


const Personal = ({ headers, usersData, ...restProps }) => {
  return (
    <Table responsive hover {...restProps}>
      <thead>
        <tr className="text-capitalize align-middle text-center">
          {headers.map((item, index) => <th key={index}>{item}</th>)}
        </tr>
      </thead>
      <tbody>
        {usersData.map(({ urlImagen, nombre, fechaCumpleaños,cargo, horaInicioTurno,horaFinTurno, id }, index) => (
          <tr key={id}>
            <td className="align-middle text-center">
              <Avatar src={urlImagen} />
            </td>
            <td className="align-middle text-center">{nombre}</td>
            <td className="align-middle text-center">{cargo}</td>
            <td className="align-middle text-center">{formatofecha(fechaCumpleaños)}</td>
            <td className="align-middle text-center">{`${horaInicioTurno}-${horaFinTurno}`}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

Personal.propTypes = {
  headers: PropTypes.node,
  usersData: PropTypes.arrayOf(
    PropTypes.shape({
      urlImagen: PropTypes.string,
      nombre: PropTypes.string,
      cargo: PropTypes.string,
      fechaCumpleaños: PropTypes.string,
    })
  ),
};

Personal.defaultProps = {
  headers: [],
  usersData: [],
};

export default Personal;
