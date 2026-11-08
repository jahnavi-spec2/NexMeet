import React,{useEffect} from 'react';
import {useSocket} from "../context/SocketProvider";
const RoomScreen=()=>{

    const socket=useSocket();//whn user will enter here ...

    const handleUserJoined=useCallBack(({email,id})=>{
        console.log(`Email ${email} has entered room`);
    },[]);
    useEffect(()=>{
socket.on('user:joined',handleUserJoined)// it will listen to the event when a new user joins the room and it will run this function 

return ()=>{
    socket.off('user:joined',handleUserJoined)// it will remove the event listener when the component unmounts
}
    },[socket,handleUserJoined]);
    return(
        <div>
            <h1> Room Page</h1>
        </div>
    )
}

export default RoomScreen