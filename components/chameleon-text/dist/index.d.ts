import { RGB } from "./Chameleon";
declare type ChameleonTextProps = {
    /** 比例 */
    ratio: number;
    children: string;
    targetRGB: RGB;
    fontFamily?: string;
};
declare const ChameleonText: (props: ChameleonTextProps) => JSX.Element;
export default ChameleonText;
