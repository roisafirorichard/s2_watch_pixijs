import React, { Component } from "react";
import ReactDOM from "react-dom";
import * as PIXI from "pixi.js";

import "./styles.css";
class App extends Component {
  app = new PIXI.CanvasRenderer();
  ticker = PIXI.ticker.shared;
  stage = new PIXI.Container();
  // new PIXI.CanvasRenderer();

  drawGear = (stage, gradiant) => {
    let tilingSprite = null;

    let cx = 300, // center x
      cy = 300, // center y
      notches = 140, // num. of notches
      radiusO = 180, // outer radius
      radiusI = 178, // inner radius
      taperO = 20, // outer taper %
      taperI = 80, // inner taper %
      // pre-calculate values for loop

      pi2 = 2 * Math.PI, // cache 2xPI (360deg)
      angle = pi2 / (notches * 2), // angle between notches
      taperAI = angle * taperI * 0.005, // inner taper offset (100% = half notch)
      taperAO = angle * taperO * 0.005, // outer taper offset
      a = angle, // iterator (angle)
      toggle = false; // notch radius level (i/o)
    let ctx = new PIXI.Graphics();
    // move to starting point
    ctx.beginFill(0xdedede);
    ctx.moveTo(
      cx + radiusO * Math.cos(taperAO),
      cy + radiusO * Math.sin(taperAO)
    );

    // loop
    for (; a <= pi2; a += angle) {
      // draw inner to outer line
      if (toggle) {
        ctx.lineTo(
          cx + radiusI * Math.cos(a - taperAI),
          cy + radiusI * Math.sin(a - taperAI)
        );
        ctx.lineTo(
          cx + radiusO * Math.cos(a + taperAO),
          cy + radiusO * Math.sin(a + taperAO)
        );
      } else {
        ctx.lineTo(
          cx + radiusO * Math.cos(a - taperAO), // outer line
          cy + radiusO * Math.sin(a - taperAO)
        );
        ctx.lineTo(
          cx + radiusI * Math.cos(a + taperAI), // inner line
          cy + radiusI * Math.sin(a + taperAI)
        );
      }

      // switch level
      toggle = !toggle;
    }
    ctx.endFill();
    // if (gradiant) {
    //   const texture = PIXI.Texture.fromCanvas(gradiant);
    //   tilingSprite = new PIXI.Sprite(texture);
    // }

    // if (tilingSprite) {
    //   stage.addChild(tilingSprite);
    //   tilingSprite.mask = ctx;
    // }
    // let dashs = drawDash();
    stage.addChild(ctx);
    // stage.addChild(dashs);
    return stage;
  };

  drawDash = () => {
    let cx = 300, // center x
      cy = 300, // center y
      notches = 60, // num. of notches
      radiusO = 151, // outer radius
      radiusI = 145, // inner radius
      radiusII = 140, // inner radius
      radiusIII = 135, // inner radius
      pi2 = 2 * Math.PI, // cache 2xPI (360deg)
      angle = pi2 / notches, // angle between notches
      a = angle; // iterator (angle)
    // notch radius level (i/o)
    let ctx = new PIXI.Graphics();
    // move to starting point
    ctx.lineStyle(1, 0xf3f3f3, 1);
    ctx.moveTo(cx + radiusO * Math.cos(angle), cy + radiusO * Math.sin(angle));
    // loop
    for (; a <= pi2; a += angle) {
      // draw inner to outer line
      if (Math.round(a * (180 / Math.PI)) % 45 === 0) {
        ctx.lineTo(cx + radiusIII * Math.cos(a), cy + radiusIII * Math.sin(a));
      } else if (Math.round(a * (180 / Math.PI)) % 15 === 0) {
        ctx.lineTo(cx + radiusII * Math.cos(a), cy + radiusII * Math.sin(a));
      } else {
        ctx.lineTo(cx + radiusI * Math.cos(a), cy + radiusI * Math.sin(a));
      }
      ctx.moveTo(
        cx + radiusO * Math.cos(a + angle),
        cy + radiusO * Math.sin(a + angle)
      );
    }
    ctx.endFill();

    return ctx;
  };
  gradiant = (ctx, x0, y0, x1, y1, colors) => {
    let gradient = ctx.createLinearGradient(x0, y0, x1, y1);
    // Add three color stops
    for (let a = 0; a <= colors.length - 1; a++) {
      gradient.addColorStop(colors[a].position, colors[a].color);
    }

    // Set the fill style and draw a rectangle
    ctx.fillStyle = gradient;

    return ctx;
  };
  drawClock = (stage, radius) => {
    let canvas = document.getElementById("offcanvas");
    let ctx = canvas.getContext("2d");

    let graphic1 = new PIXI.Graphics();
    let graphic2 = new PIXI.Graphics();
    let grayGrdiant = [
      { color: "#252525", position: 0 },
      { color: "#dedede", position: 1 }
    ];
    graphic1 = this.gradiant(ctx, 0, 0, 500, 500, grayGrdiant);
    stage = this.drawGear(stage, graphic1);
    let innerGrdiant = [
      { color: "#000000", position: 0 },
      { color: "#252525", position: 1 }
    ];
    graphic2 = this.gradiant(ctx, 150, 150, 450, 450, innerGrdiant);
    stage = this.drawFace(stage, 155, 0x252525, graphic2);
    let dashs = this.drawDash();
    stage.addChild(dashs);
    stage = this.drawFace(stage, 132, 0x000000);
    stage = this.drawFace(stage, 132, 0x99ff99);
    stage = this.drawHour(stage, radius);
    // stage = drawBakcground(stage, radius / 3);
    return stage;
  };

