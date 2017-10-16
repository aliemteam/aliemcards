import * as React from 'react';

export interface BioProps {
  name: string;
  title: string;
  credentials: string;
  location: string;
  twitter: string;
}

const AboutBio: React.StatelessComponent<BioProps> = props => (
  <div className="column column--relative-50">
    <h3>{props.name}</h3>
    <div>
      <div>
        <strong>{props.title}</strong>
      </div>
      <div>{props.credentials}</div>
      <div>{props.location}</div>
      <div>
        <a href={`https://www.twitter.com/${props.twitter}`}>@{props.twitter}</a>
      </div>
    </div>
  </div>
);

export default AboutBio;
