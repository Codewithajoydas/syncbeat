import { io } from "socket.io-client";
import APP_URL from "./ip.config";
const socket = io(APP_URL, {
    transports: ["websocket"],
    autoConnect: false,
});

export default socket;