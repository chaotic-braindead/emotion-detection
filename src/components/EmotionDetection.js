import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import * as faceapi from 'face-api.js';
import WebcamCapture from './WebcamCapture';

let lastIdx;
let statusIcons = {
  neutral: { emoji: '😐', color: '#54adad' },
  happy: { emoji: '😀', color: '#148f77' },
  sad: { emoji: '😥', color: '#767e7e' },
  angry: { emoji: '😠', color: '#b64518' },
  disgusted: { emoji: '🤢', color: '#1a8d1a' },
  surprised: { emoji: '😲', color: '#1230ce' },
}
let emojis = Object.keys(statusIcons);

function EmotionDetection() {
  const time = 30;
  const [isStarted, setIsStarted] = useState(false);
  const [timer, setTimer] = useState(time);
  const navigate = useNavigate();

  const [emotion, setEmotion] = useState("No emotion detected.");
  const [points, setPoints] = useState(0);

  const getRandomEmotion = () => {
    let randint
    do{
        randint = Math.floor(Math.random() * emojis.length)
    } while(randint === lastIdx)
    lastIdx = randint;
    let emoji = emojis[randint]
    return emoji;
  }

  const [emotionToCopy, setEmotionToCopy] = useState(getRandomEmotion()); 

  const loadModels = async () => {
    await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
    await faceapi.nets.faceExpressionNet.loadFromUri('/models');
    await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
  };

  useEffect(() => {
    if(!isStarted){
        return;
    }
    if(timer === -1){
        navigate('/gameover', { state: { score: points } })
    }
    else{
        setTimeout(() => {
        setTimer((timer) => timer - 1);
        }, 1000);
    }
  }, [isStarted, timer]);
  
 
  const handleCapture = async (videoElement) => {
    if(!isStarted)
      setIsStarted(true);

    if (!videoElement) return;
    await loadModels();

    const detections = await faceapi.detectAllFaces(videoElement, new faceapi.TinyFaceDetectorOptions())
      .withFaceExpressions()

    if(detections.length === 0){
        setEmotion("No emotion detected ❌. Try again!")
        return;
    }
    const maxExpression = Object.entries(detections[0].expressions).reduce((max, [expression, confidence]) => {
    return confidence > max.confidence ? { expression, confidence } : max;
    }, { expression: null, confidence: 0 });

    setEmotion(maxExpression.expression + statusIcons[maxExpression.expression].emoji);
    if(emotionToCopy === maxExpression.expression){
    setPoints((points) => points + 1)
    }
    setEmotionToCopy(getRandomEmotion());
  };
  const onPass = () => {
    if(!isStarted)
      setIsStarted(true);
    setEmotionToCopy(getRandomEmotion());
  }
  return (
    <>
      <div id="points">
          <h3>Points: {points}</h3>
      </div>
      <div> 
        <h3>{timer}</h3>
        <div id="copy-emotion">
          <h3>Copy this emotion</h3>
          <h1>{(`${emotionToCopy} ${statusIcons[emotionToCopy].emoji}`).toUpperCase()}</h1>
        </div>
        <WebcamCapture onCapture={handleCapture}  onPass={onPass}/>
        <div id="your-emotion">
          <h2>Your Emotion: {emotion}</h2>
        </div>
      </div>
    </>
  );
};

export default EmotionDetection;
