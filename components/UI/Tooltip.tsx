import { useState } from 'react';

const Tooltip: React.FC = ({ children }) => {
    const [opened, setOpened] = useState(false);

    return (
        <div className="relative">
            <div className="flex justify-center items-center w-5 h-5 p-3 border border-black rounded-full" 
                onMouseOver={() => { setOpened(true) }} 
                onMouseOut={() => { setOpened(false) }}
            >i</div>
            <div className={`absolute -top-5 left-8 transition duration-200 p-5 ${ opened ? 'opacity-100' : 'opacity-0 pointer-events-none' } z-50 border border-gray-500 rounded-md bg-white`}>
                { children }
            </div>
        </div>
    )
}

export default Tooltip;