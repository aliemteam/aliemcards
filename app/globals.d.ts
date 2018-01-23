declare module 'react-apollo';

interface Window {
  addthis: {
    init(): any;
    layers: {
      refresh(): any;
    };
  };
}
