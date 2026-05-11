import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Alert,
  ToastAndroid,
} from "react-native";
import React, { use, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import { MaterialIcons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import * as SecureStore from "expo-secure-store";
import * as Linking from "expo-linking";
import Animated, {
  useSharedValue,
  withTiming,
  withRepeat,
  Easing,
  useAnimatedStyle,
} from "react-native-reanimated";
import * as Google from "expo-auth-session/providers/google";
import * as AuthSession from "expo-auth-session";
import APP_URL from "../../ip.config";

WebBrowser.maybeCompleteAuthSession();

const SignIn = () => {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const rotation = useSharedValue(0);
  const handleGoogleLogin = async () => {
    const result = await WebBrowser.openAuthSessionAsync(
      "https://rumbling-research-eel.ngrok-free.dev/auth/google",
      "syncbeat://SignIn",
    );
    if (result.type === "success") {
      const params = result.url;
      const parseToken = Linking.parse(params)?.queryParams?.token;
      await SecureStore.setItemAsync("token", parseToken);
      ToastAndroid.show("Login successful", ToastAndroid.SHORT);
      router.replace("/home");
    } else if (result.type === "dismiss") {
      Alert.alert("Error", "Login cancelled");
    }
  };

  const handleFacebookLogin = async () => {
    const result = await WebBrowser.openAuthSessionAsync(
      "https://rumbling-research-eel.ngrok-free.dev/auth/facebook",
      "syncbeat://SignIn",
    );
    if (result.type === "success") {
      const params = result.url;
      const parseToken = Linking.parse(params)?.queryParams?.token;
      await SecureStore.setItemAsync("token", parseToken);
      router.replace("/home");
    } else if (result.type === "dismiss") {
      Alert.alert("Error", "Login cancelled");
    }
  }
  useEffect(() => {
    if (loading) {
      rotation.value = withRepeat(
        withTiming(360, {
          duration: 1000,
          easing: Easing.linear,
        }),
        -1,
      );
    } else {
      rotation.value = 0;
    }
  }, [loading]);

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const submitHandler = async () => {
    setLoading(true);
    if (!email?.trim() || !password?.trim()) {
      setLoading(false);
      Alert.alert("Error", "All fields are required");
      return;
    }
    try {
      const res = await fetch(`${APP_URL}/users/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setLoading(false);
        const token = data.data[0].token;
        await SecureStore.setItemAsync("token", token);
        router.replace("/home");
      } else {
        setLoading(false);
        Alert.alert("Error", data.message);
      }
    } catch (error) {
      setLoading(false);
      Alert.alert("Error", "Something went wrong");
    }
  };

  return (
    <LinearGradient
      colors={["#0f2027", "#000000"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1, paddingHorizontal: 20 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <Pressable
          onPress={() => router.back()}
          style={{
            position: "absolute",
            top: 50,
            left: 0,
            zIndex: 1,
          }}
        >
          <MaterialIcons name="arrow-back" size={34} color="#fff" />
        </Pressable>
        {/* Header */}
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginTop: 80,
          }}
        >
          <Image
            source={require("../../assets/images/Hero/logo.png")}
            style={{ width: 80, height: 80 }}
          />
          <Text style={{ fontSize: 40, fontWeight: "bold", color: "#fff" }}>
            Welcome Back
          </Text>
          <Text style={{ color: "#aaa", marginTop: 6 }}>
            Sign to sync your pulse with the world
          </Text>
        </View>
        {/* Header End */}
        {/* Form */}
        <View style={{ marginTop: 40 }}>
          <Text style={styles.label}>Email Address</Text>
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

          <Text style={[styles.label, { marginTop: 16 }]}>Password</Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#1a1a1a",
              padding: 8,
              marginTop: 8,
              borderRadius: 8,
              gap: 5,
            }}
          >
            <MaterialIcons name="lock" size={24} color="#aaa" />
            <TextInput
              style={{ color: "#fff" }}
              placeholder="Enter your password"
              placeholderTextColor="#aaa"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={(text) => setPassword(text)}
            />
            <Pressable
              style={{ position: "absolute", right: 10 }}
              onPress={() => setShowPassword(!showPassword)}
            >
              <MaterialIcons
                name={showPassword ? "visibility" : "visibility-off"}
                size={24}
                color="#aaa"
              />
            </Pressable>
          </View>

          <Pressable
            style={{ alignItems: "flex-end", marginTop: 2 }}
            android_ripple="#00e5ff"
            onPress={() => router.push("/forgot-password")}
          >
            <Text style={{ color: "#00e5ff", fontSize: 12 }}>
              Forgot Password?
            </Text>
          </Pressable>
          <Pressable
            style={{
              alignItems: "center",
              marginTop: 20,
              padding: 16,
              backgroundColor: "#00e5ff",
              borderRadius: 30,
              flexDirection: "row",
              justifyContent: "center",
              gap: 8,
              opacity: loading ? 0.5 : 1,
            }}
            onPress={submitHandler}
          >
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>
              {loading ? "Signing In..." : "Sign In"}
            </Text>
            <Animated.View style={animatedStyles}>
              <MaterialIcons
                name={loading ? "sync" : "arrow-forward"}
                size={24}
              />
            </Animated.View>
          </Pressable>

          {/* saparetor */}
          <View
            style={{
              alignItems: "center",
              marginTop: 30,
              gap: 10,
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <View
              style={{ width: 100, height: 1, backgroundColor: "#aaa" }}
            ></View>
            <Text style={{ textAlign: "center", color: "#aaa" }}>
              Or Sign In With
            </Text>
            <View
              style={{ width: 100, height: 1, backgroundColor: "#aaa" }}
            ></View>
          </View>
          {/* saparetor end */}

          {/* social Logins */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 20,
              marginTop: 20,
            }}
          >
            <Pressable
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                backgroundColor: "#1a1a1a",
                padding: 8,
                paddingHorizontal: 16,
                borderRadius: 8,
              }}
              onPress={handleFacebookLogin}
            >
              <Image
                source={require("../../assets/images/social-icons/facebook.png")}
                style={{ width: 50, height: 50, objectFit: "contain" }}
              />
              <Text style={{ color: "#fff" }}>Facebook</Text>
            </Pressable>

            <Pressable
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                backgroundColor: "#1a1a1a",
                padding: 8,
                paddingHorizontal: 16,
                borderRadius: 8,
              }}
              onPress={handleGoogleLogin}
            >
              <Image
                source={require("../../assets/images/social-icons/google.png")}
                style={{ width: 50, height: 50, objectFit: "contain" }}
              />
              <Text style={{ color: "#fff" }}>Google</Text>
            </Pressable>
          </View>
          {/* social Logins End*/}
          <View style={{ alignItems: "center", marginTop: 50 }}>
            <Text style={{ color: "#fff" }}>
              Don't have an account?{" "}
              <Link href="/Signup" style={{ color: "#00e5ff" }}>
                <Text>Create Account</Text>
              </Link>
            </Text>
          </View>
        </View>
        {/* Form End */}
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  label: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
});
export default SignIn;
