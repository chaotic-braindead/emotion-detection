import React, { useRef, useEffect } from 'react';
function WebcamCapture({ onCapture, onPass }){
  const enterOnClick = () => {
    onCapture(videoRef.current)
  }
  const videoRef = useRef(null);

  useEffect(() => {
    const getVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;
      } catch (err) {
        console.error("Error accessing webcam:", err);
      }
    };

    getVideo();
  }, []);

  return (
    <div id="video">
      <video ref={videoRef} width="640" height="480" autoPlay />
      <button onClick={onPass}>Pass</button>
      <button onClick={enterOnClick}>Capture Emotion</button>
    </div>
  );
};

export default WebcamCapture;