  drawFace = (stage, radius, color, gradiant) => {
    let ctx = new PIXI.Graphics();
    ctx.beginFill(color);
    ctx.drawCircle(300, 300, radius);
    ctx.endFill();
    stage.addChild(ctx);
    return stage;
  };

  drawBakcground = (stage, radius) => {
    let ctx = new PIXI.Graphics();
    ctx.beginFill(0xdedede); // Red
    ctx.drawCircle(300, 300, radius);
    ctx.endFill();
    stage.addChild(ctx);
    return stage;
  };
  drawNumbers = (ctx, radius) => {};

  drawHour = (stage, radius) => {
    var now = new Date();
    var hours = now.getHours();
    var minutes = now.getMinutes();
    var seconds = now.getSeconds();
    //hour
    // hour = hour % 12;
    // hour =
    //   (hour * Math.PI) / 6 +
    //   (minute * Math.PI) / (6 * 60) +
    //   (second * Math.PI) / (360 * 60);
    const hourAngle = this.calculateAngle(
      hours + (minutes + seconds / 60) / 60,
      12
    );
    const hourLength = radius * 0.6;

    const minuteAngle = this.calculateAngle(minutes + seconds / 60, 60);
    const minuteLength = radius * 0.8;

    const secondAngle = this.calculateAngle(seconds, 60);
    const secondLength = radius * 0.8;

    stage = this.drawHand(
      stage,
      300,
      300,
      radius / 7,
      hourAngle,
      hourLength,
      radius * 0.07
    );
    //minute
    stage = this.drawHand(
      stage,
      300,
      300,
      radius / 5,
      minuteAngle,
      minuteLength,
      radius * 0.07
    );
    // second
    stage = this.drawHand(
      stage,
      300,
      300,
      radius / 5,
      secondAngle,
      secondLength,
      radius * 0.02
    );
    return stage;
  };
  calculateAngle = (numberOfUnites, limitOfUnit) => {
    return (
      (numberOfUnites * (Math.PI * 2)) / limitOfUnit - (90 * Math.PI) / 180
    );
  };
  drawHand = (stage, centerX, centerY, offset, ang, length, width) => {
    let ctx = new PIXI.Graphics();
    ctx.lineStyle(width, 0xffffff, 1);
    // ctx.lineCap = "round";
    ctx.moveTo(
      centerX - offset * Math.cos(ang),
      centerY - offset * Math.sin(ang)
    );
    ctx.lineTo(
      centerX + length * Math.cos(ang),
      centerY + length * Math.sin(ang)
    );
    ctx.endFill();
    stage.addChild(ctx);
    // app.ticker.add(function (delta) {
    //   console.log('delta', delta);
    // });
    return stage;
  };
  componentDidMount() {
    document.body.appendChild(this.app.view);
    // let ticker = PIXI.Ticker.shared;
    // let stagex = this.drawClock(this.stage, 160);
    // this.app.stage.addChild(stagex);
    // let stagex = this.drawClock(this.stage, 160);
    let stagex = this.drawClock(this.stage, 160);
    // this.app.stage.addChild(stagex);
    this.app.render(stagex);
    this.ticker.add(function(time) {
      console.log("time", time);
      this.app.render(stagex);
    });
  }
  render() {
    // const app = new PIXI.Application();
    // const app = new PIXI.Application();
    // The application will create a canvas element for you that you
    // can then insert into the DOM

    // app.rendere();
    // this.app.render(stagex);
    // this.app.ticker.add(function(delta) {});
    return (
      <div className="App">
        <h1>Watch S2</h1>
        <h2>Start editing to see some magic happen!</h2>
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
