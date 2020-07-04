
import React, { Component } from 'react';
import io from "socket.io-client";
import { Redirect } from 'react-router';
import 'react-toastify/dist/ReactToastify.css';

class Body extends Component {

    constructor(props){
        super(props)
        this.state={
          GoToCallRoom:false,
          TheRoom:'',
            socket : io('http://192.168.8.102:6800'),
            Rooms:null
        }
         
        this.ShowRooms = this.ShowRooms.bind(this);
        this.if3 = this.if3.bind(this);
        this.CallRoom = React.createRef();
        this.join = this.join.bind(this);

   

    }
     arrayTo2DArray2(list, howMany) {
        var idx = 0
       var result = []
      
        while (idx < list.length) {
          if (idx % howMany === 0) result.push([])
          result[result.length - 1].push(list[idx++])
        }
      
        return result
      }
          
        componentWillMount(){
    
            console.log('componentWillMount')
          this.state.socket.emit('getroom','mainrrom',
          (data) => { 
            this.setState({Rooms:data})
            console.log(data)
        })
        }
        if3(cnt,el){
            if(cnt==2){
                return el;
            }
        }

                join(e){
                  var rromid =    e.target.id;
                  console.log(rromid)
                        this.setState(
                      {TheRoom:rromid,
                        GoToCallRoom:true

                    })
                    console.log(this.state.TheRoom)
                    return
                }

    ShowRooms(){
      if(this.state.Rooms==null){
          return
      }
 var  roomgroup =  this.arrayTo2DArray2(this.state.Rooms,3)
 console.log(roomgroup)
 console.log(this.state.Rooms)
 return roomgroup.map(romg => <div key={romg} className="row  justify-content-md-center">
    {romg.map(room =><div onClick={this.join}  key={room} className="col-xs-6 col-md-4 btn">
      <div id={room} className=" mov Vd-box "
       style={{width:'280px',height:'200px', backgroundImage: "url(http://192.168.8.102:6800/imges/"+room+".png)"}} >
         <span className=" badge badge-danger">LIVE</span>
         </div>
         </div>
     
         )}
         </div> )
    } 


  
    render() { 

      if(this.state.GoToCallRoom){
           
        return <Redirect to={`/CallRoom/${this.state.TheRoom}`} />;
      
    }
        return ( 
            <React.Fragment>
            <br></br>        
            <br></br> 
            <br></br> 

            <div className="container  mt-3 justify-content-md-center ">
             
            

            {this.ShowRooms()}
            
         
            </div>
          </React.Fragment>
       );
    }





  }
 
export default Body;