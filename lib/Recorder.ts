class Recorder {
  public static audioBufferToBlobUrl(arrayBuffer: ArrayBuffer) {
    let blob = new Blob([new Uint8Array(arrayBuffer)]);
    let blobUrl = URL.createObjectURL(blob);
    return blobUrl;
  }

  // ---private attributes---
  private audioCtx: AudioContext;
  private bufferSourceNode: AudioBufferSourceNode;
  private processorNode: ScriptProcessorNode;
  private mediaNode?: MediaStreamAudioSourceNode;
  private mediaStream?: MediaStream;
  private leftDataList: Float32Array[] = [];
  private rightDataList: Float32Array[] = [];

  // ---public methods---
  public constructor() {
    this.audioCtx = this.createAudioContext();
    this.bufferSourceNode = this.createAudioNode();
    this.processorNode = this.createProcessorNode();
  }
  public play() {
    this.bufferSourceNode.start(0);
  }
  public async beginRecord() {
    const mediaStream = await this.createMediaStream();
    this.processorNode.connect(this.audioCtx.destination);
    const mediaNode = await this.createMediaNode(mediaStream);
    this.processorNode.onaudioprocess = (e) => {
      const audioBuffer = e.inputBuffer;
      const leftChannelData = audioBuffer.getChannelData(0);
      const rightChannelData = audioBuffer.getChannelData(1);
      this.leftDataList.push(leftChannelData.slice(0));
      this.rightDataList.push(rightChannelData.slice(1));
    };
    mediaNode.connect(this.processorNode);
    this.mediaStream = mediaStream;
    this.mediaNode = mediaNode;
  }
  public async closeRecord() {
    this.mediaStream?.getAudioTracks()[0].stop();
    this.mediaNode?.disconnect();
    this.processorNode.disconnect();

    const leftData = this.mergeArray(this.leftDataList);
    // const rightData = this.mergeArray(this.rightDataList);
    // let allData = this.interleaveLeftAndRight(leftData, rightData);
    // let wavBuffer = this.createWavFile(allData);
    let wavBuffer = this.createWavFile(leftData);
    return wavBuffer;
  }

  // ---private methoods---
  private createAudioContext() {
    // Safari需要使用webkit前缀
    const AudioContext_ = window.AudioContext || window.webkitAudioContext;
    const audioCtx = new AudioContext_();
    return audioCtx;
  }
  private createAudioNode() {
    // 创建一个AudioBufferSourceNode对象，使用AudioContext的工厂函数创建
    const audioNode = this.audioCtx.createBufferSource();
    return audioNode;
  }
  private createProcessorNode() {
    const BUFFER_SIZE = 4096;
    const INPUT_CHANNEL_COUNT = 2;
    const OUTPUT_CHANNEL_COUNT = 2;
    let creator = this.audioCtx.createScriptProcessor;
    creator = creator.bind(this.audioCtx);
    return creator(BUFFER_SIZE, INPUT_CHANNEL_COUNT, OUTPUT_CHANNEL_COUNT);
  }
  private async createMediaStream() {
    return window.navigator.mediaDevices.getUserMedia({
      audio: {
        channelCount: 2, // 双声道
      },
    });
  }
  private async createMediaNode(mediaStream: MediaStream) {
    const mediaNode = this.audioCtx.createMediaStreamSource(mediaStream);
    return mediaNode;
  }
  // 合并
  private mergeArray(list: Float32Array[]) {
    let length = list.length * list[0].length;
    let data = new Float32Array(length),
      offset = 0;
    for (let i = 0; i < list.length; i++) {
      data.set(list[i], offset);
      offset += list[i].length;
    }
    return data;
  }
  // 交叉合并左右声道的数据
  private interleaveLeftAndRight(left: Float32Array, right: Float32Array) {
    let totalLength = left.length + right.length;
    let data = new Float32Array(totalLength);
    for (let i = 0; i < left.length; i++) {
      let k = i * 2;
      data[k] = left[i];
      data[k + 1] = right[i];
    }
    return data;
  }
  private writeUTFBytes(view: DataView, offset: number, string: string) {
    var lng = string.length;
    for (var i = 0; i < lng; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }
  private createWavFile(audioData: Float32Array) {
    const WAV_HEAD_SIZE = 44;
    let buffer = new ArrayBuffer(audioData.length * 2 + WAV_HEAD_SIZE),
      // 需要用一个view来操控buffer
      view = new DataView(buffer);
    // 写入wav头部信息
    // RIFF chunk descriptor/identifier
    this.writeUTFBytes(view, 0, "RIFF");
    // RIFF chunk length
    view.setUint32(4, 44 + audioData.length * 2, true);
    // RIFF type
    this.writeUTFBytes(view, 8, "WAVE");
    // format chunk identifier
    // FMT sub-chunk
    this.writeUTFBytes(view, 12, "fmt ");
    // format chunk length
    view.setUint32(16, 16, true);
    // sample format (raw)
    view.setUint16(20, 1, true);
    // stereo (2 channels)
    view.setUint16(22, 2, true);
    // sample rate
    view.setUint32(24, 44100, true);
    // byte rate (sample rate * block align)
    view.setUint32(28, 44100 * 2, true);
    // block align (channel count * bytes per sample)
    view.setUint16(32, 2 * 2, true);
    // bits per sample
    view.setUint16(34, 16, true);
    // data sub-chunk
    // data chunk identifier
    this.writeUTFBytes(view, 36, "data");
    // data chunk length
    view.setUint32(40, audioData.length * 2, true);
    // 写入wav头部，代码同上
    // 写入PCM数据
    let length = audioData.length;
    let index = 44;
    let volume = 1;
    for (let i = 0; i < length; i++) {
      view.setInt16(index, audioData[i] * (0x7fff * volume), true);
      index += 2;
    }
    return buffer;
  }
}

export default Recorder;
