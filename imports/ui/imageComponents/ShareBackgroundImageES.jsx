/* eslint-disable */
import React from 'react';

const ShareBackgroundImageES = (props) => {
  return (
    <image
      x="0"
      y="0"
      width={props.width}
      height={props.height}
    />
  );
};

ShareBackgroundImageES.propTypes = {
  width: React.PropTypes.string,
  height: React.PropTypes.string,
};

export default ShareBackgroundImageES;