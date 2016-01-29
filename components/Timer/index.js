import "./index.css";
import React, { Component } from "react";
import SimplePeer from "simple-peer";
import Clock from "../Clock"

let drone = new ScaleDrone('hEEcTJ0uLuROW3Wt');

export default class Timer extends Component {



  componentDidMount() {

    console.log("INIT");

    drone.on('open', function (error) {


    });

  }



  render() {

      return (
        <main>
          <div className="timer">
            <Clock drone={ drone } />
          </div>
        </main>
      );
  }
}
