import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ToastAndroid,
  Alert,
  FlatList,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "../../constants/theme";
import { StatusBar } from "expo-status-bar";
import { Image, ImageBackground } from "expo-image";
import * as Network from "expo-network";
import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import socket from "../../socket";
import * as MediaLibrary from "expo-media-library";
import { AudioPlayer, useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import formatTime from "../../hooks/utils/formateTime";
import { Dimensions } from "react-native";

const SCREEN_WIDTH = Dimensions.get("window").width;
const BAR_WIDTH = SCREEN_WIDTH - 40;
const Brodcast = () => {
  const [audioFiles, setAudioFiles] = useState([]);
  const [permission, setPermission] = useState(false);
  const [currentAudio, setCurrentAudio] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isLoop, setIsLoop] = useState(false);
  const player = useAudioPlayer();
  const status = useAudioPlayerStatus(player);
  const playAudio = async (item, index) => {
    try {
      setCurrentAudio(item);
      setCurrentIndex(index);

      await player.replace({
        uri: item.uri,
      });
      await player.play();
    } catch (error) {
      console.log(error);
    }
  };

  const playPauseSong = () => {
    if (status.playing) {
      player.pause();
    } else {
      if (currentAudio) {
        player.play();
      } else {
        audioFiles[0] && playAudio(audioFiles[0]);
      }
    }
  };

  const playNextSong = (clicked = false) => {
    if (audioFiles.length === 0) return;

    // LOOP CURRENT SONG
    if (isLoop && currentAudio && clicked === false) {
      playAudio(currentAudio, currentIndex);
      return;
    }

    // SHUFFLE MODE
    if (isShuffle) {
      const randomIndex = Math.floor(Math.random() * audioFiles.length);

      playAudio(audioFiles[randomIndex], randomIndex);
      return;
    }

    // NORMAL NEXT
    let nextIndex = currentIndex + 1;

    if (nextIndex >= audioFiles.length) {
      nextIndex = 0;
    }

    playAudio(audioFiles[nextIndex], nextIndex);
  };

  const playPreviousSong = () => {
    if (audioFiles.length === 0) return;

    let prevIndex = currentIndex - 1;

    if (prevIndex < 0) {
      prevIndex = audioFiles.length - 1;
    }

    playAudio(audioFiles[prevIndex], prevIndex);
  };

  useEffect(() => {
    if (status.duration > 0 && status.currentTime >= status.duration) {
      playNextSong();
    }
  }, [status.currentTime]);

  const requestPermission = async () => {
    const permission = await MediaLibrary.requestPermissionsAsync();
    if (permission.granted) {
      setPermission(true);
      ToastAndroid.show("Permission granted", ToastAndroid.SHORT);
    } else {
      setPermission(false);
      ToastAndroid.show("Permission not granted", ToastAndroid.SHORT);
    }
  };

  const getAllAudioFiles = async () => {
    try {
      if (permission) {
        const audioFiles = await MediaLibrary.getAssetsAsync({
          mediaType: MediaLibrary.MediaType.audio,
        });
        setAudioFiles(audioFiles.assets);
      } else {
        Alert.alert(
          "Permission required",
          "Please grant permission to access audio files",
          [
            {
              text: "Cancel",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel",
            },
            { text: "OK", onPress: () => requestPermission() },
          ],
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (permission) {
      getAllAudioFiles();
    }
  }, [permission]);
  useEffect(() => {
    requestPermission();
  }, []);

  const { roomid } = useLocalSearchParams();
  const [joined, setJoined] = useState(false);
  const songData = {
    title: "Digital Hyperdrive",
    artist: "Ajoy Das",
    duration: "10120223",
    cover:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDSFrM5HyYX-eOOT6ZPgqUKxfZdDhR7lnuSpMnl3ztFqH6R7jctK42wC19o1blhvVJOUeebDqc-tOIztDUtNNMKUTTR5coOsxmGrLdHkrE19MiJo5C_RJzRssva7OY8nMrWA6qKeJ_uQwikcGoK_6uf9A7K5BZzxE_OM3co-6ftEMpvRlpbqLnPd-a9NdHyJk0IOLhL5bD9WqIjZ444J2e_ZvyyRoxwRUc1Zu_rdUVFRg10fns9obNL2NpT-OaWoRQZUTny8_N_f4Q",
    url: "../assets/prettyjohn1-disco-funk-520385.mp3",
  };

  const [isonline, setisonline] = useState(true);
  useEffect(() => {
    const checkNetwork = async () => {
      const state = await Network.getNetworkStateAsync();
      setisonline(state.isConnected);
    };
    checkNetwork();
    const subscription = Network.addNetworkStateListener((state) => {
      setisonline(state.isConnected);
    });
    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    const handleConnect = () => {
      socket.emit("join-room", roomid);
    };
    socket.on("connect", handleConnect);
    socket.on("user-joined", () => {
      setJoined(true);
    });
    if (!socket.connected) {
      socket.connect();
    } else {
      handleConnect();
    }
    return () => {
      socket.emit("leave-room", roomid);
    };
  }, []);
  useEffect(() => {
    let timeout;
    if (joined) {
      timeout = setTimeout(() => {
        setJoined(false);
      }, 1000);
    }
    return () => clearTimeout(timeout);
  }, [joined]);

  return (
    <>
      {/* Status bar text/icons */}
      <StatusBar style="light" />

      {/* TOP SAFE AREA (same as header color) */}
      <SafeAreaView
        edges={["top"]}
        style={{ backgroundColor: theme.colors.dark }}
      />
      <SafeAreaView
        edges={["bottom"]}
        style={{ flex: 1, backgroundColor: theme.colors.bg }}
      >
        <View style={styles.header}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Image
              source={require("../../assets/images/Hero/logo.png")}
              style={{ width: 50, height: 50 }}
            />
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: theme.colors.text,
              }}
            >
              SyncBeat
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 15 }}>
            <View
              style={{
                padding: 5,
                paddingHorizontal: 15,
                backgroundColor: theme.colors.surface,
                borderRadius: theme.core.borderRadius,
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "bold",
                  color: isonline ? theme.colors.success : theme.colors.error,
                }}
              >
                {isonline ? "Ready to Stream" : "Offline"}
              </Text>
            </View>
            <Pressable>
              <Image
                source={require("../../assets/images/Hero/logo.png")}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: theme.core.circle,
                }}
              />
            </Pressable>
          </View>
        </View>

        <ScrollView style={{ flex: 1, padding: 10 }}>
          <View
            style={{
              position: "absolute",
              justifyContent: "center",
              alignItems: "center",
              top: 10,
              width: "100%",
              display: joined ? "flex" : "none",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                padding: 10,
                borderRadius: theme.core.circle,
                backgroundColor: theme.colors.secondary,
                zIndex: 10,
                justifyContent: "center",
              }}
            >
              <MaterialIcons name="people" size={18} />
              <Text
                style={{ fontSize: theme.headerFont.h6, fontWeight: "bold" }}
              >
                A New User Connnected
              </Text>
            </View>
          </View>
          <ImageBackground
            source={songData.cover}
            style={{
              height: 300,
              objectFit: "cover",
              borderRadius: theme.core.borderRadius,
              overflow: "hidden",
              position: "relative",
            }}
          >
            <View style={{ position: "absolute", bottom: 0, padding: 10 }}>
              <Text
                style={{
                  fontSize: theme.headerFont.h3,
                  fontWeight: "bold",
                  backgroundColor: theme.colors.primary,
                  padding: 5,
                  width: 280,
                  borderRadius: 5,
                  textAlign: "center",
                }}
              >
                CURRENTLY BROADCASTING
              </Text>
              <Text
                style={{
                  fontSize: 40,
                  fontWeight: "bold",
                  color: theme.colors.text,
                }}
                numberOfLines={1}
              >
                {songData.title}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  gap: 10,
                  padding: 5,
                  borderRadius: 5,
                }}
              >
                <Text style={{ color: theme.colors.primary }}>
                  {songData.artist} • {songData?.album ?? "Unknown Album"}
                </Text>
              </View>
            </View>
          </ImageBackground>

          <View
            style={{
              flexDirection: "row",
              gap: 10,
              marginVertical: 10,
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                gap: 10,
                flex: 1,
                backgroundColor: theme.colors.surface,
                borderRadius: theme.core.borderRadius,
                alignItems: "center",
                padding: 10,
              }}
            >
              <View
                style={{
                  alignItems: "center",
                  padding: 5,
                  backgroundColor: theme.colors.card,
                  borderRadius: theme.core.borderRadius,
                }}
              >
                <MaterialIcons
                  name="people"
                  size={34}
                  color={theme.colors.primary}
                />
              </View>
              <View>
                <Text style={{ color: theme.colors.textMuted }}>
                  Active Listeners
                </Text>
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: theme.headerFont.h2,
                    color: theme.colors.text,
                  }}
                >
                  120
                </Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                gap: 10,
                flex: 1,
                backgroundColor: theme.colors.surface,
                borderRadius: theme.core.borderRadius,
                alignItems: "center",
                padding: 10,
              }}
            >
              <View
                style={{
                  alignItems: "center",
                  padding: 5,
                  backgroundColor: theme.colors.card,
                  borderRadius: theme.core.borderRadius,
                }}
              >
                <MaterialIcons
                  name="electric-bolt"
                  size={34}
                  color={theme.colors.secondary}
                />
              </View>
              <View>
                <Text style={{ color: theme.colors.textMuted }}>
                  Sync Latency
                </Text>
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: theme.headerFont.h2,
                    color: theme.colors.text,
                  }}
                >
                  20ms
                </Text>
              </View>
            </View>
          </View>

          <View
            style={{
              backgroundColor: theme.colors.surface,
              padding: 10,
              borderRadius: theme.core.borderRadius,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{
                  fontSize: theme.headerFont.h1,
                  fontWeight: "bold",
                  color: theme.colors.text,
                }}
              >
                PlayList
              </Text>
              <MaterialIcons
                name="queue-music"
                size={30}
                color={theme.colors.text}
              />
            </View>

            {audioFiles.map((item, index) => (
              <TouchableOpacity
                onPress={() => {
                  playAudio(item, index);
                }}
                key={index}
                style={{
                  flexDirection: "row",
                  gap: 10,
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: 10,
                  backgroundColor: theme.colors.card,
                  borderRadius: theme.core.borderRadius,
                  marginTop: 10,
                  borderWidth: item.uri === currentAudio?.uri ? 0.2 : 0,
                  borderColor: theme.colors.primary,
                }}
              >
                <View style={{ flexDirection: "row", gap: 10, flex: 1 }}>
                  <Image
                    source={{
                      uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOlvdUGXkoyTrqu4q8GzGt1qBZ1bo0368pfQ&s",
                    }}
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: theme.core.borderRadius,
                    }}
                  />
                  <View style={{ flexDirection: "column", flex: 1 }}>
                    <Text
                      numberOfLines={1}
                      style={{
                        fontWeight: "bold",
                        fontSize: theme.headerFont.h5,
                        color: theme.colors.text,
                      }}
                    >
                      {item.filename ?? "Unknown Title"}
                    </Text>
                    <Text
                      numberOfLines={1}
                      style={{ color: theme.colors.textMuted }}
                    >
                      {item.artist ?? "Unknown Artist"}
                    </Text>
                  </View>
                </View>
                <Pressable onPress={() => playPauseSong()}>
                  {item.uri === currentAudio?.uri && (
                    <MaterialIcons
                      name={status.playing ? "music-note" : "play-arrow"}
                      size={30}
                      color={theme.colors.primary}
                    />
                  )}
                </Pressable>
              </TouchableOpacity>
            ))}
          </View>
          <View style={{ height: 200 }} />
        </ScrollView>
        {/* Music Player */}
        <View
          style={{
            backgroundColor: theme.colors.surface,
            borderRadius: 25,
            padding: 20,
            marginTop: 20,
            overflow: "hidden",
            position: "absolute",
            bottom: 0,
            width: "100%",

            borderWidth: 0.2,
            borderTopColor: theme.colors.primary,

            shadowColor: theme.colors.primary,
            shadowOffset: {
              width: 0,
              height: -4,
            },
            shadowOpacity: 0.3,
            shadowRadius: 10,

            elevation: 10,
          }}
        >
          {/* Top Time + Progress */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 15,
            }}
          >
            <Text
              style={{
                color: theme.colors.primary,
                fontWeight: "bold",
              }}
            >
              {formatTime(status.currentTime)}
            </Text>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
              }}
            >
              <MaterialIcons name="sync" size={16} color="#7A7F8A" />
              <Text
                style={{
                  color: "#7A7F8A",
                  fontSize: 12,
                  fontWeight: "bold",
                  letterSpacing: 2,
                  textTransform: "uppercase",
                }}
              >
                MASTER CLOCK
              </Text>
            </View>

            <Text
              style={{
                color: theme.colors.primary,
                fontWeight: "bold",
                justifyContent: "end",
              }}
            >
              {formatTime(status.duration)}
            </Text>
          </View>

          {/* Progress Bar */}
          <TouchableOpacity
            activeOpacity={1}
            onPress={(event) => {
              const touchX = event.nativeEvent.locationX;
              const percentage = touchX / BAR_WIDTH;
              const seekTime = percentage * status.duration;
              player.seekTo(seekTime);
            }}
            style={{
              width: BAR_WIDTH,
              height: 20, 
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {/* Actual Progress Bar */}
            <View
              style={{
                width: "100%",
                height: 6,
                backgroundColor: theme.colors.card,
                borderRadius: 20,
                overflow: "hidden",
                justifyContent: "center",
              }}
            >
              {/* Progress */}
              <View
                style={{
                  width: `${
                    status.duration
                      ? (status.currentTime / status.duration) * 100
                      : 0
                  }%`,
                  height: "100%",
                  backgroundColor: theme.colors.primary,
                  borderRadius: 20,
                }}
              />
            </View>

            {/* Thumb */}
            <View
              style={{
                position: "absolute",
                left: `${
                  status.duration
                    ? (status.currentTime / status.duration) * 100
                    : 0
                }%`,

                marginLeft: -10,

                width: 20,
                height: 20,
                borderRadius: 100,

                backgroundColor: theme.colors.text,

                shadowColor: theme.colors.primary,
                shadowOffset: {
                  width: 0,
                  height: 0,
                },
                shadowOpacity: 0.5,
                shadowRadius: 8,
                elevation: 5,
              }}
            />
          </TouchableOpacity>
          {/* Controls */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingHorizontal: 10,
              marginVertical: 10,
            }}
          >
            {/* Shuffle */}
            <TouchableOpacity onPress={() => setIsShuffle(!isShuffle)}>
              <MaterialIcons
                name="shuffle"
                size={28}
                color={
                  isShuffle ? theme.colors.primary : theme.colors.textMuted
                }
              />
            </TouchableOpacity>

            {/* Previous */}
            <TouchableOpacity onPress={playPreviousSong}>
              <MaterialIcons
                name="skip-previous"
                size={35}
                color={theme.colors.text}
              />
            </TouchableOpacity>

            {/* Play Pause */}
            <TouchableOpacity
              onPress={() => {
                playPauseSong();
              }}
              style={{
                width: 80,
                height: 80,
                borderRadius: 100,
                backgroundColor: theme.colors.primary,
                justifyContent: "center",
                alignItems: "center",
                shadowColor: theme.colors.primary,
                shadowOffset: {
                  width: 0,
                  height: 0,
                },
                shadowOpacity: 0.8,
                shadowRadius: 20,
                elevation: 10,
              }}
            >
              <MaterialIcons
                name={status.playing ? "pause" : "play-arrow"}
                size={40}
                color={theme.colors.dark}
              />
            </TouchableOpacity>

            {/* Next */}
            <TouchableOpacity onPress={playNextSong}>
              <MaterialIcons
                name="skip-next"
                size={35}
                color={theme.colors.text}
              />
            </TouchableOpacity>

            {/* Repeat */}
            <TouchableOpacity onPress={() => setIsLoop(!isLoop)}>
              <MaterialIcons
                name="repeat"
                size={28}
                color={isLoop ? theme.colors.primary : theme.colors.textMuted}
              />
            </TouchableOpacity>
          </View>
        </View>
        {/* Music Player End */}
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 70,
    backgroundColor: theme.colors.dark,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
});

export default Brodcast;
