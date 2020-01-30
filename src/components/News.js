import React from 'react';
import PropTypes from 'utils/propTypes';
import { Media, Button  } from 'reactstrap';
import Typography from 'components/Typography';

const News = ({title, description, right, onClick,value,urlImagen,id, ...restProps }) => {
  return (

    <Media {...restProps}>
      <Media body className="overflow-hidden">
        <Media heading tag="h5" className="text-truncate">
          {`${title.substring(0,45)}...`}
        </Media>
        <p className="text-muted text-truncate">{`${description.substring(0,45)}...`}</p>
        <Button  color={'info'}
                                                outline
                                                onClick={onClick}
                                                value={`${right.toString().substring(0,10)}**${title}**${urlImagen}**${id}`}
                                                id={description}>ver</Button>
      </Media>
      <Media right className="align-self-center">
        {right && typeof right === 'string' ? (
          <Typography type="h6">{right.toString().substring(0,10)}</Typography>
        ) : (
          right.toString().substring(0,10)
        )}
      </Media>
    </Media>
   
  );
};

News.propTypes = {
 
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  right: PropTypes.node,
};

export default News;
