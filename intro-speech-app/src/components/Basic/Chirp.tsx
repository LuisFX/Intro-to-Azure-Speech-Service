import React, { useState, useEffect } from 'react';
import * as SpeechSDK from 'microsoft-cognitiveservices-speech-sdk';

function AntidoteChirp() {
  const [lastRecognized, setLastRecognized] = useState('');
  const [authorizationToken, setAuthorizationToken] = useState('');
  const [speechConfig, setSpeechConfig] = useState();
  const [transcriber, setTranscriber] = useState(null);
  const [isTranscribing, setIsTranscribing] = useState(false);

  useEffect(() => {
    const subscriptionKey = 'a653c6ef0384423db1680447b9a74c8c'; // Replace with your subscription key
    const serviceRegion = 'eastus'; // Replace with your service region

    // Assuming you have a function to get the authorization token
    const requestAuthorizationToken = async () => {
      const response = await fetch('token.php'); // Replace with your token endpoint
      const tokenData = await response.json();
      setAuthorizationToken(tokenData.token);
    };

    if (authorizationToken) {
      const config = SpeechSDK.SpeechConfig.fromAuthorizationToken(
        authorizationToken,
        serviceRegion
      );
      setSpeechConfig(config);
    } else {
      const config = SpeechSDK.SpeechConfig.fromSubscription(
        subscriptionKey,
        serviceRegion
      );
      setSpeechConfig(config);
    }

    if (typeof requestAuthorizationToken === 'function') {
      requestAuthorizationToken();
    }
  }, [authorizationToken]);

  const startTranscribing = async () => {
    setIsTranscribing(true);

    const audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
    const newTranscriber = new SpeechSDK.ConversationTranscriber(
      speechConfig,
      audioConfig
    );

    newTranscriber.sessionStarted = (s, e) => {
      console.log(e);
    };

    newTranscriber.transcribed = (s, e) => {
      console.log(e);

      if (e.result.reason === SpeechSDK.ResultReason.NoMatch) {
        console.log(
          `(transcribed) Reason: ${SpeechSDK.ResultReason[e.result.reason]}`
        );
      } else {
        console.log(`(transcribed) Text: ${e.result.text}`);
        setLastRecognized((prevRecognized) =>
          prevRecognized + e.result.text + '\r\n'
        );
      }
    };

    await newTranscriber.startTranscribingAsync();
    setTranscriber(newTranscriber);
  };

  const stopTranscribing = async () => {
    if (transcriber) {
      await transcriber.stopTranscribingAsync();
      transcriber.close();
      setTranscriber(null);
      setIsTranscribing(false);
    }
  };

  return (
    <div style={{ fontFamily: 'Helvetica Neue', fontSize: '13px' }}>
      <div id="warning">
        <h1 style={{ fontWeight: 500 }}>SDK not found.</h1>
      </div>

      <div id="content" style={{ display: 'none' }}>
        {/* ... rest of the JSX */}
        <select id="languageOptions">
          {/* ... language options */}
        </select>
        <button
          id="startTranscriberButton"
          onClick={startTranscribing}
          disabled={isTranscribing}
        >
          Start
        </button>
        <button
          id="stopTranscriberButton"
          onClick={stopTranscribing}
          disabled={!isTranscribing}
        >
          Stop
        </button>
        {/* ... rest of the JSX */}
        <textarea
          id="phraseDiv"
          style={{ display: 'inline-block', width: '500px', height: '200px' }}
        ></textarea>
        {/* ... rest of the JSX */}
        <textarea
          id="resultDiv"
          style={{ display: 'inline-block', width: '500px', height: '100px' }}
        ></textarea>
        {/* ... rest of the JSX */}
      </div>

      {/* ... rest of the JSX */}
    </div>
  );
}

export default AntidoteChirp;
