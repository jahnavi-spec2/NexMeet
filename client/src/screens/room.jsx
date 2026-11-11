import {useEffect,useState,useCallback,useRef} from 'react';
import {useSocket} from "../context/SocketProvider";
import peer from "../service/peer"
import "./RoomScreen.css";
const RoomScreen=()=>{

    const socket=useSocket();//whn user will enter here ...
  const [remoteSocketId,setRemoteSocketId]= useState(null);
const [myStream,setMyStream]=useState(null);
const [remoteStream,setRemoteStream]=useState(null);
  const [mediaError,setMediaError]=useState('');
  const localVideoRef=useRef(null);
  const remoteVideoRef=useRef(null);
  const localStreamRef=useRef(null);
  const streamRequestRef=useRef(null);

useEffect(() => {
    if (!localVideoRef.current || !myStream) return;

    localVideoRef.current.srcObject = myStream;

    localVideoRef.current.play().catch(err => {
        console.log("Local video playback failed:", err);
    });

}, [myStream]);


useEffect(() => {
    if (!remoteVideoRef.current || !remoteStream) return;

    remoteVideoRef.current.srcObject = remoteStream;

    remoteVideoRef.current.play().catch(err => {
        console.log("Remote video playback failed:", err);
    });

}, [remoteStream]);

const getLocalStream=useCallback(async()=>{
    const activeStream=localStreamRef.current;
    if(activeStream?.getTracks().length && activeStream.getTracks().every((track)=>track.readyState==='live')){
        return activeStream;
    }

    if(streamRequestRef.current){
        return streamRequestRef.current;
    }

    if(!navigator.mediaDevices?.getUserMedia){
        setMediaError('Camera/microphone access is unavailable in this browser context. Use localhost or HTTPS.');
        return null;
    }

    const request=navigator.mediaDevices.getUserMedia({video:true,audio:true})
        .then((stream)=>{
            localStreamRef.current=stream;
            setMediaError('');
            return stream;
        })
        .catch((error)=>{
            console.error('Unable to access camera and microphone',error);
            const name=error?.name || 'UnknownError';
            const message=error?.message || 'No additional details provided by the browser.';
            setMediaError(`Camera/microphone request failed (${name}): ${message}`);
            return null;
        })
        .finally(()=>{
            streamRequestRef.current=null;
        });

    streamRequestRef.current=request;
    return request;
},[]);

    const handleUserJoined=useCallback(({email,id})=>{
        console.log(`Email ${email} has entered room`);
        setRemoteSocketId(id);
    },[]);


   const handleCall= useCallback(async ()=>{// for calling 1stly apni video stream on krenge 
   const stream =await getLocalStream();
   if(!stream) return;
   setMyStream(stream);
   for(const track of stream.getTracks()){
       peer.peer.addTrack(track,stream);
   }
   const offer=await peer.getOffer();
   // to send thsi offer to other user
    socket.emit('user:call',{to:remoteSocketId,offer});

   },[getLocalStream,remoteSocketId,socket]);
//visit frontedn part at last 1st emit thn index.js thn here ...and bbefore defn fnc write peer part 
     const handleCallAccepted=useCallback(async({from,answer})=>{
        await peer.setRemoteDescription(answer);
        console.log(`Call accepted by ${from}`,answer);
             
    },[]);


    const handleNegoNeeded  = useCallback(async()=>{
        const offer=await peer.getOffer();
        socket.emit('peer:nego:needed',{offer,to:remoteSocketId});//iske baad fronted pe work
    } ,[remoteSocketId,socket])

useEffect(()=>{
    peer.peer.addEventListener('negotiationneeded',handleNegoNeeded);

    return ()=>{
        peer.peer.removeEventListener("negotiationneeded",handleNegoNeeded); 
    }
    },[handleNegoNeeded])

     

const handleTrack=useCallback((ev)=>{
    const [stream]=ev.streams;
    if(stream){
        setRemoteStream(stream);
    }
},[]);

    useEffect(()=>{
    peer.peer.addEventListener('track',handleTrack);

    return ()=>{
        peer.peer.removeEventListener('track',handleTrack);
    }
},[handleTrack]);



const handleNegoNeedFinal=useCallback(async ({ans})=>{
  await peer.setRemoteDescription(ans)
},[]);

const handleNegoNeedIncoming= useCallback(async({from,offer})=>{
    const ans= await peer.getAnswer(offer);
    socket.emit('peer:nego:done',{to:from,ans});

},[socket]);//handle it  on backend


    const handleIncomingCall=useCallback(async({from,offer})=>{
        setRemoteSocketId(from);
           const stream =await getLocalStream();
           if(!stream) return;
         setMyStream(stream);
        console.log(`Incoming call from ${from}`,from,offer);
        const ans=await peer.getAnswer(offer,stream);

        socket.emit('call:accepted',{to:from,answer:ans});
    
    },[getLocalStream,socket]);

    useEffect(()=>{
socket.on('user:joined',handleUserJoined)// it will listen to the event when a new user joins the room and it will run this function 
socket.on('incoming:call',handleIncomingCall);
socket.on('call:accepted',handleCallAccepted);
socket.on('peer:nego:needed',handleNegoNeedIncoming);
socket.on('peer:nego:final',handleNegoNeedFinal)

return ()=>{
    socket.off('user:joined',handleUserJoined)// it will remove the event listener when the component unmounts
    socket.off('incoming:call',handleIncomingCall)
    socket.off('call:accepted',handleCallAccepted)
    socket.off('peer:nego:needed',handleNegoNeedIncoming)
    socket.off('peer:nego:final',handleNegoNeedFinal)


}
    },[socket,handleUserJoined,handleIncomingCall,handleCallAccepted,handleNegoNeedIncoming,handleNegoNeedFinal ]);


 
    return(
        <div>
            <h1> Room Page</h1>
            <h4> {remoteSocketId ? 'Connected' : 'No one is in room '}</h4>
            {mediaError && <p role="alert">{mediaError}</p>}

            {remoteSocketId && <button onClick={handleCall}>Call</button>}
            {/* //apni video pehle on krenge and thn we will broavcast to others
        */}
      <div className="video-container">

            {myStream && (
                <div className="video-card">
                    <h3>You</h3>

                    <video
                        ref={localVideoRef}
                        autoPlay
                        muted
                        playsInline
                    />
                </div>
            )}

            {remoteStream && (
                <div className="video-card">
                    <h3>Remote User</h3>

                    <video
                        ref={remoteVideoRef}
                        autoPlay
                        playsInline
                    />
                </div>
            )}

        </div>

    </div>
)

    
}

export default RoomScreen