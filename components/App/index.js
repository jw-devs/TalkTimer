import "./index.css";
import React, { Component } from "react";
import SimplePeer from "simple-peer";
import Clock from "../Clock"
import cookie from 'react-cookie';

let drone = new ScaleDrone('hEEcTJ0uLuROW3Wt');

export default class App extends Component {
    constructor(props) {
    super(props);

    let room = cookie.load('room');
    if (!room){
      room = Math.floor(Math.random() * 900000) + 100000
      cookie.save('room', room, { path: '/', maxAge: (3600 * 24 * 365 * 10) });
    }

    this.state = {
      running: false,
      room: room.toString()
    };
  }

  componentDidMount() {
    console.log("APP INIT");
    drone.on('open', (error) =>  {
      console.log("Drone open", error);
      console.log("RoomID: " + this.state.room);
    });
  }

  submitAddTime(time){
    drone.publish({
      room: this.state.room,
      message: {type: 'add_time', time: time}
    });
  }

  submitSetTime(time){
    drone.publish({
      room: this.state.room,
      message: {type: 'time', time: time}
    });
  }

  setZero(){
    this.submitSetTime(0);
  }

  add10s(){
    this.submitAddTime(10);
  }

  add30s(){
    this.submitAddTime(30);
  }

  add1m(){
    this.submitAddTime(60);
  }

  add5m(){
    this.submitAddTime(60 * 5);
  }

  add10m(){
    this.submitAddTime(60 * 10);
  }

  submitStart(){
    drone.publish({
      room: this.state.room,
      message: {type: 'start'}
    });
  }

  submitStop(){
    drone.publish({
      room: this.state.room,
      message: {type: 'stop'}
    });
  }

  submitPause(){
    drone.publish({
      room: this.state.room,
      message: {type: 'pause'}
    });
  }


  render() {

      let control_button = <div className="timeStart buttonGreen" onClick={ ::this.submitStart }><span>Start</span></div>;
      if (this.state.running){
        control_button = <div className="timeStart buttonBlue" onClick={ ::this.submitStop }><span>Stopp</span></div>;
      }

      return (
        <main>
          <div>
            <div className="controller">
              <Clock drone={ drone } room={ this.state.room } onStart={ (event) => this.setState({ running: true }) } onStop={ (event) => this.setState({ running: false }) }/>
              <ul>
                <li className="timeButton buttonRed" onClick={::this.setZero}><span>0s</span></li>
                <li className="timeButton buttonRed" onClick={::this.add10s}><span>+10s</span></li>
                <li className="timeButton buttonRed" onClick={::this.add30s}><span>+30s</span></li>
                <li className="timeButton buttonRed" onClick={::this.add1m}><span>+1m</span></li>
                <li className="timeButton buttonRed" onClick={::this.add5m} ><span>+5m</span></li>
                <li className="timeButton buttonRed" onClick={::this.add10m}><span>+10m</span></li>
              </ul>
              { control_button }
              <div className="roomID">
                <p>Kennung</p>
                <span>{ this.state.room }</span>
              </div>
            </div>
          </div>
        </main>
      );
  }
}
