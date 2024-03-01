import React, {createContext, useContext, useEffect, useState} from 'react';
import {io} from "socket.io-client";
const SocketContext = createContext();

export const SocketProvider = ({children}) => {
    const socket = useMemo(() => io('http://localhost:8080'), []); 
    // useEffect(() => {
    //     const newSocket = new WebSocket('ws://localhost:8080');
    //     setSocket(newSocket);
    //     return () => newSocket.close();
    // }, []);
    
    return (
        <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
    );
}

export const useSocket = () => {
    return useContext(SocketContext);
}