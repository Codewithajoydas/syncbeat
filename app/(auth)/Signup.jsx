import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { CheckBox } from "react-native";
import { Link, router } from "expo-router";
import { Image } from "expo-image";
import AUTH_URL from "../../ip.config"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  Easing,
} from "react-native-reanimated";
const Signup = () => {
  const rotation = useSharedValue(0);
  const [checked, setCheck] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const submitHandler = async () => {
    if (loading) return;
    if (!checked) {
      Alert.alert("Error", "Please accept terms and conditions");
      return;
    }

    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert("Error", "All fields are required");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${AUTH_URL}/users/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      // handle non-JSON responses safely
      let data;
      try {
        data = await res.json();
      } catch {
        data = {};
      }

      if (!res.ok) {
        throw new Error(data?.message || "Something went wrong");
      }

      // success
      router.replace("/SignIn");
    } catch (err) {
      Alert.alert("Error", err.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (loading) {
      rotation.value = withRepeat(
        withTiming(360, {
          duration: 800,
          easing: Easing.linear,
        }),
        -1,
      );
    } else {
      rotation.value = 0;
    }
  }, [loading]);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotate: `${rotation.value}deg`,
        },
      ],
    };
  });
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
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          {/* HEADER */}
          <View style={styles.header}>
            <Image
              source={require("../../assets/images/Hero/logo.png")}
              style={{ width: 80, height: 80 }}
            />
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>
              Join the pulse of shared music discovery.
            </Text>
          </View>

          {/* FORM */}
          <View style={styles.form}>
            <Text style={styles.label}>Full Name</Text>
            <View style={styles.input}>
              <MaterialIcons name="person" size={24} color="#777" />
              <TextInput
                placeholder="Enter your full name"
                placeholderTextColor="#777"
                cursorColor={"#fff"}
                style={{ color: "#fff" }}
                value={name}
                onChangeText={(text) => setName(text)}
              />
            </View>

            <Text style={styles.label}>Email</Text>
            <View style={styles.input}>
              <MaterialIcons name="email" size={24} color="#777" />
              <TextInput
                placeholder="Enter your email"
                placeholderTextColor="#777"
                cursorColor={"#fff"}
                style={{ color: "#fff" }}
                value={email}
                onChangeText={(text) => setEmail(text)}
              />
            </View>

            <Text style={styles.label}>Password</Text>
            <View style={styles.input}>
              <MaterialIcons name="password" size={24} color="#777" />
              <TextInput
                placeholder="Enter your password"
                placeholderTextColor="#777"
                cursorColor={"#fff"}
                style={{ color: "#fff" }}
                secureTextEntry={!passwordVisible}
                value={password}
                onChangeText={(text) => setPassword(text)}
              />
              <Pressable
                style={{ position: "absolute", right: 20 }}
                onPress={() => setPasswordVisible(!passwordVisible)}
              >
                <MaterialIcons
                  name={passwordVisible ? "visibility" : "visibility-off"}
                  size={24}
                  color="#777"
                />
              </Pressable>
            </View>
            {/* TERMS */}
            <Pressable
              style={{ flexDirection: "row", gap: 10, alignItems: "center" }}
              onPress={() => setCheck(!checked)}
            >
              <View
                style={[
                  styles.checkbox,
                  { backgroundColor: checked ? "#00e5ff" : "#1a1a1a" },
                ]}
              >
                {checked && (
                  <MaterialIcons name="check" size={16} color="#fff" />
                )}
              </View>
              <Text style={[styles.terms]}>
                I agree to the{" "}
                <Link href="/terms" style={{ color: "#00e5ff" }}>
                  <Text>Terms of Service</Text>
                </Link>{" "}
                and{" "}
                <Link href="/privacy" style={{ color: "#00e5ff" }}>
                  <Text>Privacy Policy</Text>
                </Link>
              </Text>
            </Pressable>

            {/* BUTTON */}
            <Pressable style={[styles.button, { opacity: loading ? 0.5 : 1 }]} onPress={() => submitHandler()}>
              <Text style={styles.buttonText}> Create Account</Text>
              <Animated.View style={animatedStyle}>
                <MaterialIcons
                  name={loading ? "sync" : "arrow-forward"}
                  size={24}
                />
              </Animated.View>
            </Pressable>

            {/* FOOTER */}
            <Text style={styles.footer}>
              Already have an account?{" "}
              <Link href="/SignIn">
                <Text style={{ color: "#00e5ff" }}>Sign In</Text>
              </Link>
            </Text>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default Signup;

const styles = StyleSheet.create({
  header: {
    marginTop: 80,
    marginBottom: 40,
    alignItems: "center",
  },
  title: {
    fontSize: 40,
    fontWeight: "700",
    color: "#fff",
  },
  subtitle: {
    color: "#aaa",
    marginTop: 6,
  },
  form: {
    gap: 12,
  },
  label: {
    color: "#ccc",
    fontSize: 12,
    fontWeight: "bold",
  },
  input: {
    backgroundColor: "#1a1a1a",
    borderRadius: 10,
    padding: 10,
    color: "#fff",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  terms: {
    color: "#777",
    fontSize: 12,
  },
  button: {
    backgroundColor: "#00e5ff",
    padding: 16,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 20,
    elevation: 10,
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },
  buttonText: {
    color: "#000",
    fontWeight: "600",
    fontSize: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  footer: {
    color: "#aaa",
    textAlign: "center",
    marginTop: 20,
  },
  checkbox: {
    backgroundColor: "#1a1a1a",
    borderRadius: 5,
    color: "#fff",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderWidth: 0.3,
    borderColor: "#aaa",
    minWidth: 20,
    minHeight: 20,
    justifyContent: "center",
  },
});
