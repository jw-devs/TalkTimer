import "./style.css";
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
      overdrawn: false,
      room: this.props.room,
    };
  }

  componentDidMount() {

    drone = this.props.drone;
    console.log("drone open");
    drone.on('open', (error) => {
      console.log("drone open");
      console.log("ClockRoom:" + this.state.room.toString());
      var room = drone.subscribe(this.state.room.toString());
      console.log(room);
      room.on('open', (error) => {

        console.log("Room open");

        if (error) return console.error(error);
      });
      room.on('data', (data) => {
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
    this.setState({ running: false, time: 0 });
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

  isOverdrawn(t){
    if (t < 0){
      return true
    }else{
      return false;
    }
  }

  render() {

      let vorzeichen = "";
      let status = "";
      if (this.isOverdrawn(this.state.time)){
        status = "overdrawn";
      }

      return (
        <div className={"clock " + status}>
          <span className="time color-white">{ this.secondsToHms(this.state.time) }</span>
        </div>
      );
  }
}
