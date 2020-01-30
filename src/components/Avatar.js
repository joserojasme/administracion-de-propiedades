import React from 'react';
import PropTypes from 'utils/propTypes';
import classNames from 'classnames';

const Avatar = ({
  rounded,
  circle,
  src,
  size,
  tag: Tag,
  className,
  style,
  props,
  ...restProps
  
}) => {
  const classes = classNames({ 'rounded-circle': circle, rounded }, className);
  return (
    <Tag
      src={src}
      style={{ width: size, height: size, ...style }}
      className={classes}
      {...restProps}
    />
  );
};

Avatar.propTypes = {
  tag: PropTypes.component,
  rounded: PropTypes.bool,
  circle: PropTypes.bool,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  src: PropTypes.string,
  style: PropTypes.object,
};

Avatar.defaultProps = {
  tag: 'img',
  rounded: false,
  circle: true,
  size: 40,
  style: {},
};

export default Avatar;
