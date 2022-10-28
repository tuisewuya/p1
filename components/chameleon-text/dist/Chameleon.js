class Chameleon {
    canvas;
    ctx;
    text = "";
    targetRGB = [0, 0, 0];
    /** 变色比例 */
    ratio = 0;
    /** 记录上次改变的宽度, 用于节流 */
    previouSourceWidth = 2;
    fontFamily;
    constructor(canvas, w, h) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.canvas.width = w;
        this.canvas.height = h + 20;
    }
    setText(text, targetRGB, fontFamily = "黑体") {
        this.text = text;
        this.fontFamily = fontFamily;
        if (targetRGB && targetRGB?.length === 3) {
            this.targetRGB = targetRGB.map((v) => {
                if (typeof v !== "number" || v < 0 || v > 255)
                    return 0;
                else
                    return v;
            });
        }
        this.initContent();
    }
    setRatio(ratio) {
        this.ratio = ratio;
        this.render();
    }
    drawText(char, y) {
        this.ctx.save();
        this.ctx.font = `${this.canvas.width}px/${this.canvas.width}px ${this.fontFamily}`;
        this.ctx.fillText(char, 0, y);
        this.ctx.restore();
    }
    /** 改变图片颜色 */
    turnColour(sw) {
        if (this.ratio < 2 || this.ratio > 100)
            return;
        this.previouSourceWidth = sw;
        try {
            const imgData = this.ctx.getImageData(0, 0, sw < 2 ? 2 : sw, this.canvas.height);
            for (let i = 0; i < imgData.data.length; i += 4) {
                const [r, g, b] = this.getRGBA(imgData.data, i);
                if (r === 0)
                    imgData.data[i] = this.targetRGB[0];
                if (g === 0)
                    imgData.data[i + 1] = this.targetRGB[1];
                if (b === 0)
                    imgData.data[i + 2] = this.targetRGB[2];
            }
            this.ctx.putImageData(imgData, 0, 0);
        }
        catch (error) {
            console.error("计算宽度不够", sw);
        }
    }
    getRGBA(data, i) {
        return [data[i], data[i + 1], data[i + 2], data[i + 3]];
    }
    initContent() {
        this.text.split("").forEach((item, i) => {
            this.drawText(item, (i + 1) * this.canvas.width);
        });
    }
    render() {
        const sw = this.canvas.width * (this.ratio / 100);
        const tmp = Math.abs(sw - this.previouSourceWidth);
        if (tmp < 4)
            return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.initContent();
        this.turnColour(sw);
    }
}
export default Chameleon;
