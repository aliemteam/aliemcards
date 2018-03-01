import * as React from 'react';

export interface BioProps {
  name: string;
  title: string;
  credentials: string;
  location: string;
  twitter: string;
}

const AboutBio: React.StatelessComponent<BioProps> = ({
  credentials,
  location,
  name,
  title,
  twitter,
}: BioProps): JSX.Element => (
  <div className="column column--relative-50">
    <h3>{name}</h3>
    <div>
      <div>
        <strong>{title}</strong>
      </div>
      <div>{credentials}</div>
      <div>{location}</div>
      <div>
        <a href={`https://www.twitter.com/${twitter}`}>@{twitter}</a>
      </div>
    </div>
  </div>
);

export default AboutBio;
