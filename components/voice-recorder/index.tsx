import React, { ReactNode, useEffect, useRef } from "react";

export type VoiceRecorderProps = {
  className?: string;
  children: ReactNode;
  onCaptureOver: (audioBlob: Blob) => void;
};

const VoiceRecorder = (props: VoiceRecorderProps) => {
  const { onCaptureOver, children, className } = props;
  const mediaRecorderRef = useRef<MediaRecorder>();
  const mediaChunksRef = useRef<Blob[]>([]);

  const captureOver = (blobChunks: Blob[]) => {
    const blob = new Blob(blobChunks);
    onCaptureOver(blob);
  };

  const init = async () => {
    const audioStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });
    const mediaRecorder = new MediaRecorder(audioStream);
    mediaRecorder.addEventListener("dataavailable", (e) => {
      const { data } = e;
      mediaChunksRef.current.push(data);
    });
    mediaRecorder.addEventListener("stop", (e) => {
      captureOver(mediaChunksRef.current);
    });
    mediaRecorderRef.current = mediaRecorder;
  };

  useEffect(() => {
    init();
  }, []);

  const handleMouseDown = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.start();
    }
  };

  const handleMouseUp = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
  };

  return (
    <div
      className={className}
      onTouchStart={handleMouseDown}
      onTouchEnd={handleMouseUp}
    >
      {children}
    </div>
  );
};

export default VoiceRecorder;
