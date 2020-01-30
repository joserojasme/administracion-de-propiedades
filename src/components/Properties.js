import React from 'react';
import PropTypes from 'utils/propTypes';
import { Media,Badge } from 'reactstrap';
import Typography from 'components/Typography';
import {numberFormat} from '../utils/utilsFunctions';

function ccyFormat(num) {
    num = parseFloat(num);
    let value = `${num.toFixed(2)}`;
    return numberFormat(value);
  }

const Properties = ({title, description, image, right, ...restProps }) => {
  return (
    <Media {...restProps}>
      <Media left>
        <Media
          object
          src={image}
          className="rounded mr-2 mb-2"
          style={{ width: 100, height: 'auto' }}
        />
      </Media>
      <Media body className="overflow-hidden">
        <Media heading tag="h5" className="text-truncate">
          {title}
        </Media>
        {description ?
                                                            <Badge color="success" className="mr-1" >Al día</Badge>
                                                            :
                                                            <Badge color="danger" className="mr-1" >Pendiente</Badge>
                                                        }
        
      </Media>
      <Media right className="align-self-center">
        {right && typeof right === 'string' ? (
          <Typography type="h4">$ {ccyFormat(right)}</Typography>
        ) : (
            <div>$ {ccyFormat(right)}</div>
        )}
      </Media>
    </Media>
  );
};

Properties.propTypes = {
    image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  right: PropTypes.node,
};

export default Properties;
