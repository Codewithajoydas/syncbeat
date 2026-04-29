import {
  View,
  Text,
  ImageBackground,
  FlatList,
  Pressable,
  StyleSheet,
} from "react-native";
import React, { useEffect } from "react";
import { Image } from "expo-image";
import { MaterialIcons } from "@expo/vector-icons";
import { Link, router } from "expo-router";


const Hero = () => {

  const cards = [
    { label: "Zero Latency", icon: "flash-on", color: "#1DB954" },
    { label: "Live Groups", icon: "groups", color: "#00F5FF" },
    { label: "HD Stream", icon: "high-quality", color: "#7000FF" },
    { label: "Cloud Sync", icon: "sync", color: "#D1BCFF" },
  ];

  return (
    <ImageBackground
      source={require("../../assets/images/Hero/Futuristic_grid_with_teal_glow.png")}
      style={styles.container}
    >
    

      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require("../../assets/images/Hero/logo.png")}
          style={styles.logo}
        />
        <Text style={styles.title}>SyncBeat</Text>
        <Text style={styles.subtitle}>Your music, Perfectly aligned</Text>
      </View>

      {/* Cards */}
      <View style={styles.cardsWrapper}>
        <FlatList
          data={cards}
          numColumns={2}
          keyExtractor={(item) => item.label}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <MaterialIcons name={item.icon} size={35} color={item.color} />
              <Text style={styles.cardText}>{item.label}</Text>
            </View>
          )}
        />
      </View>

      {/* Get Started */}
      <View style={styles.bottom}>
        <Pressable style={styles.button} onPress={()=>router.push("/Signup")}> 
          <Text style={styles.buttonText}>Get Started</Text>
          <MaterialIcons name="keyboard-arrow-right" size={40} />
        </Pressable>

        <View style={styles.loginRow}>
          <Text style={{ color: "white" }}>Already have an account?</Text>
          <Link style={{ color: "#fff" }} href="/SignIn">
            Login
          </Link>
        </View>
      </View>
    </ImageBackground>
  );
};

export default Hero;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    alignItems: "center",
    marginTop: 100,
  },

  logo: {
    width: 80,
    height: 80,
  },

  title: {
    fontSize: 40,
    fontWeight: "bold",
    color: "white",
  },

  subtitle: {
    fontSize: 16,
    color: "white",
    letterSpacing: 2,
  },

  cardsWrapper: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 100,
  },

  card: {
    width: 160,
    height: 100,
    borderWidth: 0.2,
    borderColor: "white",
    borderRadius: 10,
    margin: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#181818c5",
  },

  cardText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },

  bottom: {
    alignItems: "center",
    position: "absolute",
    bottom: 50,
    width: "100%",
  },

  button: {
    alignItems: "center",
    backgroundColor: "#00F5FF",
    padding: 15,
    borderRadius: 100,
    width: "90%",
    flexDirection: "row",
    justifyContent: "center",
  },

  buttonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
  },

  loginRow: {
    flexDirection: "row",
    marginTop: 20,
    gap: 5,
  },

  glow: {
    width: 300,
    height: 300,
    borderRadius: 150,
    borderColor: "#00F5FF",
    borderWidth: 0.3,
    position: "absolute",
    alignSelf: "center",
    top: 300,
    elevation: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  glowInner: {
    width: 200,
    height: 200,
    borderRadius: 150,
    borderColor: "#00F5FF",
    borderWidth: 0.3,
    alignSelf: "center",
    elevation: 10,
  },
  glowInnerInner: {
    width: 100,
    height: 100,
    borderRadius: 150,
    borderColor: "#00F5FF",
    borderWidth: 1,
    alignSelf: "center",
    elevation: 10,
  },
});
