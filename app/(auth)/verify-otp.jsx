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
import { router, useLocalSearchParams } from "expo-router";
import * as SecureStore from "expo-secure-store";
import formateTime from "../../hooks/utils/formateTime";
const fotgot = () => {
  const { email } = useLocalSearchParams();
  const [seconds, setSeconds] = useState(0);
  const [expiresAt, setExpiresAt] = useState(null);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const rotate = useSharedValue(0);

  const submitHandler = async () => {
    if (!otp.trim()) {
      Alert.alert("Error", "All fields are required");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(
        "https://rumbling-research-eel.ngrok-free.dev/auth/verify-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            otp,
          }),
        },
      );
      const data = await res.json();
      if (res.ok) {
        setLoading(false);
        ToastAndroid.show(
          "Verification code sent to your email",
          ToastAndroid.SHORT,
        );
        router.replace({ pathname: "/reset-password", params: { email } });
      } else {
        setLoading(false);
        Alert.alert("Error", data.message);
      }
    } catch (error) {
      setLoading(false);
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

  useEffect(() => {
    const getExpiryTime = async () => {
      const expiryTime = await SecureStore.getItemAsync("otp_expiry");
      if (expiryTime) {
        setExpiresAt(parseInt(expiryTime));
      }
    };

    getExpiryTime();
  }, []);
  useEffect(() => {
    if (!expiresAt) return;

    const interval = setInterval(() => {
      const remaining = Math.max(
        0,
        Math.floor((expiresAt - Date.now()) / 1000),
      );

      setSeconds(remaining);
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt]);

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
          Verify Your Email
        </Text>
        <Text style={{ color: "#aaa", marginTop: 6 }}>
          Enter your OTP to verify your email
        </Text>
      </View>

      {/* Form */}
      <View style={{ marginTop: 40 }}>
        <Text style={{ color: "#fff" }}>Enter OTP</Text>
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
          <MaterialIcons name="lock" size={24} color="#aaa" />
          <TextInput
            style={{ color: "#fff" }}
            placeholder="Enter your OTP"
            placeholderTextColor="#aaa"
            value={otp}
            onChangeText={(text) => setOtp(text)}
          />
        </View>
        <Pressable
          disabled={seconds > 0}
          onPress={async () => {
            try {
              const res = await fetch(
                "https://rumbling-research-eel.ngrok-free.dev/auth/forgot-password",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ email }),
                },
              );

              const data = await res.json();

              if (res.ok) {
                await SecureStore.setItemAsync(
                  "otp_expiry",
                  String(data?.data),
                );
                setExpiresAt(data?.data);
                ToastAndroid.show("OTP sent successfully", ToastAndroid.SHORT);
              } else {
                Alert.alert("Error", data.message);
              }
            } catch (err) {
              Alert.alert("Error", "Failed to resend OTP");
            }
          }}
        >
          <Text
            style={{ color: seconds > 0 ? "#555" : "#00e5ff", marginTop: 10 }}
          >
            {seconds > 0
              ? `Resend OTP in ${formateTime(seconds)}`
              : "Resend OTP"}
          </Text>
        </Pressable>
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
            Verify the code
          </Text>
          <Animated.View style={[rotateStyles]}>
            <MaterialIcons
              name={loading ? "sync" : "arrow-forward"}
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
