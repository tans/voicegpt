import 'babel-polyfill'
import { ReactMic } from "@cleandersonlobo/react-mic";
import React from "react";
import { LongPressDetectEvents, useLongPress } from "use-long-press";
import { Howl, Howler } from "howler";
import ClickNHold from "react-click-n-hold";


// import { Wave } from '@foobar404/wave';

// function initWave() {
//   let audioElement = document.querySelector('#audioElmId');
//   let canvasElement = document.querySelector('#canvasElmId');
//   let wave = new Wave(audioElement, canvasElement);

//   // Simple example: add an animation
//   wave.addAnimation(new wave.animations.Wave());

//   // Intermediate example: add an animation with options
//   wave.addAnimation(
//     new wave.animations.Wave({
//       lineWidth: 10,
//       lineColor: 'red',
//       count: 20,
//     })
//   );

//   // Expert example: add multiple animations with options
//   wave.addAnimation(
//     new wave.animations.Square({
//       count: 50,
//       diamater: 300,
//     })
//   );

//   wave.addAnimation(
//     new wave.animations.Glob({
//       fillColor: { gradient: ['red', 'blue', 'green'], rotate: 45 },
//       lineWidth: 10,
//       lineColor: '#fff',
//     })
//   );
// }
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      record: false,
    };
    let pm = navigator.mediaDevices.getUserMedia({
      audio: true,
    });
    pm.then();

    // initWave();
  }

  startRecording = () => {
    document.getElementById("tips").innerText = "请说";
    this.setState({ record: true });
  };
  stopRecording = () => {
    document.getElementById("tips").innerText = "接受处理中";
    this.setState({ record: false });
  };

  onData(recordedBlob) {
    console.log("chunk of real-time data is: ", recordedBlob);
  }

  onStop(recordedBlob) {
    // const blob = new Blob([arrayBuffer], { type: "audio/wav" });
    console.log(recordedBlob);
    this.setState({ record: false });
    (async () => {
      let res = await fetch("/api/talk", {
        method: "POST",
        body: recordedBlob.blob,
      });
      // let blob = await res.blob();

      try {

      }catch(e){

      let buf = await res.arrayBuffer();

      const blobUrl = [
        URL.createObjectURL(new Blob([buf], { type: "audio/mp3" })),
      ];
      let item = new Howl({
        src: blobUrl,
        format: ["mp3"],
        html5: true,
        volume: 1,
      });

      item.play();
    }

      document.getElementById("tips").innerText = "按住说话";
      // const url = window.URL.createObjectURL(buf, {
      //   type: 'audio/mp3',
      // });

      // var sound = new Howl({
      //   src: [url],
      //   html5: true,
      // });
      // sound.play();

      // let audio = document.createElement('audio');
      // audio.srcObject = buf;
      // audio.play();
    })().then();
  }

  render() {
    return (
      <div>
        <ReactMic
          record={this.state.record}
          className="sound-wave"
          onStop={this.onStop}
          onData={this.onData}
          strokeColor="red"
          mimeType="audio/wav"
          width="320"
          backgroundColor="#FFFFFF"
        />

        <div style={{ "text-align": "center" }}>
          <ClickNHold onStart={this.startRecording} onEnd={this.stopRecording}>
            <div id="tips">按住说话</div>
          </ClickNHold>
        </div>
      </div>
    );
  }
}
