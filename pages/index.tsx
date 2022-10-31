import ChameleonText from "components/chameleon-text";
import TransferCard from "components/transfer-card";
import useRecorder from "hooks/useRecorder";
import type { NextPage } from "next";
import styles from "../styles/Home.module.scss";
import usePlayer from "hooks/usePlayer";

const list = [0, 1, 2, 3, 4];

const Content = () => {
  const { recording, file, start, stop } = useRecorder();
  const { radio, play } = usePlayer();

  const handlePlay = () => {
    if (!file) return;
    play(file);
  };

  const handleStart = () => {
    console.log("start");
    start();
  };

  const handleStop = () => {
    console.log("stop");
    stop();
  };

  return (
    <div className={styles.content}>
      <div className={styles.bottomBar}>
        <div className={styles.audio}>
          {recording ? (
            <button type="button" disabled={!recording} onClick={stop}>
              停止录音
            </button>
          ) : (
            <button type="button" disabled={recording} onClick={start}>
              开始录音
            </button>
          )}
          <button
            type="button"
            onTouchStart={handleStart}
            onTouchEnd={handleStop}
          >
            录音
          </button>
          <button type="button" disabled={!file} onClick={handlePlay}>
            播放
          </button>
        </div>
      </div>
      <audio></audio>
      <div className={styles.ratio}>
        <input type="range" value={radio} onChange={() => null} />
      </div>
      <div style={{ flex: 1, overflow: "hidden" }}>
        <ChameleonText ratio={radio} targetRGB={[255, 0, 51]}>
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
