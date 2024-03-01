import React from 'react'
import ReactPlayer from 'react-player'
import peer from './services/peer';

const RoomPage = () => {
    const socket = useSocket();
    const [remoteSocketId, setRemoteSocketId] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const [myStream, setMyStream] = useState(null);

    const hanldeCallUser = useCallback(async() => {
        const stream = await navigator.mediaDevices.getUserMedia({video:true, audio:true});
        setMyStream(stream);
        const offer = await peer.getOffer();
        socket.emit("user:call", {to:remoteSocketId, offer});
        
    }, [socket])
    const handleIncomingCall = useCallback((data) => {
        const {from, offer} = data;
        peer.setRemoteDescription(offer);
        const stream = await navigator.mediaDevices.getUserMedia({video:true, audio:true});
        setMyStream(stream);
        setRemoteSocketId(from);

        const answer = await peer.getAnswer(offer);
        socket.emit("call:accepted", {to:from, answer});
    }, [socket]);

    const handleUserJoined = useCallback((data) => {
        const {roomId, userId} = data;
        console.log("User joined", userId);
        setRemoteSocketId(userId);
    }
    , [socket]);

    const sendStream = useCallback(() => {
        for (const track of myStream.getTracks()) {
            peer.peer.addTrack(track, myStream);
        }
    }, [myStream]);

    const handleCallAccepted = useCallback((data) => {
        const {from, answer} = data;
        peer.setRemoteDescription(answer);
        console.log("Call accepted from", from);
        sendStream();

    
    }, [sendStream]);
    

    const handleNegotiationNeeded = useCallback(async () => {
        const offer = await peer.getOffer();
        socket.emit("peer:nego:needed", {offer, to:remoteSocketId});
    }
    , [socket,remoteSocketId]);


    const handleNegotiationIncoming = useCallback(async (data) => {
        const {offer,from} = data;
       const ans =await peer.getAnswer(offer);
        socket.emit("peer:nego:done", {to:from, ans});
    },[socket]);

    const handleNegotiationFinal = useCallback((data) => {
        const {ans} = data;
        peer.setLocalDescription(ans);
    },[]);


    useEffect(() => {
        peer.peer.addEventListener("negotiationneeded", handleNegotiationNeeded);
        return () => {
            peer.peer.removeEventListener("negotiationneeded", handleNegotiationNeeded);
        }
    },[])
    useEffect(() => {
        peer.peer.addEventListener("track",async (event) => {
            const remoteStreams = event.streams;
            setRemoteStream(remoteStreams[0]);
        });
    },[])
    useEffect(() => {
        socket.on("user-joined", handleUserJoined);
        socket.on("incoming:call", handleIncomingCall);
        socket.on("call-accepted", handleCallAccepted);
        socket.on("peer:nego:needed", handleNegotiationIncoming);
        socket.on("peer:nego:final", handleNegotiationFinal);
        return () => {
            socket.off("user-joined", handleUserJoined);
            socket.off("incoming:call", handleIncomingCall);
            socket.off("call-accepted", handleCallAccepted);
            socket.off("peer:nego:needed", handleNegotiationIncoming);
            socket.off("peer:nego:final", handleNegotiationFinal);
        }
    }, [socket, handleUserJoined,handleIncomingCall,handleCallAccepted]);


  return (
    <div>
        <h4>
            {remoteSocketId ? `User ${remoteSocketId} has joined the room` : "Waiting for user to join"}
        </h4>
        {
            myStream && 
            <ReactPlayer
                playing
                muted
                controls
                width="100%"
                height="100%" 
            url={myStream}
            />
        }
        {
            remoteStream && 
            <ReactPlayer
                playing
                controls
                width="100%"
                height="100%" 
            url={remoteStream}
            />
        }
        <button onClick={hanldeCallUser}>Call</button>
        {
            myStream &&
            <button onClick={sendStream}>Negotiate</button>
        }
    </div>
  )
}

export default RoomPage
