import * as React from 'react';
import { gql, graphql } from 'react-apollo';

interface State {
  name: string;
  email: string;
  message: string;
  sent: boolean;
}

interface Props {
  sendMessage: (name: string, email: string, message: string) => PromiseLike<any>;
}

const contactUsMessage = gql`
  mutation contactUsMessage($email: String!, $message: String!, $name: String!) {
    contactUs(email: $email, message: $message, name: $name) {
      status
      statusText
    }
  }
`;

const config = {
  props: ({ mutate }) => ({
    sendMessage: (name: string, email: string, message: string) => mutate({ variables: { name, email, message }}),
  }),
};

@graphql(contactUsMessage, config)
export default class Contact extends React.PureComponent<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      message: '',
      name: '',
      sent: false,
    };
  }

  sendHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { name, email, message } = this.state;
    this.props.sendMessage(name, email, message).then(res => {
      const data = res.data.contactUs;
      if (data.status !== 200) { throw new Error(data.statusText); }
      this.setState({ sent: true });
    });
  }

  changeHandler = (e: React.FormEvent<HTMLInputElement|HTMLTextAreaElement>) => {
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
