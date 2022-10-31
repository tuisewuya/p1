export type RGB = [number, number, number];
class Chameleon {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private text: string = "";
  /** rgb 8位/通道, [0, 0 , 0] 到 [255, 255, 255] */
  private targetRGB: RGB = [0, 0, 0];
  /** 变色比例 */
  private ratio: number = 0;
  private fontFamily?: string;
  private multiplier = 2;

  constructor(canvas: HTMLCanvasElement, w: number, h: number) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.canvas.width = w * this.multiplier;
    this.canvas.height = h * this.multiplier;
  }

  setText(text: string, targetRGB?: RGB, fontFamily?: string) {
    this.text = text;
    this.fontFamily = fontFamily;
    if (targetRGB && targetRGB?.length === 3) {
      this.targetRGB = targetRGB.map((v) => {
        if (typeof v !== "number" || v < 0 || v > 255) return 0;
        else return v;
      }) as RGB;
    }
    this.drawText();
  }

  setRatio(ratio: number) {
    this.ratio = ratio;
    this.render();
  }

  private render() {
    const sw = this.canvas.width * (this.ratio / 100);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawText();
    this.turnColour(sw);
  }

  private getRGBA(data: Uint8ClampedArray, i: number) {
    return [data[i], data[i + 1], data[i + 2], data[i + 3]];
  }

  private textRender(char: string, y: number) {
    this.ctx.save();
    this.ctx.font = `500 ${this.canvas.width}px ${this.fontFamily}`;
    this.ctx.shadowColor = "rgba(0,0,0,0.1)";
    this.ctx.shadowOffsetX = 5 * this.multiplier;
    this.ctx.shadowOffsetY = 3 * this.multiplier;
    this.ctx.shadowBlur = 0;
    this.ctx.textBaseline = "bottom";
    this.ctx.fillText(char, 0, y);
    this.ctx.restore();
  }

  private drawText() {
    this.text.split("").forEach((item, i) => {
      const y = (i + 1) * this.canvas.width + i * 8 * this.multiplier;
      this.textRender(item, y);
    });
  }

  /** 改变图片颜色 */
  private turnColour(sw: number) {
    if (this.ratio < 2 || this.ratio > 100) return;
    try {
      const imgData = this.ctx.getImageData(
        0,
        0,
        sw < 2 ? 2 : sw,
        this.canvas.height
      );
      for (let i = 0; i < imgData.data.length; i += 4) {
        const [r, g, b] = this.getRGBA(imgData.data, i);
        if (r === 0) imgData.data[i] = this.targetRGB[0];
        if (g === 0) imgData.data[i + 1] = this.targetRGB[1];
        if (b === 0) imgData.data[i + 2] = this.targetRGB[2];
      }
      this.ctx.putImageData(imgData, 0, 0);
    } catch (error) {
      console.error("计算宽度不够", sw);
    }
  }
}

export default Chameleon;
