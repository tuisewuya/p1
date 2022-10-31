import { useEffect, useRef, useState } from "react";
import Recorder from "js-audio-recorder";
import { nanoid } from "nanoid";

export type RecorderHook = {
  /** 文件 */
  file?: File;
  /** 是否正在录音 */
  recording: boolean;
  start: () => Promise<any>;
  stop: () => void;
};

export const useRecorder = (): RecorderHook => {
  const [recording, setRecording] = useState(false);
  const recRef = useRef<Recorder>();
  const [file, setFile] = useState<File>();

  const start = async () => {
    if (!recRef.current) return;
    try {
      await recRef.current.start();
      setRecording(true);
    } catch (error) {
      return error;
    }
  };
  const stop = () => {
    if (!recRef.current) return;
    setRecording(false);
    const blob = recRef.current.getWAVBlob() as Blob;
    const id = nanoid();
    setFile(new File([blob], `${id}.wav`, { type: blob.type }));
  };

  useEffect(() => {
    recRef.current = new Recorder();
  }, []);

  return {
    file,
    recording,
    start,
    stop,
  };
};

export default useRecorder;
