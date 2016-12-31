import React, { PureComponent } from 'react';
import { post } from 'axios';

export default class Contact extends PureComponent {
  constructor(props) {
    super(props);
    this.changeHandler = this.changeHandler.bind(this);
    this.sendHandler = this.sendHandler.bind(this);
    this.state = {
      name: '',
      email: '',
      message: '',
      sent: false,
    };
  }

  sendHandler(e) {
    e.preventDefault();
    const { name, email, message } = this.state;
    post('/contact', { data: { name, email, message } })
    .then(res => {
      if (res.status !== 200) throw res.statusText;
      this.setState({ ...this.state, sent: true });
    })
    .catch(err => {
      console.error(`Error: ${err}`);
    });
  }

  changeHandler(e) {
    this.setState({ ...this.state, [e.currentTarget.id]: e.currentTarget.value });
  }

  render() {
    return (
      <div >
        { !this.state.sent &&
          <div className="contact">
            <h1>Contact Form</h1>
            <form onSubmit={this.sendHandler}>
              <div className="row">
                <div className="column column--50 contact__field">
                  <label htmlFor="name">Name:</label>
                  <input type="text" id="name" onChange={this.changeHandler} required />
                </div>
                <div className="column column--50 contact__field">
                  <label htmlFor="email">Email:</label>
                  <input type="email" id="email" onChange={this.changeHandler} required />
                </div>
              </div>
              <div className="row row--stacked contact__message">
                <label htmlFor="message">Message:</label>
                <textarea id="message" onChange={this.changeHandler} required />
                <div>
                  <button type="submit">Send</button>
                </div>
              </div>
            </form>
          </div>
        }
        { this.state.sent &&
          <div className="content">
            <h1>Thank You</h1>
            <p>Thank you for your message.
              Someone from the ALiEMCards team will contact you shortly.</p>
          </div>
        }
      </div>
    );
  }
}
