import { MaterialIcons } from "@expo/vector-icons";
import {
  Alert,
  FlatList,
  Pressable,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";
import { theme } from "../../constants/theme";
import { useEffect, useMemo, useRef, useState } from "react";
import fetchPost from "../../hooks/utils/fetch_post";
import APP_URL from "../../ip.config";
import { Image } from "expo-image";
import { Modalize } from "react-native-modalize";
const CARDS = [
  {
    tag: "HOST MODE",
    tagIcon: "star",
    title: "Create Room",
    description:
      "Broadcast your session and control the master playback for everyone.",
    button: "START BROADCAST",
    buttonIcon: "arrow-forward-ios",
    supportIcon: "hub",
    color: theme.colors.primary,
    link: "/create-room",
  },

  {
    tag: "CLIENT MODE",
    tagIcon: "sync",
    title: "Join Room",
    description: "Join a session and control the master playback for everyone.",
    button: "FIND SESSIONS",
    buttonIcon: "search",
    supportIcon: "people",
    color: theme.colors.secondary,
    link: "/join-room",
  },
];

const Home = () => {
  const modalizeRef = useRef(null);
  const [rooms, setRooms] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const openModal = () => {
    modalizeRef.current?.open();
  };
  const fetchRooms = async () => {
    setRefreshing(true);
    const res = await fetchPost(`${APP_URL}/rooms/list`, {}, "GET");
    if (res.ok) {
      setRefreshing(false);
      setRooms(res.data.data.rooms);
    } else {
      setRefreshing(false);
      Alert.alert("Error", "Failed to fetch rooms");
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const deleteRoom = async (roomId) => {
    const res = await fetchPost(`${APP_URL}/rooms/delete`, { roomId }, "POST");
    if (res.ok) {
      fetchRooms();
      ToastAndroid.show("Room deleted successfully", ToastAndroid.SHORT);
    } else {
      Alert.alert("Error", `Failed to delete room: ${res.data.message}`);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={rooms}
        onRefresh={fetchRooms}
        refreshing={refreshing}
        keyExtractor={(item) => item.roomId.toString()}
        ListHeaderComponent={() => (
          <>
            {CARDS.map((item) => (
              <View
                key={item.title}
                style={{
                  marginHorizontal: 16,
                  marginVertical: 8,
                  backgroundColor: theme.colors.surface,
                  padding: 16,
                  borderRadius: theme.core.borderRadius,
                  gap: 10,
                  borderWidth: 1,
                  borderColor: theme.colors.border,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 3,
                    backgroundColor: theme.colors.card,
                    padding: 5,
                    borderRadius: theme.core.circle,
                    width: 150,
                    justifyContent: "center",
                  }}
                >
                  <MaterialIcons
                    name={item.tagIcon}
                    size={24}
                    color={item.color}
                  />

                  <Text style={{ color: item.color }}>{item.tag}</Text>
                </View>

                <Text
                  style={{
                    fontSize: 30,
                    fontWeight: "bold",
                    color: item.color,
                  }}
                >
                  {item.title}
                </Text>

                <Text
                  style={{
                    color: theme.colors.textMuted,
                  }}
                >
                  {item.description}
                </Text>

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => router.push(item.link)}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      backgroundColor: item.color,
                      padding: 20,
                      borderRadius: theme.core.circle,
                      justifyContent: "center",
                      gap: 10,
                    }}
                  >
                    <Text
                      style={{
                        color: theme.colors.dark,
                        fontSize: 18,
                        fontWeight: "bold",
                      }}
                    >
                      {item.button}
                    </Text>

                    <MaterialIcons
                      name={item.buttonIcon}
                      size={30}
                      color={theme.colors.dark}
                    />
                  </View>
                </TouchableOpacity>

                <View
                  style={{
                    position: "absolute",
                    top: 20,
                    right: 20,
                  }}
                >
                  <MaterialIcons
                    name={item.supportIcon}
                    size={60}
                    color={theme.colors.textMuted}
                  />
                </View>
              </View>
            ))}

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginHorizontal: 16,
                marginVertical: 8,
              }}
            >
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: theme.headerFont.h2,
                  color: theme.colors.text,
                }}
              >
                Recent Rooms
              </Text>

              <Text
                style={{
                  color: theme.colors.primary,
                }}
              >
                See all
              </Text>
            </View>
          </>
        )}
        renderItem={({ item }) => (
          <TouchableOpacity
            onLongPress={() => {
              setSelectedRoom(item)
              openModal()
            }}
            onPress={() => {
              router.push(`/room/${item.roomId}`);
            }}
            style={{
              marginHorizontal: 16,
              marginVertical: 8,
              gap: 10,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              borderWidth: 1,
              borderColor: theme.colors.border,
              padding: 10,
              borderRadius: theme.core.borderRadius,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                gap: 10,
                alignItems: "center",
              }}
            >
              <Image
                source={{
                  uri: item?.roomImage
                    ? item.roomImage
                    : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOlvdUGXkoyTrqu4q8GzGt1qBZ1bo0368pfQ&s",
                }}
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: theme.core.borderRadius,
                }}
              />

              <View>
                <Text
                  style={{
                    color: theme.colors.primary,
                    fontWeight: "bold",
                    fontSize: theme.headerFont.h3,
                  }}
                >
                  {item.roomName}
                </Text>

                <Text
                  style={{
                    color: theme.colors.textMuted,
                  }}
                >
                  Host: {item?.host?.name || "Unknown"}
                </Text>

                <View
                  style={{
                    flexDirection: "row",
                    gap: 5,
                    alignItems: "center",
                  }}
                >
                  <MaterialIcons
                    name="people"
                    size={24}
                    color={theme.colors.textMuted}
                  />

                  <Text
                    style={{
                      color: theme.colors.textMuted,
                    }}
                  >
                    {item.roomUsers.length} Listeners
                  </Text>
                </View>
              </View>
            </View>

            <Pressable
              style={{
                alignItems: "center",
                padding:10
              }}
              onPress={() => {
                setSelectedRoom(item);
                openModal();
              }}
            >
              <MaterialIcons
                name="more-vert"
                size={30}
                color={theme.colors.text}
              />
            </Pressable>
          </TouchableOpacity>
        )}
      />
      <Modalize
        ref={modalizeRef}
        adjustToContentHeight
        handlePosition="inside"
        modalStyle={{
          backgroundColor: theme.colors.dark,
          padding: 10,
          borderTopWidth: 0.2,
          borderTopColor: "#999",
        }}
        handleStyle={{
          backgroundColor: theme.colors.surface,
          borderRadius: theme.core.circle,
        }}
      >
        <View style={{ gap: 10, padding: 10 }}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: theme.colors.text,
              textAlign: "center",
            }}
          >
            {selectedRoom?.roomName}
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: theme.colors.secondary,
              textAlign: "center",
              letterSpacing: 1,
            }}
          >
            ACTIVE SESSION - {selectedRoom?.roomUsers?.length || 0} LISTENERS
          </Text>
          <View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: theme.colors.surface,
                padding: 10,
                borderRadius: theme.core.borderRadius,
              }}
            >
              <View style={{ flexDirection: "row", gap: 10 }}>
                <View
                  style={{
                    padding: 10,
                    borderRadius: theme.core.borderRadius,
                    backgroundColor: theme.colors.card,
                  }}
                >
                  <MaterialIcons
                    name="share"
                    size={24}
                    color={theme.colors.primary}
                  />
                </View>
                <View>
                  <Text
                    style={{
                      fontWeight: "bold",
                      color: theme.colors.text,
                      fontSize: theme.headerFont.h4,
                    }}
                  >
                    Share Invite Link
                  </Text>
                  <Text
                    style={{
                      color: theme.colors.textMuted,
                      fontSize: theme.headerFont.h5,
                    }}
                  >
                    Copy Link to clipboard
                  </Text>
                </View>
              </View>
              <Pressable>
                <MaterialIcons
                  name="content-copy"
                  size={24}
                  color={theme.colors.textMuted}
                />
              </Pressable>
            </View>
          </View>
          <View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: theme.colors.surface,
                padding: 10,
                borderRadius: theme.core.borderRadius,
              }}
            >
              <View style={{ flexDirection: "row", gap: 10 }}>
                <View
                  style={{
                    padding: 10,
                    borderRadius: theme.core.borderRadius,
                    backgroundColor: theme.colors.card,
                  }}
                >
                  <MaterialIcons
                    name="person-add-alt"
                    size={24}
                    color={theme.colors.primary}
                  />
                </View>
                <View>
                  <Text
                    style={{
                      fontWeight: "bold",
                      color: theme.colors.text,
                      fontSize: theme.headerFont.h4,
                    }}
                  >
                    Invite a Friend
                  </Text>
                  <Text
                    style={{
                      color: theme.colors.textMuted,
                      fontSize: theme.headerFont.h5,
                    }}
                  >
                    Choose from your contacts
                  </Text>
                </View>
              </View>
              <Pressable>
                <MaterialIcons
                  name="arrow-forward-ios"
                  size={24}
                  color={theme.colors.textMuted}
                />
              </Pressable>
            </View>
          </View>
          <View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: theme.colors.surface,
                padding: 10,
                borderRadius: theme.core.borderRadius,
              }}
            >
              <View style={{ flexDirection: "row", gap: 10 }}>
                <View
                  style={{
                    padding: 10,
                    borderRadius: theme.core.borderRadius,
                    backgroundColor: theme.colors.card,
                  }}
                >
                  <MaterialIcons
                    name="settings"
                    size={24}
                    color={theme.colors.textMuted}
                  />
                </View>
                <View>
                  <Text
                    style={{
                      fontWeight: "bold",
                      color: theme.colors.text,
                      fontSize: theme.headerFont.h4,
                    }}
                  >
                    Invite a Friend
                  </Text>
                  <Text
                    style={{
                      color: theme.colors.textMuted,
                      fontSize: theme.headerFont.h5,
                    }}
                  >
                    Privacy, Name, and role permissions
                  </Text>
                </View>
              </View>
              <Pressable>
                <MaterialIcons
                  name="arrow-forward-ios"
                  size={24}
                  color={theme.colors.textMuted}
                />
              </Pressable>
            </View>
          </View>
          <View
            style={{
              height: 1,
              backgroundColor: theme.colors.surface,
              marginVertical: 10,
            }}
          />
          <TouchableOpacity
            onPress={() => {
              if (selectedRoom?.roomId) {
                deleteRoom(selectedRoom?._id);
              }
            }}
          >
            <View
              style={{
                flexDirection: "row",
                gap: 10,
                backgroundColor: "#ff000025",
                padding: 10,
                borderRadius: theme.core.borderRadius,
              }}
            >
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "rgba(255, 0, 0, 0.31)",
                  padding: 10,
                  borderRadius: theme.core.borderRadius,
                }}
              >
                <MaterialIcons
                  name="delete"
                  size={24}
                  color={theme.colors.textMuted}
                />
              </View>
              <View>
                <Text style={{ fontWeight: "bold", color: theme.colors.text }}>
                  End Session
                </Text>
                <Text style={{ color: theme.colors.textMuted }}>
                  Disconnect all listeners and close room
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </Modalize>
    </View>
  );
};

export default Home;
