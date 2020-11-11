import React, { Component } from 'react'; //import React Component
import './style.css';

class AboutPage extends Component {
  render() {
    return (
      <div className = "About">
        <div className ='a-content'>
          <h2>About Us</h2>
          <p>This is the Package Tracker App.</p>
          <p>We keep track of your imported package list.</p>
          <img src= './img/redIcon_xlg.png' alt="icon"/>
        </div>
      </div>
    );
  }
}

export default AboutPage;

export {AboutPage};