import React from 'react';

class Empty extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>{this.props.children}</div>
    );
  }
}

Empty.propTypes = {
  props: React.PropTypes.object,
};

Empty.defaultProps = {

};

export default Empty;
