import { useEffect } from "react";
import { Pressable, Text, View } from "react-native";

import socket from "../../socket.js";

const Settings = () => {
  useEffect(() => {
    const handleConnect = () => {
      console.log("Connected:", socket.id);
      socket.emit("join-room", "settings");
    };

    const handleJoined = (data) => {
      console.log("Joined Room:", data);
    };

    const handleReceiveMessage = (data) => {
      console.log("Received Message:", data);
    };

    socket.on("connect", handleConnect);

    socket.on("joined-room", handleJoined);

    socket.on("receive-message", handleReceiveMessage);

    if (!socket.connected) {
      socket.connect();
    } else {
      handleConnect();
    }

    return () => {
      socket.off("connect", handleConnect);

      socket.off("joined-room", handleJoined);

      socket.off("receive-message", handleReceiveMessage);
    };
  }, []);

  const sendMessage = () => {
    socket.emit("send-message", {
      roomId: "settings",

      text: "Hello from Expo App",

      sender: socket.id,

      createdAt: new Date(),
    });
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 20,
      }}
    >
      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
        }}
      >
        Settings
      </Text>

      <Pressable
        onPress={sendMessage}
        style={{
          backgroundColor: "#000",
          paddingHorizontal: 20,
          paddingVertical: 14,
          borderRadius: 10,
        }}
      >
        <Text
          style={{
            color: "#fff",
            fontWeight: "bold",
            fontSize: 16,
          }}
        >
          Send Ball
        </Text>
      </Pressable>
    </View>
  );
};

export default Settings;
