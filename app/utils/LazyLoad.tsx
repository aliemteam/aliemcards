import * as React from 'react';

interface State {
  component: any;
}

export default (getComponent: () => Promise<any>): any =>
  class AsyncComponent extends React.PureComponent<{}, State> {
    static component: any;
    constructor(props) {
      super(props);
      this.state = {
        component: AsyncComponent.component,
      };
    }
    componentWillMount(): void {
      if (!this.state.component) {
        getComponent().then(component => {
          AsyncComponent.component = component;
          this.setState({ component });
        });
      }
    }
    render(): JSX.Element | null {
      const { component: Component } = this.state;
      if (Component) {
        return <Component {...this.props} />;
      }
      return null;
    }
  };
