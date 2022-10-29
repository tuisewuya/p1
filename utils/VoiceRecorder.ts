type HandleStart = () => void;
type HandleStop = (blobChunks: Blob[]) => void;

type Options = {
  onStart?: HandleStart;
  onStop?: HandleStop;
};

class VoiceRecorder {
  private static async createRecorder() {
    const mediaStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });
    return new MediaRecorder(mediaStream, {
      mimeType: "video/webm;codecs=vp8",
    });
  }

  public static createBlobUrl(blobChunks?: Blob[]) {
    if (!blobChunks || blobChunks.length < 1) return undefined;
    // const file = new File(blobChunks, "audio.webm", {
    //   type: "audio/webm",
    // });
    const file = new Blob(blobChunks, {
      type: "audio/webm",
    });
    return URL.createObjectURL(file);
  }

  public static async create(options?: Options) {
    const recorder = await this.createRecorder();
    return new VoiceRecorder(recorder, options);
  }

  private recorder: MediaRecorder;
  private blobChunks: Blob[] = [];

  private constructor(recorder: MediaRecorder, options?: Options) {
    this.recorder = recorder;
    recorder.addEventListener("start", () => {
      options?.onStart?.();
    });
    recorder.addEventListener("dataavailable", (e) => {
      this.blobChunks.push(e.data);
    });
    recorder.addEventListener("stop", () => {
      options?.onStop?.(this.blobChunks);
    });
  }

  public start() {
    this.recorder.start();
  }

  public stop() {
    this.recorder.stop();
  }
}

export default VoiceRecorder;
