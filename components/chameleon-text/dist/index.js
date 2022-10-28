import { useRef, useEffect, useMemo } from "react";
import Chameleon from "./Chameleon";
import styles from "./index.module.scss";
const ChameleonText = (props) => {
    const { children, ratio, targetRGB, fontFamily } = props;
    const divRef = useRef(null);
    const canvasRef = useRef(null);
    const chameleonRef = useRef();
    useEffect(() => {
        if (canvasRef.current && divRef.current) {
            const h = divRef.current.offsetHeight * 0.8;
            const w = h / children.length;
            const chameleon = new Chameleon(canvasRef.current, w, h);
            chameleon.setText(children, targetRGB, fontFamily);
            chameleonRef.current = chameleon;
        }
    }, []);
    useEffect(() => {
        if (chameleonRef.current)
            chameleonRef.current.setRatio(ratio);
    }, [ratio]);
    const canvas = useMemo(() => {
        return <canvas ref={canvasRef}></canvas>;
    }, []);
    return (<div ref={divRef} className={styles.wrap}>
      {canvas}
    </div>);
};
export default ChameleonText;
