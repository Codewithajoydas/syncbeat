import {
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Pressable,
  ScrollView,
  Alert,
} from "react-native";
import { theme } from "../../constants/theme";
import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { router } from "expo-router";
import fetchPost from "../../hooks/utils/fetch_post";
import APP_URL from "../../ip.config";
const createRoom = () => {
  const [publicChecked, setPublicChecked] = useState(true);
  const [privateChecked, setPrivateChecked] = useState(false);
  const [maxListners, setMaxListners] = useState(10);
  const [ultraSync, setUltraSync] = useState(true);
  const [lossless, setLossless] = useState(true);
  const [visualizer, setVisualizer] = useState(true);
  const [roomName, setRoomName] = useState("");
  const createRoom = async () => {

    if(!roomName){
      Alert.alert("Error", "Please enter a room name");
      return;
    }
    const data = {
      privacy: privateChecked ? "private" : "public",
      maxListeners: maxListners,
      roomName: roomName,
    };

    const response = await fetchPost(`${APP_URL}/rooms/create`, data, "POST");
    if (response.ok) {
      const roomId = response.data.roomId;
      router.push(`/room/${roomId}`);
      
    } else {
      console.log(response);
      Alert.alert("Error", JSON.stringify(response.data));

    }
  };

  return (
    <ScrollView style={{ flex: 1, padding: 16 }}>
      {/* Header */}
      <View>
        <Text
          style={{
            fontSize: theme.headerFont.h1,
            color: theme.colors.text,
            fontWeight: "bold",
          }}
        >
          Create Room
        </Text>
        <Text
          style={{
            fontSize: theme.headerFont.h5,
            color: theme.colors.textMuted,
          }}
        >
          Configure your session and start broadcasting music in sync.
        </Text>
      </View>
      {/* Header End */}
      {/* Form */}
      <View style={{ flex: 1, marginTop: 40, gap: 20 }}>
        <View
          style={{
            backgroundColor: theme.colors.surface,
            padding: 10,
            borderRadius: theme.core.borderRadius,
            gap: 10,
            borderWidth: 1,
            borderColor: theme.colors.border,
          }}
        >
          <Text
            style={{ textTransform: "uppercase", color: theme.colors.text }}
          >
            Session Identity
          </Text>
          <TextInput
            placeholder="Midnight Lo-fi Vibes"
            placeholderTextColor={theme.colors.textMuted}
            style={{
              backgroundColor: theme.colors.card,
              padding: 20,
              borderRadius: theme.core.borderRadius,
              color: theme.colors.text,
            }}
            value={roomName}
            onChangeText={(text) => setRoomName(text)}
          />
        </View>
        <View
          style={{
            backgroundColor: theme.colors.surface,
            padding: 10,
            borderRadius: theme.core.borderRadius,
            gap: 10,
            borderWidth: 1,
            borderColor: theme.colors.border,
          }}
        >
          <Text
            style={{ textTransform: "uppercase", color: theme.colors.text }}
          >
            PRIVACY
          </Text>
          <View style={{ gap: 10 }}>
            <TouchableOpacity
              style={{
                flexDirection: "row",
                gap: 10,
                justifyContent: "space-between",
                alignItems: "center",
                padding: 20,
                backgroundColor: theme.colors.card,
                borderRadius: theme.core.borderRadius,
              }}
              onPress={() => {
                setPublicChecked(true);
                setPrivateChecked(false);
              }}
            >
              <View style={{ flexDirection: "row", gap: 10 }}>
                <MaterialIcons name="public" size={24} color="white" />
                <Text style={{ color: "white" }}>Public</Text>
              </View>
              <Pressable
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: theme.core.circle,
                  borderWidth: 1,
                  padding: 2,
                  borderColor: theme.colors.border,
                }}
              >
                {publicChecked && (
                  <View
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: theme.core.circle,
                      backgroundColor: theme.colors.primary,
                    }}
                  ></View>
                )}
              </Pressable>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setPrivateChecked(true);
                setPublicChecked(false);
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  gap: 10,
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: 20,
                  backgroundColor: theme.colors.card,
                  borderRadius: theme.core.borderRadius,
                }}
              >
                <View style={{ flexDirection: "row", gap: 10 }}>
                  <MaterialIcons name="lock" size={24} color="white" />
                  <Text style={{ color: "white" }}>Private</Text>
                </View>
                <Pressable
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: theme.core.circle,
                    borderWidth: 1,
                    padding: 2,
                    borderColor: theme.colors.border,
                  }}
                >
                  {privateChecked && (
                    <View
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: theme.core.circle,
                        backgroundColor: theme.colors.primary,
                      }}
                    ></View>
                  )}
                </Pressable>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            backgroundColor: theme.colors.surface,
            padding: 10,
            borderRadius: theme.core.borderRadius,
            gap: 10,
            borderWidth: 1,
            borderColor: theme.colors.border,
          }}
        >
          <Text
            style={{ textTransform: "uppercase", color: theme.colors.text }}
          >
            MAX LISTNERS
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: theme.colors.textMuted,
                fontSize: theme.headerFont.h1,
              }}
            >
              {maxListners}
            </Text>
            <View style={{ flexDirection: "row", gap: 10 }}>
              <Pressable
                style={{
                  width: 40,
                  height: 40,
                  backgroundColor: theme.colors.card,
                  borderRadius: theme.core.circle,
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onPress={() =>
                  maxListners > 1 && setMaxListners(maxListners - 1)
                }
              >
                <MaterialIcons name="remove" size={24} color="white" />
              </Pressable>
              <Pressable
                style={{
                  width: 40,
                  height: 40,
                  backgroundColor: theme.colors.card,
                  borderRadius: theme.core.circle,
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onPress={() => setMaxListners(maxListners + 1)}
              >
                <MaterialIcons name="add" size={24} color="white" />
              </Pressable>
            </View>
          </View>
        </View>
        <View
          style={{
            backgroundColor: theme.colors.surface,
            padding: 10,
            borderRadius: theme.core.borderRadius,
            gap: 10,
            borderWidth: 1,
            borderColor: theme.colors.border,
          }}
        >
          <Text
            style={{ textTransform: "uppercase", color: theme.colors.text }}
          >
            Broadcast Quality
          </Text>
          <View style={{ gap: 10 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontWeight: "bold",
                    color: theme.colors.text,
                    fontSize: theme.headerFont.h2,
                  }}
                >
                  Ultra-Sync Mode
                </Text>
                <Text style={{ color: theme.colors.textMuted }}>
                  Prioritize sub-100ms latency for real-time reactions.
                </Text>
              </View>
              <Pressable
                style={{
                  width: 60,
                  height: 30,
                  backgroundColor: ultraSync
                    ? theme.colors.secondary
                    : theme.colors.card,
                  borderRadius: theme.core.circle,
                  justifyContent: "center",
                  position: "relative",
                }}
                onPress={() => setUltraSync(!ultraSync)}
              >
                <View
                  style={{
                    width: 25,
                    height: 25,
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: theme.core.circle,
                    backgroundColor: ultraSync
                      ? theme.colors.card
                      : theme.colors.surface,
                    position: "absolute",
                    left: ultraSync ? 0 : 25,
                    marginLeft: 5,
                  }}
                ></View>
              </Pressable>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontWeight: "bold",
                    color: theme.colors.text,
                    fontSize: theme.headerFont.h2,
                  }}
                >
                  Lossless Audio
                </Text>
                <Text style={{ color: theme.colors.textMuted }}>
                  Broadcast in high-fidelity FLAC quality.
                </Text>
              </View>
              <Pressable
                style={{
                  width: 60,
                  height: 30,
                  backgroundColor: lossless
                    ? theme.colors.secondary
                    : theme.colors.card,
                  borderRadius: theme.core.circle,
                  justifyContent: "center",
                  position: "relative",
                }}
                onPress={() => setLossless(!lossless)}
              >
                <View
                  style={{
                    width: 25,
                    height: 25,
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: theme.core.circle,
                    backgroundColor: lossless
                      ? theme.colors.card
                      : theme.colors.surface,
                    position: "absolute",
                    left: lossless ? 0 : 25,
                    marginLeft: 5,
                  }}
                ></View>
              </Pressable>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontWeight: "bold",
                    color: theme.colors.text,
                    fontSize: theme.headerFont.h2,
                  }}
                >
                  Visualizer Sync
                </Text>
                <Text style={{ color: theme.colors.textMuted }}>
                  Synchronize lighting and visual effects across all clients.
                </Text>
              </View>
              <Pressable
                style={{
                  width: 60,
                  height: 30,
                  backgroundColor: visualizer
                    ? theme.colors.secondary
                    : theme.colors.card,
                  borderRadius: theme.core.circle,
                  justifyContent: "center",
                  position: "relative",
                }}
                onPress={() => setVisualizer(!visualizer)}
              >
                <View
                  style={{
                    width: 25,
                    height: 25,
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: theme.core.circle,
                    backgroundColor: visualizer
                      ? theme.colors.card
                      : theme.colors.surface,
                    position: "absolute",
                    left: visualizer ? 0 : 25,
                    marginLeft: 5,
                  }}
                ></View>
              </Pressable>
            </View>
          </View>
        </View>
        <TouchableOpacity onPress={() => createRoom()}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              backgroundColor: theme.colors.primary,
              padding: 20,
              borderRadius: theme.core.circle,
              justifyContent: "center",
            }}
          >
            <Text style={{ fontWeight: "bold", fontSize: theme.headerFont.h2 }}>
              Launch Room
            </Text>
            <MaterialIcons name="rocket-launch" size={24} color="black" />
          </View>
        </TouchableOpacity>
      </View>
      {/* Form end */}
      <View style={{ height: 100 }} />
    </ScrollView>
  );
};

export default createRoom;
