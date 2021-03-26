import { useState } from 'react';
import styles from './Button.module.css';

interface P {
    text: string;
    onClick: () => any;
    style?: string;
}


const Button: React.FC<P> = ({ text, style, onClick }) => {

    const [mouseOver, setMouseOver] = useState(false);


    return (
        <button
            className={`${styles.button} relative p-3 rounded-md bg-gradient-to-r from-light-blue-500 to-green-500 focus:outline-none text-white`}
            onClick={onClick}
            onMouseOver={() => { setMouseOver(true) } }
            onMouseOut={() => { setMouseOver(false) } }
        >
            <div className={`absolute w-full h-full top-0 left-0 ${styles.hovered }`}></div>
            {text}
        </button>
    )
}

export default Button;