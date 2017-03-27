import * as React from 'react';

interface State {
  component: any;
}

export default getComponent => class AsyncComponent extends React.PureComponent<{}, State> {
  static component: any;
  constructor(props) {
    super(props);
    this.state = {
      component: AsyncComponent.component,
    };
  }
  componentWillMount() {
    if (!this.state.component) {
      getComponent().then(component => {
        AsyncComponent.component = component;
        this.setState({ component });
      });
    }
  }
  render() {
    const { component: Component } = this.state;
    if (Component) {
      return <Component {...this.props} />;
    }
    return null;
  }
};
