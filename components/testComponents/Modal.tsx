import { useState } from 'react';

interface P {
    title: string;
}

const Modal: React.FC<P> = ({children, title}) => {
    const [open, setOpen] = useState(false);
    return (
        <>
            <button className="border border-black p-3" onClick={() => { setOpen(!open) } }>{ open ? 'Close Modal' : 'Open Modal'}</button>
            { open && 
            <div className="flex fixed top-0 justify-center items-center w-screen h-screen bg-black opacity-70">
                <div className="w-11/12 md:w-1/2 p-8 rounded-md bg-white text-black">
                    <div className="flex justify-between mb-5 pb-3 border-b border-gray-800">
                        <h1 className="text-2xl">{ title }</h1>
                        <button onClick={() => { setOpen(false) }}>X</button>
                    </div>
                    { children }
                </div>
            </div>
            }
        </>
    )
}

export default Modal;
