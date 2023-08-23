import { useEffect, useState } from "react";
import {
  SpeechConfig,
  AudioConfig,
  SpeechRecognizer,
  ResultReason,
} from "microsoft-cognitiveservices-speech-sdk";

// Configs
const speechConfig = SpeechConfig.fromSubscription(
  "a653c6ef0384423db1680447b9a74c8c",
  "eastus"
);
const audioConfig = AudioConfig.fromDefaultMicrophoneInput();
const speechRecognizer = new SpeechRecognizer(speechConfig, audioConfig);

export default function SpeechToTextBasic() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");

  useEffect(() => {
    // When component is mounted, setup the recognizer

    // Subscribe to events
    speechRecognizer.recognized = (s, e) => {
      if (e.result.reason == ResultReason.RecognizedSpeech) {
        setTranscript((prev) => prev + " " + e.result.text);
      }
    };
  }, []);

  const startRecording = () => {
    // Start recognition
    speechRecognizer.startContinuousRecognitionAsync();

    setIsRecording(true);
  };

  const stopRecording = () => {
    // Stop recognition
    speechRecognizer.stopContinuousRecognitionAsync();
    
    setIsRecording(false);
  };

  const clearTranscript = () => {
    setTranscript("");
  };

  return (
    <div className="w-full px-10 py-5">
      <h2 className="text-2xl font-semibold">Speech To Text</h2>
      {!isRecording ? (
        <button className="btn btn-primary" onClick={startRecording}>
          Start Recording
        </button>
      ) : (
        <button className="btn btn-error" onClick={stopRecording}>
          Stop Recording
        </button>
      )}
      <button className="btn btn-secondary ml-3" onClick={clearTranscript}>
        Clear Transcript
      </button>

      <div className="w-full">
        <h3>Transcript:</h3>
        <div className="chat chat-start">
          <div className="chat-bubble chat-bubble-accent">{transcript}</div>
        </div>
      </div>
    </div>
  );
}
