import React from 'react';
import axios from 'axios';

class Contact extends React.Component {

  constructor(props) {
    super(props);
    this.changeHandler = this.changeHandler.bind(this);
    this.sendHandler = this.sendHandler.bind(this);
    this.state = {
      formValues: {
        name: '',
        email: '',
        message: '',
      },
      formInvalid: false,
    };
  }

  sendHandler(e) {
    e.preventDefault();
    const form = this.state.formValues;
    const emptyField = Object.keys(form).some((key) => form[key] === '');
    if (emptyField) {
      this.setState({ formInvalid: 'All fields required' });
      return;
    }
    const emailRegex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    const validEmail = form.email.match(emailRegex);
    if (!validEmail) {
      this.setState({ formInvalid: 'Valid Email Required' });
      return;
    }
    if (!this.state.formInvalid) {
      console.log(this.state.formValues);
      axios.post('/contacthandler', this.state.formValues)
      .then((res) => { console.log(res); })
      .catch((error) => { console.log(error); });
    }
  }

  changeHandler(e) {
    const newFormValues = Object.assign(this.state.formValues, { [e.target.name]: e.target.value } );
    this.setState({ formValues: newFormValues, formInvalid: false }, () => console.log(this.state) );
  }

  render() {
    return (
      <div className="contact">
        <h1>ContactForm</h1>
        <div className={this.state.formInvalid ? "invalidError invalidShow" : "invalidError invalidHide"}>
          Invalid Submission: {this.state.formInvalid}
        </div>
        <h3>All fields required.</h3>
        <form>
          <label htmlFor="name">Name:</label>
          <input type="text" name="name" onChange={this.changeHandler} />
          <label htmlFor="email">Email:</label>
          <input type="email" name="email" onChange={this.changeHandler} />
          <label htmlFor="message">Message:</label>
          <textarea name="message" onChange={this.changeHandler}></textarea>
          <input type="text" name="company" id="company" />
          <br />
          <button type="submit" onClick={this.sendHandler}>Send</button>
        </form>
      </div>
    );
  }

};

Contact.propTypes = {

};

Contact.defaultProps = {

};

export default Contact;
