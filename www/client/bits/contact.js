import React from 'react';

class Contact extends React.Component {

  constructor(props) {
    super(props);
  }

  clickHander(e) {
    console.log('clicker');
  }

  render() {
    return (
      <div>
        <h1>Contact Us</h1>
        <a href="#" onClick={this.clickHandler}>test click</a>
      </div>
    );
  }

};

Contact.propTypes = {

};

Contact.defaultProps = {

};

export default Contact;
