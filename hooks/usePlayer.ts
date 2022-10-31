import { useEffect, useRef, useState } from "react";

type PlayerHook = {
  radio: number;
  playing: boolean;
  play: (file: File | Blob) => void;
};

export const usePlayer = (): PlayerHook => {
  const [playing, setPlaying] = useState(false);
  const [radio, setRadio] = useState(0);
  const audioRef = useRef<HTMLAudioElement>();

  useEffect(() => {
    audioRef.current = new Audio();
  }, []);

  const play = (file: File | Blob) => {
    setPlaying(true);
    if (!file) return;
    const url = URL.createObjectURL(file);
    const audio = audioRef.current ?? new Audio();
    audio.src = url;
    audio.addEventListener("timeupdate", (e) => {
      if (audio.duration === Infinity || isNaN(audio.duration)) return;
      console.log("playing");
      const radio =
        audio.currentTime !== 0
          ? (audio.currentTime * 100) / audio.duration
          : 0;
      setRadio(Math.round(radio));
    });
    audio.addEventListener("playing", () => {
      setPlaying(true);
    });
    audio.addEventListener("ended", () => {
      setPlaying(false);
    });
    audio.play();
  };

  return {
    radio,
    playing,
    play,
  };
};

export default usePlayer;
