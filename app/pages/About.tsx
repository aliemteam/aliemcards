import * as React from 'react';
import { Link } from 'react-router-dom';

import AboutBio from '../components/AboutBio';

export default () => (
  <div className="content">
    <h1>About</h1>
    <h2>Paucis Verbis Cards</h2>
    <p>
      The Paucis Verbis (PV) cards were initially developed as a bedside
      teaching tool used by Academic Life in Emergency Medicine (ALiEM) Founder
      and Editor-in-chief Michelle Lin.  They were short, succinct,  rapid-fire
      summaries of key learning points on various Emergency Medicine (EM) topics
      that would fit on a 5 x 7 index card. Michelle carried these cards in her
      pocket and handed them out to trainees as needed. Eventually others at her
      institution began using the cards and as digital and mobile technology
      became more ubiquitous, Michelle transitioned the cards to several mobile
      platforms so that she could share them with the greater EM community.
    </p>
    <h2>Now ALiEM Cards</h2>
    <p>
      As the <a href="http://www.aliem.com" target="_blank" rel="noopener noreferrer">ALiEM</a> blog
      has grown, so have the PV Cards. What began as a handful of personal notes, are now a key
      FOAMed point-of-care resource.
    </p>
    <p>
      This website is the next iteration of that project.
    </p>
    <h2>Help us improve this resource</h2>
    <p>
      Please <Link to="/contact">let us know</Link> how you use these cards.
      What would make them more useful? Found an error? Help us fix it!
    </p>
    <h2>The ALiEM Cards Team</h2>
    <div className="row">
      <AboutBio
        name="Michelle Lin, MD"
        title="Creator & Editor-in-Chief"
        credentials="Endowed Chair for EM Education"
        location="UC San Francisco / Zuckerberg San Francisco General"
        twitter="M_Lin"
      />
      <AboutBio
        name="Jeremy Voros, MD"
        title="Developer"
        credentials="Attending Physician"
        location="Emergency Physicians Integrated Care, Utah"
        twitter="VorosMD"
      />
    </div>
    <div className="row">
      <AboutBio
        name="Derek Sifford, FP-C, CCP-C"
        title="Developer"
        credentials="Paramedic"
        location="Wayne State University"
        twitter="FlightMed1"
      />
      <AboutBio
        name="Catherine Patocka, MD, MHPE"
        title="Research Lead"
        credentials="Assistant Professor"
        location="University of Calgary"
        twitter="patockaem"
      />
    </div>
    <div className="row">
      <AboutBio
        name="Teresa Chan, MD MHPE"
        title="Research Mentor"
        credentials="Emergency Physician and Base Hospital Physician"
        location="Hamilton Health Sciences"
        twitter="TChanMD"
      />
      <AboutBio
        name="Andy Little, DO"
        title="Content Editor"
        credentials="Attending Physician, Core Faculty"
        location="Doctors Hospital Emergency Medicine Residency, OH"
        twitter="andyglittle"
      />
    </div>
  </div>
);
