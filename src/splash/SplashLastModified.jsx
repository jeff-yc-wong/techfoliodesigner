import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class SplashLastModified extends React.Component {

  render() {
  if(this.props.status != null) {
    const status = String(this.props.status);
    const time = status.substring(0, 11);

    return (
      <div>
         <p>Last Modified:{time}</p>
      </div>
    );
  }else {
    return null;
  }

  }
}

SplashLastModified.defaultProps = {
  status: '',
};

SplashLastModified.propTypes = {
  status: PropTypes.string,
};


function mapStateToProps(state) {
  return {
    status: state.status,
  };
}

export default connect(mapStateToProps)(SplashLastModified);
