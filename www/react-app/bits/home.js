import React from 'react';
import Cards from './cards';

class Home extends React.Component {
  render() {
    return (
      <div>
        <h1>Welcome</h1>
        <p>This is where all the ALiEM Cards live. Formerly the PV Cards.</p>
        <Cards />
      </div>

    );
  }
}

export default Home;
