import React from 'react';
import { MdCall } from 'react-icons/md';
import { Table, Badge } from 'reactstrap';
import PropTypes from 'utils/propTypes';


const NoticiasVistas = ({ headers, usersData, onClick, ...restProps }) => {
  return (
    <Table responsive hover {...restProps}>
      <thead>
        <tr className="text-capitalize align-middle text-center">
          {headers.map((item, index) => <th key={index}>{item}</th>)}
        </tr>
      </thead>
      <tbody>
        {usersData.map(({ nombreNoticia, fechaInserccion, idPropiedad, id }, index) => (
          <tr key={id} >

            <td className="align-middle text-center">{nombreNoticia}</td>
            <td className="align-middle text-center">
              {idPropiedad == 0 ?
                <Badge color="danger"  >No leído</Badge>
                :
                <Badge color="success"  >Leído</Badge>
              }
            </td>
            <td className="align-middle text-center">{fechaInserccion.substring(0, 19)}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

NoticiasVistas.propTypes = {
  headers: PropTypes.node,
  usersData: PropTypes.arrayOf(
    PropTypes.shape({

    })
  ),
};

NoticiasVistas.defaultProps = {
  headers: [],
  usersData: [],
};

export default NoticiasVistas;
