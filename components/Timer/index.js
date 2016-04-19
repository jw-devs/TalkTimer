import "./index.css";
import React, { Component } from "react";
import SimplePeer from "simple-peer";
import Clock from "../Clock"
import cookie from 'react-cookie';

let drone = new ScaleDrone('hEEcTJ0uLuROW3Wt');

export default class Timer extends Component {
  constructor(props) {
  super(props);

  this.state = {
    kennung: null,
    room: null
  };
}


  componentDidMount() {
    let room =  cookie.load('room');
    if (room){
      this.setState({ room: room.toString() });
    }
  }

  getKennung(){

    if (this.state.kennung !== null && this.state.kennung.length == 6){
      this.setState({ room: this.state.kennung.toString() });
      cookie.save('room', this.state.kennung, { path: '/', maxAge: (3600 * 24 * 365 * 10) });
      location.reload();
    }

  }

  resetRoom(){
    console.log("resetRoom");
    if (confirm("Möchtest du wirklich die Kennung '" + this.state.room + "' verlassen?")){
      this.setState({ room: null });
      cookie.save('room', null, { path: '/', maxAge: (3600 * 24 * 365 * 10) });
    }
  }




  render() {

      let content;
      if (this.state.room){
        content = (<div className="timer">
          <Clock room={ this.state.room } drone={ drone } />
          <button class="setting" type="button" onClick={ ::this.resetRoom }>Raum verlassen</button>
          </div>
        );
      }else{
        content = (<div className="timer">
        <p>Bitte 6 stellige Kennung eingeben:</p>
        <input className="kennung" type="tel" name="kennung" min="1000000" max="9999999" placeholder="000000" onChange={event => this.setState({ kennung: event.target.value })} />
        <div onClick={ ::this.getKennung } className="buttonOkay"><span>Okay</span></div>
        </div>);
      }

      return (
        <main>
          {content}
        </main>
      );
  }
}
