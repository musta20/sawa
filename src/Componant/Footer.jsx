import React, { Component } from 'react';
class Footer extends Component {
    state = {  }
    render() { 
        return ( <footer className="bg-dark fixed-bottom">
        <div className="container">
          <p className="m-0 text-center text-white">Copyright © Your Website 2019</p>
        </div>
      </footer>
       );
    }
}
 
export default Footer;