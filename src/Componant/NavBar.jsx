import React, { Component, createRef } from 'react';
import { Link} from "react-router-dom";
import io from "socket.io-client";
import Ajv from 'ajv';

class  Navbar extends Component {

    constructor(props){
      super(props)
      this.myRef = React.createRef();
      this.roomname = React.createRef();
      this.CallBorad = React.createRef();
      
      this.state = {
        ajv : new Ajv(),
        schema: {"properties":
        {"name": { 
          "type": "string",
          "minLength": 5  ,
          "maxLength": 8  ,
          "pattern":  "^[a-zA-Z0-9]{4,10}$"
        }
      }},
            
          
        
        socket : io('http://192.168.8.102:6800'),
        Rooms:null, 
        TheRoom:null,
        isToggleOn: true,  
        isBoxToggleOn: true,  
        GoToCallBord: false,  
        IsRommeExist: null,  
        name: null,  
        id: null  
      };
      
      this.wrrning = React.createRef();
      this.CollapsaNav = this.CollapsaNav.bind(this)
      this.AddName  = this.AddName.bind(this);
      this.onchange = this.onchange.bind(this);
      this.saveName = this.saveName.bind(this);
      this.ifOnline = this.ifOnline.bind(this);
      
      //the CallBorad 
        }
       
        onchange(e){
          this.setState({TheRoom:e.target.value})
          if((e.target.value).length < 3) return;

          var valid = this.state.ajv.validate(this.state.schema, {name:e.target.value});
          if (!valid) {
            
            this.roomname.current.className="form-control border border-danger";
            if(this.state.ajv.errors[0].message =='should match pattern "^[a-zA-Z0-9]{4,10}$"'){
              this.wrrning.current.innerHTML="the name is not valid special character is not allowed"

            }else{
              this.wrrning.current.innerHTML="the name is not valed "+this.state.ajv.errors[0].message

            }
            this.wrrning.current.className="form-text text-danger"
            return
          }

          this.state.socket.emit('IsRommeExist','{"title":"'+e.target.value+'"}',
          (data) => {
            console.log(data)

            if(data.status){
              this.roomname.current.className="form-control border border-success";
              this.setState({IsRommeExist:true})
              this.wrrning.current.innerHTML="the room name is valed"
              this.wrrning.current.className="form-text text-success"

            }else{
              
              this.roomname.current.className="form-control border border-danger";
              this.setState({IsRommeExist:false})
              this.wrrning.current.innerHTML="the name is not valed "+data.room
              this.wrrning.current.className="form-text text-danger"

            }

           })
        }

        saveName(e){
          this.CallBorad.current.click()
            
          this.AddName()

        }

        ifOnline(){
          if(this.state.id == null || this.state.id == null){
            return false
          }else{
            return true
          }
        }

        AddName(e){
         
          if (this.state.isBoxToggleOn){
            this.setState({isBoxToggleOn:false})
          } else{
           this.setState({isBoxToggleOn:true})
          }
         
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

    render() { 
      
        return (
          <nav className="navbar navbar-expand-lg navbar-dark BK-header fixed-top">
            <div className={this.state.isBoxToggleOn ? "" :"blockback"}>
            <Link ref={this.CallBorad} to={`/CallBorad/${this.state.TheRoom}`}  />
        </div>
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
              <ul className="navbar-nav ml-auto ">

                <li className="nav-item  m-1">
                <abbr title="Home">

                <div onClick={()=> document.location.href="/"}>
                <div className=" btn home"></div>
                  </div>
              </abbr>
                </li>

                <li className="nav-item  m-1">
         
         <abbr title="Stream now">
         <Link //  to='/CallBorad'
         onClick={this.AddName}
         >
        <div className="stream "></div>
           </Link>
         </abbr>

             </li>
              </ul>
            </div>
          </div>

              <div className={this.state.isBoxToggleOn ? "modal fade"  : "modal fade show"}
               id="exampleModal" tabindex="-1" 
               role="dialog" aria-labelledby="exampleModalLabel" 
               aria-hidden={this.state.isBoxToggleOn ? "true":""}
              style=
              {this.state.isBoxToggleOn ? {display: 'none'} :
              {display: 'block', paddingRight: '15px'}}
                    >
                <div className="modal-dialog" role="document">
                  <div className="rounded-0 modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title  text-info font-weight-bold" id="exampleModalLabel">Choose name</h5>
                      <button  onClick={this.AddName} type="button" className="close" data-dismiss="modal" aria-label="Close">
                        <span  aria-hidden="true">&times;</span>
                      </button>
                    </div>
                    <div className="modal-body">
                      
                <input 
                ref={this.roomname}
                onChange={this.onchange} type="text"
                className="form-control border"  
                name="" placeholder="Choose name" id=""/>
                <div >
                <small ref={this.wrrning} className="form-text "></small>
                  
                </div>
                    </div>
                    <div className="modal-footer">
                      <div  className=" gradient  border rounded"><button onClick={this.saveName} className="btn text-white font-weight-bold">Save</button></div>
                    </div>
                  </div>
                </div>
              </div>
        </nav>  );
    }
}
 
export default Navbar;