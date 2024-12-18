import { useEffect, useRef, useState } from 'react'

interface UserMessage {
    name: string;
    message: string
}

function Chat() {

  // const [msg, setMsg] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const messageRef = useRef<HTMLDivElement | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  const [messages, setMessages] = useState<UserMessage[]>([]);

  const [isConnected, setIsConnected] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(()=>{
    const ws = new WebSocket("ws://localhost:8080");
    wsRef.current = ws;

    ws.onmessage = (ev) => {
      try {
        const parsedMessage = JSON.parse(ev.data);
        setMessages((prevMessages) => [...prevMessages, parsedMessage]);
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
          roomId: "red",
          name:"Varun"
        }
      }))
    };

    ws.onerror = () => {
      setIsError(true);
      console.error("WebSocket connection error");
    };

    ws.onclose = () => {
      setIsConnected(false);
      console.log("WebSocket connection closed");
    };

    // Cleanup on component unmount
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  },[])

  // Function to parse data recieved from websocket
  // function parsedMsg(msg:string){
  //   return JSON.parse(msg)
  // }

  // Scroll to the bottom of the messages container
  const scrollToBottom = () => {
    if (messageRef.current) {
      messageRef.current.scrollTop = messageRef.current.scrollHeight;
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
      
      <div className='h-[44px] w-[calc(50%+60px)] min-w-[360px] mb-[20px] border-[rgba(255,255,255,0.25)] bg-[rgba(255,255,255,0.025)] rounded-lg hover:border-[rgba(255,255,255,0.35)]'></div>

      <div ref={messageRef} className='min-h-[35%] max-h-[38rem] h-[38rem] w-[calc(50%+60px)] min-w-[360px] p-[8px] border border-solid mb-[20px] border-[rgba(255,255,255,0.25)] bg-[rgba(255,255,255,0.025)] rounded-lg hover:border-[rgba(255,255,255,0.35)] overflow-y-scroll scrollbar-hide '>
        { messages.map((msg, index)=>{
          {if(!msg) return ;}
          return (<>
          <div key={index} className='h-auto w-full flex justify-start relative'>
            <span className='w-[10px] h-[10px] mt-2 bg-[rgba(255,255,255,1)] absolute left-0 rotate-180'  style={{ clipPath: "polygon(0% 0%, 100% 100%, 0% 100%)" }}></span>
            <div className='m-2 h-fit w-fit max-w-[38rem] bg-[rgba(255,255,255,1)] p-2  rounded-sm text-[black] flex  items-center justify-center'>
              {msg.name} : {msg.message}
            </div>
          </div>

          {/* <div className='h-auto w-full flex justify-end border relative'>
            <span className='w-[10px] h-[10px] mt-2 bg-[rgba(255,255,255,1)] absolute right-0 rotate-90'  style={{ clipPath: "polygon(0% 0%, 100% 100%, 0% 100%)" }}></span>
            <div className='m-2 h-fit w-fit max-w-[38rem] bg-[rgba(255,255,255,1)] p-2  rounded-sm text-[black] flex  items-center justify-center'>
              {msg}
            </div>
          </div> */}
        </>)})}

      </div>
      <div className='h-auto w-[100%] flex items-center justify-center'> 
        <input type="text" name="" id="msgInputBox" ref={inputRef}  placeholder='type ur msg here' className='h-[44px] w-[50%] min-w-[316px] text-[18px] px-2 rounded-lg border border-solid border-[rgba(255,255,255,0.25)] bg-[rgba(255,255,255,0.05)] hover:border-[rgba(255,255,255,0.35)]'/>

        <button onClick={()=>{
          // sendMessage();
          sendMsg();
        }} className='h-[44px] w-[44px] bg-white hover:bg-[rgba(255,255,255,0.9)] text-[black] ml-4 rounded-lg'> 
          <span className='h-full w-full flex items-center justify-center'>
            <img src="/Send.svg" alt="Send" />
          </span> 
        </button> 
      </div>
      {!isConnected && <p className="text-red-500">Disconnected. Trying to reconnect...</p>}
      {isError && <p className="text-red-500">There was an error with the WebSocket connection.</p>}
      </div>
    </>
  )
}

export default Chat
