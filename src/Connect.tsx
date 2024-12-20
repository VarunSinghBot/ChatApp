import { useRef } from 'react'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';


function Connect() {
    const Navigate = useNavigate();

    const nameRef = useRef<HTMLInputElement | null>(null);
    const roomIdRef = useRef<HTMLInputElement | null>(null);

    // const copyToClipboard = async () => {
    //     try {
    //       await navigator.clipboard.writeText("Hello there!");
    //       toast.success("Text copied to clipboard!",{ className: 'toast-success' });
    //     } catch (err) {
    //       toast.error("Couldn't copy text", { className: 'toast-error' });
    //       console.error("Failed to copy: ", err);
    //     }
    // };

    const generateNewRoomId = (): string => {
        return Math.floor(1000 + Math.random() * 9000).toString();
      };

    const onBtnPress = () => {
        console.log("Connect")
        const username = nameRef.current?.value;
        let roomId = roomIdRef.current?.value?.trim();

        if (!username) {
            toast.error('Please enter your name!', { className: 'toast-error' });
            return;
          }
      
          if (!roomId) {
            roomId = generateNewRoomId();
            toast.info(`New Room ID generated: ${roomId}`, { className: 'toast-info' });
          }
      
          Navigate('/chat', { state: { username, roomId }});
    } 

    return (<>
        <div  className='h-full w-full flex items-center justify-center flex-col text-white'>
            <ToastContainer position="bottom-right" autoClose={1600} />
            <main className='h-fit p-16 w-[60%] min-w-[326px] rounded-xl flex items-center justify-center flex-col gap-2 border border-[rgba(255,255,255,.2)] border-solid bg-[rgba(255,255,255,.1)]'>
                <h1 className='text-4xl font-semibold mb-10'>Welcome To Chat App</h1>
                
                <input type="text" ref={nameRef} placeholder='Enter your name' required className='w-[calc(100%-20%)] h-[40px] text-xl p-2 rounded-md bg-[rgba(255,255,255,.1)]'/>
                <div className='w-[99%] h-fit flex items-center justify-center gap-2'>
                    <input ref={roomIdRef} type="text" placeholder='Enter Room Id' className='min-w-[280px] w-[calc(80%-182px)] h-[40px] pl-2 pr-2 text-xl rounded-md bg-[rgba(255,255,255,.1)]'/>
               
                    <button onClick={onBtnPress} className='h-[44px] w-[180px] rounded-md bg-white hover:bg-[rgba(255,255,255,.9)] text-black text-center p-2'>Connect</button>
                </div>

                <p className='font-extralight m-4'>Enter a Room Id or click Connect to create new Room</p>
            </main>
            
        </div>
    </>)
}

export default Connect
