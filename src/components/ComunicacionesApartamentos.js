import React from 'react';
import PropTypes from 'utils/propTypes';
import { Table, ButtonGroup, Button} from 'reactstrap';
import { MdCall } from 'react-icons/md';
import Avatar from 'components/Avatar';

import withBadge from 'hocs/withBadge';

const AvatarWithBadge = withBadge({
  position: 'bottom-right',
  color: 'success',
})(Avatar);


const ComunicacionesApartamentos = ({ headers, usersData,onClick, ...restProps }) => {
  return (
    <Table responsive hover {...restProps}>
      <thead>
        <tr className="text-capitalize align-middle text-center">
          {headers.map((item, index) => <th key={index}>{item}</th>)}
        </tr>
      </thead>
      <tbody>
        {usersData.map(({ urlImagenPropiedad, nomenclatura, nombreArrendatario,celularArrendatario, id,idUsuario }, index) => (
          <tr key={id} >
            <td  className="align-middle text-center" >
            <ButtonGroup>
                                            <Button
                                                color={'info'}
                                                outline
                                                onClick={onClick}
                                                value={id}
                                                id={id}
                                            >
                                                  Contactos
                  </Button>
                                        </ButtonGroup>
            </td>
            <td className="align-middle text-center">{nomenclatura}</td>
            <td className="align-middle text-center">{nombreArrendatario}</td>
            <td className="align-middle text-center"><a href={`tel:${celularArrendatario}`}><MdCall/></a></td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

ComunicacionesApartamentos.propTypes = {
  headers: PropTypes.node,
  usersData: PropTypes.arrayOf(
    PropTypes.shape({
      urlImagenPropiedad: PropTypes.string,
      nomenclatura: PropTypes.string,
      nombreArrendatario: PropTypes.string,
      celularArrendatario: PropTypes.string,
      id:PropTypes.string,
      idUsuario:PropTypes.string
    })
  ),
};

ComunicacionesApartamentos.defaultProps = {
  headers: [],
  usersData: [],
};

export default ComunicacionesApartamentos;
