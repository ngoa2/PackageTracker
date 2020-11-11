import React, { Component } from 'react'; //import React Component
import './style.css';

class WelcomePage extends Component {
    render() {
        return (
          <div className = 'welcome'>
              <div className = 'welContent'>
                <h2>Welcome</h2>
                <p>This is Package Tracker</p>
              </div>
          </div>
        );
      }
    }

    export default WelcomePage;

    export {WelcomePage};