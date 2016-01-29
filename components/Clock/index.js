import React, { Component } from "react";
import SimplePeer from "simple-peer";

let drone;
let TickTack;


export default class Clock extends Component {
  constructor(props) {

  super(props);

    this.state = {
      time: 0,
      running: false,
      overdrawn: false
    };
  }

  componentDidMount() {

    console.log("Clock init");

    drone = this.props.drone;

    drone.on('open', (error) => {

      var room = drone.subscribe('versi01');
      room.on('open', (error) => {
        if (error) return console.error(error);
      });
      room.on('data', (data) => {
        console.log(data);
        if (data.type == "time"){
          this.setState({ time: data.time });
        }else if (data.type == "add_time"){

          let time = this.state.time + data.time
          this.setState({ time: time });

        }else if(data.type == "start"){
          this.startCountdown();
        }else if(data.type == "stop"){
          this.stopCountdown();
        }else if(data.type == "pause"){
        }
      });
    });

  }

  startCountdown(){
    this.setState({ running: true, overdrawn: false });
    this.tick();
    this.props.onStart();
  }

  stopCountdown(){
    this.setState({ running: false });
    this.props.onStop();
  }

  tick(){
    if (this.state.running == true){
    let newtime;
    newtime = this.state.time - 1;

    this.setState({ time: newtime });
    console.log(newtime);

      setTimeout(function() {
        this.tick();
      }.bind(this), 1000);
    }
  }

  secondsToHms(d) {
    let overdrawn = false;
    if (d < 0){
      d = d * -1
      overdrawn = true;
    }
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);
    return ((overdrawn ? "+" : "") + (h > 0 ? h + ":" + (m < 10 ? "0" : "") : "") + m + ":" + (s < 10 ? "0" : "") + s);
  }

  render() {

      let vorzeichen = "";
      if (this.state.overdrawn){
        vorzeichen = "+";
      }

      return (

        <div className="clock">
          <span className="time">{vorzeichen}{ this.secondsToHms(this.state.time) }</span>
        </div>

      );
  }
}
