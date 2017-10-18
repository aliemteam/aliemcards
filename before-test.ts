require('ts-node/register');
const { configure } = require('enzyme');
import * as Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });
