import "./style.css";
import React, { Component } from "react";

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
      realtime: this.milliseconds(),
      realClock: this.getRealClock(),
    };
  }

  milliseconds(){
    var d = new Date();
    return d.getTime();
  }

  componentDidMount() {
    drone = this.props.drone;

    drone.on('open', (error) => {

      var room = drone.subscribe(this.state.room.toString());

      room.on('open', (error) => {

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
    this.setState({ running: true, overdrawn: false, realtime: this.milliseconds() });
    this.tick();
    this.props.onStart();
  }

  stopCountdown(){
    this.setState({ running: false, time: 0, realtime: this.milliseconds() });
    this.props.onStop();
  }

  tick(){
    if (this.state.running == true){
    let newtime;
    newtime = this.state.time - 1;

    let dif = (this.milliseconds() - this.state.realtime);
    if (dif >= 2000){
      Math.round(newtime = newtime - (dif / 1000));
    }

    this.setState({ time: newtime, realtime: this.milliseconds() });

      setTimeout(function() {
        this.tick();
      }.bind(this), 1000);
    }
  }

  tickClock(){
    this.setState({realClock: this.getRealClock()});
    if (this.state.touch){
      setTimeout(function() {
        this.tickClock();
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

  getRealClock(){
    var currentTime = new Date();
    var hours = currentTime.getHours();
    var minutes = currentTime.getMinutes();
    var seconds = currentTime.getSeconds();
    return hours + ":" + minutes + ":" + seconds;
  }

  isOverdrawn(t){
    if (t < 0){
      return true
    }else{
      return false;
    }
  }

  touchStart(){
    this.setState({ touch: true }, () => {
      this.tickClock();
    });
  }

  touchEnd(){
    this.setState({ touch: false });
  }

  render() {

      let vorzeichen = "";
      let status = "";
      if (this.isOverdrawn(this.state.time)){
        status = "overdrawn";
      }

      let content = (<div className={"clock " + status}>
          <span className="time color-white">{ this.secondsToHms(this.state.time) }</span>
        </div>);

      if (this.state.touch){
        content = (<div className={"clock realClock"}>
          <span className="time">{ this.state.realClock }</span>
        </div>);
      }

      return (
        <div className="wrapper" onTouchStart={() => this.touchStart()} onTouchEnd={() => this.touchEnd()}>
          {content}
        </div>
      );
  }
}
