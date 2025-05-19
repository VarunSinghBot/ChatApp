import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface UserMessage {
  type: string;
  payload: {
    name: string;
    message: string
  }
 
}

interface ChatProps {
  roomId: string;
  username: string;
}

const Chat = () => {

  // console.log(roomId, ":", username)

  // const [msg, setMsg] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const messageRef = useRef<HTMLDivElement | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  const [messages, setMessages] = useState<UserMessage[]>([]);

  const [isConnected, setIsConnected] = useState(false);
  const [isError, setIsError] = useState(false);

  const location = useLocation();
  const { roomId, username } = location.state as ChatProps;

  useEffect(()=>{
    const ws = new WebSocket("ws://localhost:8080");
    wsRef.current = ws;

    ws.onmessage = (ev) => {
      try {
        const parsedMessage = JSON.parse(ev.data);
         // ev.data >>>>> [type:"chat"||"system" ,{name: "username",msg:"message"}]
        if (parsedMessage.payload.name && parsedMessage.payload.message) {
          setMessages((prevMessages) => [...prevMessages, parsedMessage]);
        }
        // console.log(messages);
        scrollToBottom();
      } catch(err){
        console.error("Error parsing message: ", err);
      }
    }
    
    ws.onopen= () => {
      setIsConnected(true);
      ws.send(JSON.stringify({
        type:"join",
        payload:{
          roomId,
          name: username,
        }
      }))
    };

    ws.onerror = () => {
      setIsError(true);
      console.error("WebSocket connection error");
    };

    ws.onclose = () => {
      setIsConnected(false);
      // console.log();
      // console.log(ev.data)
      console.log("WebSocket connection closed");
    };

    // Cleanup on component unmount
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  },[roomId, username])

  // Scroll to the bottom of the messages container
  const scrollToBottom = () => {
    messageRef.current?.scrollTo({ top: messageRef.current.scrollHeight, behavior: "smooth" });
  };

  // Function to copy item to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success("Text copied to clipboard!",{ className: 'toast-success' });
    } catch (err) {
      toast.error("Couldn't copy text", { className: 'toast-error' });
      console.error("Failed to copy: ", err);
    }
  };

  function sendMsg() {
    const msg = inputRef.current?.value;
  
    if (msg && wsRef.current) {
      wsRef.current.send(
        JSON.stringify({
          type: "chat",
          payload: {
            message: msg,
          },
        })
      );
      
      // Clear the input box
      if (inputRef.current) {
        inputRef.current.value = "";
      }

    } else {
      console.error("WebSocket connection is not available");
    }
  }

  return (
    <>
      <div className='h-dvh w-dvw text-white bg-[rgb(20,20,20)] flex items-center justify-center flex-col'>
      <ToastContainer position="bottom-right" autoClose={1600} />
      
      <header className='h-[44px] w-[calc(50%+60px)] min-w-[360px] mb-[20px] border border-white border-solid border-[rgba(255,255,255,0.25)] bg-[rgba(255,255,255,0.025)] rounded-lg hover:border-[rgba(255,255,255,0.35) flex items-center justify-between text-center]'> 
        <div className='m-4 '>
          WELCOME TO CHAT APP ~ Developed By ~ Varun
        </div>
        <div className='h-full w-fit flex items-center justify-center '>
          
          <button onClick={copyToClipboard} className='mr-4 p-1 pl-2 pr-2 flex flex-row items-center justify-center rounded-md border border-solid border-black text-black bg-white'>
            <div className='h-[22px] w-[22px] mr-4'>
            <img src="/Copy.svg" alt="Copy" className='h-[20px] w-[20px]'/>
          </div>
            Room ID: {roomId}
          </button>
        </div>
        
      </header>

      <main className='h-auto w-[calc(50%+60px)] min-w-[360px] flex items-center justify-center flex-col border border-solid border-[rgba(255,255,255,0.25)] hover:border-[rgba(255,255,255,0.35)] bg-[rgba(255,255,255,0.025)] rounded-lg'>
        <div ref={messageRef} className='min-h-[35%] max-h-[38rem] h-[38rem] w-full p-[8px] mb-[20px] bg-transparent rounded-lg overflow-y-scroll scrollbar-hide '>
          {messages.map((msg, idx)=>{
            // {if(!msg) return ;}
            return (<>
            <div key={idx} className={`flex ${msg.type === "system" ? "justify-center" : msg.payload.name === username ? "justify-end" : "justify-start" } mb-2`}>
              <div className={`max-w-[75%] p-2 rounded-sm ${msg.type === "system" ? "text-[12px] text-white/50" :msg.payload.name === username ? "bg-blue-500 text-white" : "bg-gray-100 text-black"}`}>
                <strong>{ msg.type === "chat" ? msg.payload.name === username ? "" : `${msg.payload.name}:` : ""} </strong> {msg.payload.message}
              </div>
            </div>
          </>)})}
              <div className='h-[60px] w-full bg-transparent text-black'></div>
        </div>

        {/* <div className='h-[1px] w-full bg-[rgba(255,255,255,0.25)] mb-2'/> */}

        {/* Input Box */}
        <div className='h-auto w-[100%] flex items-center justify-center border-t border-solid border-[rgba(255,255,255,0.25)] bg-[rgba(255,255,255,0.05)] hover:border-[rgba(255,255,255,0.35)]'>
          <input 
            type="text" 
            autoComplete="off" 
            name="msg" 
            onKeyDown={(e) => {
              if (e.key === "Enter"){
                sendMsg();
                }
              }
            } id="msgInputBox" 
            ref={inputRef}  
            placeholder='Type ur msg here ...' 
            className='h-[44px] w-[95%] min-w-[316px] text-[18px] px-2 rounded-lg bg-transparent outline-none focus:outline-none focus:ring-0'
          />

          <button onClick={()=>{
            // sendMessage();
            sendMsg();
          }} className='h-[36px] w-[120px] bg-white hover:bg-[rgba(255,255,255,0.9)] text-[black] rounded-lg mr-1'> 
            <span className='h-full w-full flex items-center justify-center'>
              SEND
              <img src="/Send.svg" alt="Send" className='w-auto h-[50%] ml-2'/>
            </span> 
          </button> 
        </div>
      </main>

      {!isConnected && <p className="text-red-500">Disconnected. Trying to reconnect...</p>}
      {isError && <p className="text-red-500">There was an error with the WebSocket connection.</p>}
      </div>
    </>
  )
}

export default Chat
