import {
  View,
  Text,
  TextInput,
  Pressable,
  Touchable,
  TouchableOpacity,
  Alert,
  ToastAndroid,
} from "react-native";
import React, { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import { MaterialIcons } from "@expo/vector-icons";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import APP_URL from "../../ip.config";
const fotgot = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const rotate = useSharedValue(0);

  const submitHandler = async () => {
    if (!email.trim()) {
      Alert.alert("Error", "All fields are required");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(`${APP_URL}/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      });
      const data = await res.json();
      if(res.status === 429) {
        router.replace("/verify-otp");
      }
      if (res.ok) {
        setLoading(false);
        console.log(data);
        ToastAndroid.show(
          "Verification code sent to your email",
          ToastAndroid.SHORT,
        );
        await SecureStore.setItemAsync(
          "otp_expiry",
          String(data?.data),
        );
        router.replace({
          pathname: "/verify-otp",
          params: { email },
        });
      } else {
        setLoading(false);
        Alert.alert("Error", data.message);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      Alert.alert("Error", "Something went wrong");
    }
  };

  useEffect(() => {
    if (loading) {
      rotate.value = withRepeat(
        withTiming(360, {
          duration: 800,
          easing: Easing.linear,
        }),
        -1,
      );
    } else {
      rotate.value = 0;
    }
  }, [loading]);

  const rotateStyles = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotate.value}deg` }],
    };
  });

  return (
    <LinearGradient
      colors={["#0f2027", "#000000"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1, paddingHorizontal: 20 }}
    >
      <View style={{ alignItems: "center", marginTop: 80 }}>
        <Image
          source={require("../../assets/images/Hero/logo.png")}
          style={{ width: 80, height: 80 }}
        />
        <Text style={{ fontSize: 40, fontWeight: "bold", color: "#fff" }}>
          Forgot Password
        </Text>
        <Text style={{ color: "#aaa", marginTop: 6 }}>
          Enter your email to receive a verification code.
        </Text>
      </View>

      {/* Form */}
      <View style={{ marginTop: 40 }}>
        <Text style={{ color: "#fff" }}>Email Address</Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#1a1a1a",
            padding: 10,
            marginTop: 8,
            borderRadius: 8,
            gap: 5,
          }}
        >
          <MaterialIcons name="email" size={24} color="#aaa" />
          <TextInput
            style={{ color: "#fff" }}
            placeholder="Enter your email address"
            placeholderTextColor="#aaa"
            inputMode="email"
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
        </View>
        <TouchableOpacity
          style={[
            {
              alignItems: "center",
              marginTop: 16,
              padding: 16,
              backgroundColor: "#00e5ff",
              borderRadius: 8,
              flexDirection: "row",
              justifyContent: "center",
              gap: 8,
            },
          ]}
          onPress={submitHandler}
          disabled={loading}
        >
          <Text style={{ color: "#111", fontSize: 16, fontWeight: "bold" }}>
            Send Verification Code
          </Text>
          <Animated.View style={[rotateStyles]}>
            <MaterialIcons
              name={loading ? "sync" : "send"}
              size={24}
              color="#111"
            />
          </Animated.View>
        </TouchableOpacity>
      </View>
      {/* Form End */}
    </LinearGradient>
  );
};

export default fotgot;
