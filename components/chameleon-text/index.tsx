import { useRef, useEffect, useMemo } from "react";
import Chameleon, { RGB } from "./Chameleon";
import styles from "./index.module.scss";

export type ChameleonTextProps = {
  /** 比例 */
  ratio: number;
  children: string;
  targetRGB: RGB;
  fontFamily?: string;
};
const ChameleonText = (props: ChameleonTextProps) => {
  const { children, ratio, targetRGB, fontFamily } = props;
  const divRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chameleonRef = useRef<Chameleon>();

  const getSize = () => {
    const h = (divRef.current?.offsetHeight ?? 0) * 0.8;
    const w = h / children.length;
    return [w, h];
  };

  useEffect(() => {
    if (canvasRef.current && divRef.current) {
      const [w, h] = getSize();
      const chameleon = new Chameleon(
        canvasRef.current,
        w,
        h + children.length * 8
      );
      chameleon.setText(children, targetRGB, fontFamily);
      chameleonRef.current = chameleon;
    }
  }, []);

  useEffect(() => {
    if (chameleonRef.current) chameleonRef.current.setRatio(ratio);
  }, [ratio]);

  useEffect(() => {
    const [w, h] = getSize();
    if (canvasRef.current) {
      canvasRef.current.style.width = `${w}px`;
      canvasRef.current.style.height = `${h}px`;
    }
  });

  const canvas = useMemo(() => {
    return <canvas ref={canvasRef}></canvas>;
  }, []);

  return (
    <div ref={divRef} className={styles.wrap}>
      {canvas}
    </div>
  );
};

export default ChameleonText;
