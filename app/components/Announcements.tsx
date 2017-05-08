import * as React from 'react';
import { gql, graphql } from 'react-apollo';
import { Announcement as IAnnouncement } from '../../server/models/';

const LOCALSTORAGE_KEY = 'announcementId';

interface Props {
  data?: {
    announcements: IAnnouncement[];
    networkStatus: number;
  };
}

interface State {
  announcement?: IAnnouncement;
  isDismissed: boolean;
}

const announcements = gql`
  query getAnnouncements {
    announcements {
      date
      heading
      message
    }
  }
`;

@graphql(announcements)
export default class Announcements extends React.Component<Props, State> {

  static lastSeen: string|null = localStorage.getItem(LOCALSTORAGE_KEY);

  constructor(props) {
    super(props);
    this.state = {
      isDismissed: false,
    };
  }

  componentWillReceiveProps(props: Props) {
    if (props.data === undefined || props.data.networkStatus !== 7) { return; }
    const announcement = props.data.announcements[0];
    this.setState(prevState => ({
      ...prevState,
      announcement,
      isDismissed: Announcements.lastSeen === announcement.date,
    }));
  }

  dismiss = () => {
    if (this.state.announcement) {
      localStorage.setItem(LOCALSTORAGE_KEY, this.state.announcement.date);
    }
    this.setState(prevState => ({ ...prevState, isDismissed: true }));
  }

  render() {
    if (!this.state.announcement || this.state.isDismissed) { return null; }
    return (
      <div className="announcement">
          <div className="announcement_content">
            <span>
              <span className="announcement_heading" children={this.state.announcement.heading} />
              {this.state.announcement.message}
            </span>
            <button
              className="announcement_dismiss"
              children="&times; dismiss"
              onClick={this.dismiss}
            />
          </div>
      </div>
    );
  }
}
