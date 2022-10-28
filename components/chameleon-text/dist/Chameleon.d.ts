export declare type RGB = [number, number, number];
declare class Chameleon {
    private canvas;
    private ctx;
    private text;
    private targetRGB;
    /** 变色比例 */
    private ratio;
    /** 记录上次改变的宽度, 用于节流 */
    private previouSourceWidth;
    private fontFamily?;
    constructor(canvas: HTMLCanvasElement, w: number, h: number);
    setText(text: string, targetRGB?: RGB, fontFamily?: string): void;
    setRatio(ratio: number): void;
    private drawText;
    /** 改变图片颜色 */
    private turnColour;
    private getRGBA;
    private initContent;
    private render;
}
export default Chameleon;
