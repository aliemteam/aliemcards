import axios from 'axios';
import { GraphQLNonNull, GraphQLString } from 'graphql';
import { ArgumentField } from '../../utils/strongTypes';
import apiResponseType, { APIResponse } from './apiResponseType';

interface ContactUsArgs {
  email: string;
  message: string;
  name: string;
}

const contactUs: ArgumentField<ContactUsArgs> = {
  description: 'Send a message to the ALiEMCards slack channel.',
  type: apiResponseType,
  args: {
    email: {
      description: 'Email address of person contacting.',
      type: new GraphQLNonNull(GraphQLString),
    },
    message: {
      description: 'Message from person contacting.',
      type: new GraphQLNonNull(GraphQLString),
    },
    name: {
      description: 'Name of the person contacting.',
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  resolve: (_root, args: ContactUsArgs): PromiseLike<APIResponse> => (
    axios.post('https://aliem-slackbot.now.sh/aliemcards/messages/contact-form', { data: args }, {
      headers: {
        ALIEM_API_KEY: <string>process.env.ALIEM_API_KEY,
      },
    })
    .then(res => res)
    .catch(() => ({ status: 501, statusText: 'Server error encountered.' }))
  ),
};

export default {
  contactUs,
};
