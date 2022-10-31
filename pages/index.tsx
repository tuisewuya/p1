import type { NextPage } from "next";
import styles from "../styles/Home.module.scss";
import TransferCard from "components/transfer-card";
import ChameleonText from "components/chameleon-text";
import { useEffect, useRef, useState } from "react";
import Recorder from "js-audio-recorder";

const list = [0, 1, 2, 3, 4];

const Content = () => {
  const [range, setRange] = useState(0);
  const [recording, setRecording] = useState(false);
  const recorderRef = useRef<Recorder>();
  const [blobUrl, setBlobUrl] = useState<string>();

  const handlePlay = () => {
    const audio = new Audio(blobUrl);
    audio.addEventListener("timeupdate", (e) => {
      if (audio.duration === Infinity || isNaN(audio.duration)) return;
      const radio =
        audio.currentTime !== 0
          ? (audio.currentTime * 100) / audio.duration
          : 0;
      setRange(Math.round(radio));
    });
    audio.play();
  };

  const handleStart = () => {
    if (!recorderRef.current) return;
    setRecording(true);
    recorderRef.current.start().then(
      () => {
        // 开始录音
      },
      (error) => {
        // 出错了
        console.log(`${error.name} : ${error.message}`);
      }
    );
  };
  const handleStop = () => {
    if (!recorderRef.current) return;
    setRecording(false);
    const blob = recorderRef.current.getWAVBlob();
    const blobUrl = URL.createObjectURL(blob);
    setBlobUrl(blobUrl);
  };

  const handleDown = () => {
    if (blobUrl) {
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = "audio.mp3";
      a.click();
    }
  };

  useEffect(() => {
    recorderRef.current = new Recorder();
  }, []);

  return (
    <div className={styles.content}>
      <div className={styles.bottomBar}>
        <div className={styles.audio}>
          {recording ? (
            <button type="button" disabled={!recording} onClick={handleStop}>
              停止录音
            </button>
          ) : (
            <button type="button" disabled={recording} onClick={handleStart}>
              开始录音
            </button>
          )}
          <button type="button" disabled={!blobUrl} onClick={handlePlay}>
            播放
          </button>
          <button type="button" onClick={handleDown}>
            下载
          </button>
        </div>
      </div>
      <div className={styles.ratio}>
        <input type="range" value={range} onChange={() => null} />
        {range}
      </div>
      <div style={{ flex: 1, overflow: "hidden" }}>
        <ChameleonText ratio={range} targetRGB={[255, 0, 51]}>
          啊波次的额
        </ChameleonText>
      </div>
    </div>
  );
};

const Home: NextPage = () => {
  return (
    <div>
      <main className={styles.main}>
        <TransferCard
          width="100%"
          height="100%"
          list={list}
          itemKey={(item) => item.toString()}
        >
          {() => <Content />}
        </TransferCard>
      </main>
    </div>
  );
};

export default Home;
