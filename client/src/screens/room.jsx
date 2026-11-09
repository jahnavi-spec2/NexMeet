import React,{useEffect,useState,useCallback} from 'react';
import {useSocket} from "../context/SocketProvider";
import ReactPlayer from 'react-player';
import peer from "../service/peer"
const RoomScreen=()=>{

    const socket=useSocket();//whn user will enter here ...
  const [remoteSocketId,setRemoteSocketId]= useState(null);
const [myStream,setMyStream]=useState(null);

    const handleUserJoined=useCallback(({email,id})=>{
        console.log(`Email ${email} has entered room`);
        setRemoteSocketId(id);
    },[]);


   const handleCall= useCallback(async ()=>{// for calling 1stly apni video stream on krenge 
   const stream =await navigator.mediaDevices.getUserMedia({video:true,audio:true});
  
   const offer=await peer.getOffer();
   // to send thsi offer to other user
    socket.emit('user:call',{to:remoteSocketId,offer});
   setMyStream(stream);// we can run thi tream tp our local decvice 
    },[remoteSocketId,socket]);


//visit frontedn part at last 1st emit thn index.js thn here ...and bbefore defn fnc write peer part 
     const handleCallAccepted=useCallback(async({from,answer})=>{
        console.log(`Call accepted by ${from}`,answer);
        await peer.setRemoteDescription(answer);
    },[socket]);

    const handleIncomingCall=useCallback(async((from,offer)=>{
        setRemoteSocketId(from);
           const stream =await navigator.mediaDevices.getUserMedia({video:true,audio:true});
         setMyStream(stream);
        console.log(`Incoming call from ${from}`,from,offer);
        const ans=await.peer.getAnswer(offer);

        socket.emit('call:accepted',{to:from,answer:ans});
    
    },[socket]);
    useEffect(()=>{
socket.on('user:joined',handleUserJoined)// it will listen to the event when a new user joins the room and it will run this function 
socket.on('incoming:call',handleIncomingCall);
socket.on('call:accepted',handleCallAccepted);
return ()=>{
    socket.off('user:joined',handleUserJoined)// it will remove the event listener when the component unmounts
 socket.off('incoming:call',handleIncomingCall)
 socket.off('call:accepted',handleCallAccepted)
}
    },[socket,handleUserJoined,handleIncomingCall,handleCallAccepted]);


 
    return(
        <div>
            <h1> Room Page</h1>
            <h4> {remoteSocketId ? 'Connected' : 'No one is in room '}</h4>
            {remoteSocketId && <button onClick={handleCall}>Call</button>}
            {/* //apni video pehle on krenge and thn we will broavcast to others
        */}
       
       {myStream && (
         <>
           <h2> MyStream running...</h2>
           <ReactPlayer 
             playing
             muted 
             height="200px"
             width="400px"
             src={myStream}
           />
         </>
       )}
        {/* //jo user pehle aaya tha usse call k through dushro ko connect krna h */}
        </div>
    )
}

export default RoomScreen