import { useEffect, useState } from "react";
import SpeechToText from "./components/Proper/SpeechToText";
import TextToSpeech from "./components/Proper/TextToSpeech";
import SpeechToTextBasic from "./components/Basic/SpeechToTextBasic";
import TextToSpeechBasic from "./components/Basic/TextToSpeechBasic";
import AntidoteChirp from "./components/Basic/Chirp";

export type SpeechOptions = {
  speechKey: string;
  speechRegion: string;
};

// The simplest setup
const AppBasic = () => {
  return (
    <main className="flex min-h-screen w-full flex-col justify-between px-4 py-24 mx-auto prose">
      <h1 className="text-center">Intro to Speech Service</h1>
      <SpeechToTextBasic />
      <TextToSpeechBasic />
      <AntidoteChirp />
    </main>
  );
};

// The proper setup
const App = () => {
  const [speechOptions, setSpeechOptions] = useState<SpeechOptions>({
    speechKey: "a653c6ef0384423db1680447b9a74c8c",
    speechRegion: "eastus",
  });

  useEffect(() => {
    // top level await to fetch speech configs
    (async function () {
      const { token, region } = await (
        await fetch(`/api/getSpeechConfigs`)
      ).json();
      setSpeechOptions({ speechKey: token, speechRegion: region });
    })();
  }, []);

  return (
    <main className="flex min-h-screen w-full flex-col justify-between px-4 py-24 mx-auto prose">
      <h1 className="text-center">Intro to Speech Service</h1>
      <SpeechToTextBasic />
      <TextToSpeechBasic />
      <AntidoteChirp />
    </main>
  );
};

export default App;
