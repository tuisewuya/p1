import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.scss";
import TransferCard from "components/transfer-card";
import ChameleonText from "components/chameleon-text";
import { SyntheticEvent, useEffect, useRef, useState } from "react";
import VoiceRecorder from "utils/VoiceRecorder";

const list = [0, 1, 2, 3, 4];

const Content = () => {
  const [range, setRange] = useState(0);
  const [audioBlobChunks, setAudioBlobChunks] = useState<Blob[]>();
  const [recording, setRecording] = useState(false);
  // const blobUrl = VoiceRecorder.createBlobUrl(audioBlobChunks);
  const recorderRef = useRef<VoiceRecorder>();
  const [blobUrl, setBlobUrl] = useState<string>();

  const handlePlay = () => {
    const audio = new Audio(blobUrl);
    audio.addEventListener("loadeddata", () => {
      console.log(audio.duration);
    });
  };

  useEffect(() => {
    VoiceRecorder.create({
      onStop: (blobChunks) => setAudioBlobChunks(blobChunks),
    }).then((recorder) => {
      recorderRef.current = recorder;
    });
  }, []);

  const handleStart = () => {
    if (!recorderRef.current) return;
    setRecording(true);
    recorderRef.current.start();
  };
  const handleStop = () => {
    if (!recorderRef.current) return;
    setRecording(false);
    recorderRef.current.stop();
  };

  const handleDown = () => {
    if (blobUrl) {
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = "audio.mp3";
      a.click();
    }
  };

  return (
    <div className={styles.content}>
      <div className={styles.bottomBar}>
        <div>
          <input type="range" value={range} onChange={() => null} />
          {range}
        </div>
        <div className={styles.audio}>
          <button type="button" disabled={recording} onClick={handleStart}>
            录音
          </button>
          <button type="button" disabled={!recording} onClick={handleStop}>
            停止
          </button>
          <button type="button" onClick={handlePlay}>
            播放
          </button>
          <button type="button" onClick={handleDown}>
            下载
          </button>
        </div>
      </div>
      <div>{blobUrl}</div>
      <audio src={blobUrl} controls />

      <div style={{ flex: 1, overflow: "hidden" }}>
        <ChameleonText ratio={range} targetRGB={[255, 0, 51]}>
          啊波次的额
        </ChameleonText>
      </div>
    </div>
  );
};

const Home: NextPage = () => {
  const [h, setH] = useState(0);
  useEffect(() => {
    setH(window.innerHeight);
  }, []);

  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

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
