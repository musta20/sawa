import React, { Component } from 'react';
import { Link} from "react-router-dom";

class  Navbar extends Component {

    constructor(props){
      super(props)
      this.state = {isToggleOn: true};

      // This binding is necessary to make `this` work in the callback

      this.CollapsaNav = this.CollapsaNav.bind(this)
    }
CollapsaNav(e){
 if (this.state.isToggleOn){
   this.setState({isToggleOn:false})
  console.log('On')
 } else{
  this.setState({isToggleOn:true})

  console.log('off')

 }
}

    //width="100" height="100"
    render() { 
 
        return (
          <nav className="navbar navbar-expand-lg navbar-dark BK-header fixed-top">
          <div className="container">
            <a className="navbar-brand" href="#">THE`Poss</a>
            <button className= {this.state.isToggleOn ? "navbar-toggler"  : "navbar-toggler collapsed"  }
            onClick={this.CollapsaNav}
            type="button" data-toggle="collapse"
             data-target="#navbarResponsive"
              aria-controls="navbarResponsive" 
              aria-expanded={this.state.isToggleOn ? "false"  : "true"  } 
              aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className={this.state.isToggleOn ? "collapse navbar-collapse"  : "collapse navbar-collapse show"   } 

            id="navbarResponsive">
              <ul className="navbar-nav ml-auto">
                <li className="nav-item ">
            <span className="s1">
            <span className="s2">
            <abbr title="Stream now">
            <Link to='/CallBorad'>
              <img   className="st btn" src="video.svg"  alt="Stream" ></img>
              </Link>
            </abbr>
            </span>
</span>
                </li>
                <li className="nav-item ">
    <span className="s1">
    <span className="s12">
                <abbr title="Home">
                <Link to='/'>
                  <img   className="st btn" src="home.svg"  alt="Stream" ></img>
                  </Link>
                </abbr>
                </span>
</span>
                </li>
              </ul>
            </div>
          </div>
        </nav>  );
    }
}
 
export default Navbar;