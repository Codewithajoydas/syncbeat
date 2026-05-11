import "react-native-gesture-handler";
import { MaterialIcons } from "@expo/vector-icons";
import { Slot, usePathname, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "../../constants/theme";
import { Image } from "expo-image";
import * as Network from "expo-network";
import { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
const tabs = [
  { name: "home", icon: "home", label: "Home" },
  { name: "social", icon: "people", label: "Social" },
  { name: "stats", icon: "bar-chart", label: "Stats" },
  { name: "settings", icon: "settings", label: "Settings" },
];

export default function Layout() {
  const router = useRouter();
  const pathname = usePathname();
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

  return (
    <>
      {/* Status bar text/icons */}
      <StatusBar style="light" />

      {/* TOP SAFE AREA (same as header color) */}
      <SafeAreaView
        edges={["top"]}
        style={{ backgroundColor: theme.colors.dark }}
      />

      {/* MAIN APP */}
        <SafeAreaView
          edges={["bottom"]}
          style={{ flex: 1, backgroundColor: theme.colors.bg }}
        >
          {/* SCREEN CONTENT */}
          <View style={{ flex: 1 }}>
            <View style={[styles.header, { zIndex: 1 }]}>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
              >
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
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 15 }}
              >
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
                      color: isonline
                        ? theme.colors.success
                        : theme.colors.error,
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
            <Slot />
          </View>

          {/* TAB BAR */}
          <View
            style={{
              flexDirection: "row",
              backgroundColor: theme.colors.surface,
              height: 70,
              marginHorizontal: 15,
              marginBottom: 10,
              alignItems: "center",
            borderRadius: theme.core.borderRadius,
            }}
          >
            {tabs.map((tab) => {
              const focused = pathname.includes(tab.name);

              return (
                <Pressable
                  key={tab.name}
                  onPress={() => router.push(`/${tab.name}`)}
                  style={{ flex: 1 }}
                >
                  <View
                    style={{
                      backgroundColor: focused
                        ? theme.colors.primary
                        : theme.colors.card,
                      margin: 6,
                      borderRadius: theme.core.borderRadius,
                      padding: 10,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <MaterialIcons
                      name={tab.icon}
                      size={focused ? 28 : 22}
                      color={focused ? theme.colors.bg : theme.colors.textMuted}
                    />

                    <Text
                      style={{
                        color: focused
                          ? theme.colors.bg
                          : theme.colors.textMuted,
                        fontSize: 12,
                        fontWeight: focused ? "bold" : "normal",
                      }}
                    >
                      {tab.label}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </SafeAreaView>
    </>
  );
}

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
