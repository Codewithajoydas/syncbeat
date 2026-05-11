import {
  View,
  Text,
  TextInput,
  Pressable,
  Touchable,
  TouchableOpacity,
  Alert,
  ToastAndroid,
  StyleSheet,
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
import APP_URL from "../../ip.config";
const fotgot = () => {
  const { email } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const rotate = useSharedValue(0);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const resetPassword = async () => {
    setLoading(true);
    if (!password.trim()) {
      setLoading(false);
      Alert.alert("Error", "All fields are required");
      return;
    }
    if (password !== confirmPassword) {
      setLoading(false);
      Alert.alert("Error", "Passwords do not match");
      return;
    }
    try {
      const res = await fetch(
        `${APP_URL}/auth/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        },
      );
      const data = await res.json();
      if (res.ok) {
        setLoading(false);
        ToastAndroid.show("Password reset successfully", ToastAndroid.SHORT);
        router.replace("/SignIn");
      } else {
        console.log(data);
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
          Reset Password
        </Text>
        <Text style={{ color: "#aaa", marginTop: 6 }}>
          Set your new password to continue
        </Text>
        {/* form */}
        <View style={{ marginTop: 40, width: "100%" }}>
          <Text style={styles.label}>New Password</Text>
          <View
            style={[
              { flexDirection: "row", alignItems: "center" },
              styles.input,
            ]}
          >
            <MaterialIcons
              name="password"
              size={24}
              color="#aaa"
              style={{ marginRight: 10 }}
            />
            <TextInput
              placeholder="New Password"
              placeholderTextColor={"#aaa"}
              secureTextEntry={!showPassword}
              style={{ flex: 1, color: "#fff" }}
              value={password}
              onChangeText={(text) => setPassword(text)}
            />
            <Pressable onPress={() => setShowPassword(!showPassword)}>
              <MaterialIcons
                name={showPassword ? "visibility" : "visibility-off"}
                size={24}
                color="#aaa"
              />
            </Pressable>
          </View>
          <Text style={styles.label}>Confirm Password</Text>
          <View
            style={[
              { flexDirection: "row", alignItems: "center" },
              styles.input,
            ]}
          >
            <MaterialIcons
              name="password"
              size={24}
              color="#aaa"
              style={{ marginRight: 10 }}
            />
            <TextInput
              placeholder="Confirm Password"
              placeholderTextColor={"#aaa"}
              secureTextEntry={!showConfirmPassword}
              style={{ flex: 1, color: "#fff" }}
              value={confirmPassword}
              onChangeText={(text) => setConfirmPassword(text)}
            />
            <Pressable
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <MaterialIcons
                name={showConfirmPassword ? "visibility" : "visibility-off"}
                size={24}
                color="#aaa"
              />
            </Pressable>
          </View>

          <TouchableOpacity
            style={{
              alignItems: "center",
              marginTop: 16,
              padding: 16,
              backgroundColor: "#00e5ff",
              borderRadius: 8,
              flexDirection: "row",
              justifyContent: "center",
              gap: 8,
            }}
            onPress={() => resetPassword()}
          >
            <Text style={{ fontWeight: "bold" }}>
              {loading ? "Password resetting..." : "Reset Password"}
            </Text>
            <Animated.View style={[rotateStyles]}>
              <MaterialIcons name={loading ? "sync" : "lock"} size={24} />
            </Animated.View>
          </TouchableOpacity>
        </View>
        {/* form end */}
      </View>

      {/* Form End */}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  label: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    backgroundColor: "#1a1a1a",
    borderRadius: 10,
    padding: 10,
  },
});

export default fotgot;
