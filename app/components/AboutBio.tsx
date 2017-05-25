import * as React from 'react';

interface BioProps {
    name: string;
    title?: string;
    credentials?: string;
    location?: string;
    twitter?: string;
}

const AboutBio: React.StatelessComponent<BioProps> = props => (
    <div className="about__bio column column--50">
        <h3>{props.name}</h3>
        <ul>
            <li><b>{props.title}</b></li>
            <li>{props.credentials}</li>
            <li>{props.location}</li>
            <li><a href={`https://www.twitter.com/${props.twitter}`}>@{props.twitter}</a></li>
        </ul>
    </div>
);

export default AboutBio;
