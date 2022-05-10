import { useEffect, useState } from "react";

const useRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recorder, setRecorder] = useState(null);
  const [audioBlob, setAudioBlob] = useState();
  const [audio, setAudio] = useState();
  const [cancel, setCancel] = useState(false);

  useEffect(() => {
    if (audioBlob && !cancel) {
      let fileReader = new FileReader();
      fileReader.readAsDataURL(audioBlob);
      fileReader.onloadend = () => {
        let base64String = fileReader.result;
        setAudio(base64String);
      };
    }
  }, [audioBlob, cancel]);

  useEffect(() => {
    if (recorder === null) {
      if (isRecording) {
        requestRecorder().then(setRecorder, console.error);
      }
      return;
    }

    if (isRecording) {
      recorder.start();
    } else {
      recorder.stop();
    }

    const handleData = (e) => {
      setAudioBlob(e.data);
    };

    recorder.addEventListener("dataavailable", handleData);
    return () => recorder.removeEventListener("dataavailable", handleData);
    // eslint-disable-next-line
  }, [recorder, isRecording]);

  const startRecording = () => {
    setIsRecording(true);
  };

  const stopRecording = () => {
    setIsRecording(false);
  };

  const cancelRecording = () => {
    setCancel(true);
    setIsRecording(false);
    setTimeout(() => {
      setAudio(null);
      setAudioBlob(null);
      setCancel(false);
    }, 50);
  };

  return [isRecording, startRecording, stopRecording, audio, cancelRecording];
};

async function requestRecorder() {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
  });
  return new MediaRecorder(stream);
}
export default useRecorder;
