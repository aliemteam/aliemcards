import * as React from 'react';

interface Props {
  title: string;
  path: string;
}

export default class Header extends React.PureComponent<Props> {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    window.addthis.share();
  }

  render() {
    const url = `https://www.aliemcards.com${this.props.path}`;
    return (
      <div className="addthis_share">
        <div className="addthis_button">
          <i className="addthis_icon_facebook" />
          <div
            className="addthis_share_button"
            data-service="facebook"
            data-url={url}
            data-title={this.props.title}
            data-description={this.props.title}
          >
            Facebook
          </div>
        </div>
        <div className="addthis_button">
          <i className="addthis_icon_twitter" />
          <div
            className="addthis_share_button"
            data-service="twitter"
            data-url={url}
            data-title={this.props.title}
          >
            Twitter
          </div>
        </div>
        <div className="addthis_button">
          <i className="addthis_icon_email" />
          <div
            className="addthis_share_button"
            data-service="email"
            data-url={url}
            data-title={this.props.title}
          >
            Email
          </div>
        </div>
      </div>
    );
  }
}
