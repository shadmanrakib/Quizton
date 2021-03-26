import React, { useEffect, useState } from "react";
import styles from "./Button.module.css";

interface P {
    children?: any;
    onClick?: (e) => any;
    style?: string;
}

const Button: React.FC<P> = ({ children, style, onClick }) => {
  const [coords, setCoords] = useState({ x: -1, y: -1 });
  const [isRippling, setIsRippling] = useState(false);
  const [mouseOver, setMouseOver] = useState(false);

  useEffect(() => {
    if (coords.x !== -1 && coords.y !== -1) {
      setIsRippling(true);
      setTimeout(() => setIsRippling(false), 200);
    } else setIsRippling(false);
  }, [coords]);

  useEffect(() => {
    if (!isRippling) setCoords({ x: -1, y: -1 });
  }, [isRippling]);

  const buttonStyle = `relative overflow-hidden ${styles.button} ${(!style ? "p-3 rounded-md bg-gradient-to-r from-light-blue-500 to-green-500 focus:outline-none text-white": style)}`;

  return (
    <button
      className={buttonStyle}
      onClick={(e) => {
        setCoords({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY });
        onClick && onClick(e);
      }}
      onMouseOver={() => {
        setMouseOver(true);
      }}
      onMouseOut={() => {
        setMouseOver(false);
      }}
    >
      {isRippling ? (
        <span
          className={`w-1 h-1 absolute ${styles.ripple}`}
          style={{
            left: coords.x,
            top: coords.y,
          }}
        />
      ) : (
        ""
      )}
      <div className={`absolute w-full h-full top-0 left-0 ${styles.hovered }`}></div>
      <span className="relative z-10">{children}</span>
    </button>
  );
};

export default Button;
