import { io } from "socket.io-client";
import APP_URL from "./ip.config";
import * as SecureStore from "expo-secure-store";
const getToken = async () => {
    return await SecureStore.getItemAsync("token");
}
const socket = io(APP_URL, {
    transports: ["websocket"],
    autoConnect: false,
    auth: async (cb) => {
        const token = await getToken();
        cb({ token });
    },
});

export default socket;