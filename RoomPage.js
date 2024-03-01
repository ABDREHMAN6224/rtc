import React from 'react'

const RoomPage = () => {
    const socket = useSocket();
    const {roomId} = useParams();
    const [remoteSocketId, setRemoteSocketId] = useState(null);

    const hanldeCallUser = useCallback(async() => {
        const stream = await navigator.mediaDevices.getUserMedia({video:true, audio:true});
        const localVideo = document.getElementById("local-video");
        localVideo.srcObject = stream;
        
    }, [socket])

    const handleUserJoined = useCallback((data) => {
        const {roomId, userId} = data;
        console.log("User joined", userId);
        setRemoteSocketId(userId);
    }
    , [socket]);
    useEffect(() => {
        socket.on("user-joined", handleUserJoined);
        return () => socket.off("user-joined", handleUserJoined);
    }, [socket, handleUserJoined]);


  return (
    <div>
        <h4>
            {remoteSocketId ? `User ${remoteSocketId} has joined the room` : "Waiting for user to join"}
        </h4>
        <button onClick={hanldeCallUser}>Call</button>
    </div>
  )
}

export default RoomPage
