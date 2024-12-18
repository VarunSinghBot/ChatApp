import { useEffect, useRef, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


interface UserMessage {
    name: string;
    message: string
}

function Connect() {

    const copyToClipboard = async () => {
        try {
          await navigator.clipboard.writeText("Hello there!");
          toast.success("Text copied to clipboard!",{ className: 'toast-success' });
        } catch (err) {
          toast.error("Couldn't copy text", { className: 'toast-error' });
          console.error("Failed to copy: ", err);
        }
      };

    

    return (<>
        <div  className='h-full w-full flex items-center justify-center flex-col text-white'>
        <ToastContainer position="bottom-right" autoClose={1600} />

        <button onClick={copyToClipboard}  className='h-[44px] w-[180px] rounded-md bg-white text-black m-[8px] text-center p-2'>Click me to copy text!</button>
        </div>
    </>)
}

export default Connect
