import * as React from 'react';

interface Props {
  url: string;
  title: string;
}

export default class Card extends React.Component<Props, {}> {
  componentDidMount() {
    window.addEventListener('load', window.addthis.layers.refresh);
  }

  componentWillUnmount() {
    window.removeEventListener('load', window.addthis.layers.refresh);
  }

  render() {
    const card_url = `https://www.aliemcards.com${this.props.url}`;
    const card_title = `ALIEMCards: ${this.props.title}`;
    return (
      <div className="addthis_inline_share_toolbox" data-url={card_url} data-title={card_title} />
    );
  }
}
