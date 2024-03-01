import React from 'react'
import {useCallback} from 'react'
const LobbyScreen = () => {
    const socket = useSocket();

    const handleJoinRoom = useCallback((data) => {
        const {roomId, userId} = data;
        navigate(`/room/${roomId}?userId=${userId}`)
    }, [socket]);

    const handleSubmit =  (e) => {
        e.preventDefault();    
        const form = e.currentTarget;
        const data = new FormData(form);
        const obj = Object.fromEntries(data);
        socket.emit("join-room", obj);
        console.log(obj);
    
    }

    const useEffect = () => {
        socket.on("room-joined", (userId) => {
            handleJoinRoom(userId);
        })
        return () => socket.off("room-joined",handleJoinRoom);
    }, [socket,handleJoinRoom];
    
  return (
    <div>
        <div class="w-full h-screen flex items-center justify-center bg-indigo-100">
      <form class="w-full md:w-1/3 rounded-lg">
        <div class="flex font-bold justify-center mt-6">
          <img class="h-20 w-20 mb-3" src="https://dummyimage.com/64x64" />
        </div>
        <h2 class="text-2xl text-center text-gray-200 mb-8">Lobby Screen</h2>
        <div class="px-12 pb-10">
          <div class="w-full mb-2">
            <div class="flex items-center">
              <input
                type="text"
                placeholder="Email Address"
                class="
                  w-full
                  border
                  rounded
                  px-3
                  py-2
                  text-gray-700
                  focus:outline-none
                "
                name="email"
              />
            </div>
          </div>
          <div class="w-full mb-2">
            <div class="flex items-center">
              <input
                type="Room Id"
                placeholder="Password"
                class="
                  w-full
                  border
                  rounded
                  px-3
                  py-2
                  text-gray-700
                  focus:outline-none
                "
                name="room-id"
              />
            </div>
          </div>
          <button
            type="submit"
            class="
              w-full
              py-2
              mt-8
              rounded-full
              bg-blue-400
              text-gray-100
              focus:outline-none
            "
          >
            Join
          </button>
        </div>
      </form>
    </div>
    </div>
  )
}

export default LobbyScreen
