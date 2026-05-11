import { router } from "expo-router";
import React, { useEffect } from "react";
import * as SecureStore from "expo-secure-store";

const Index = () => {
  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await SecureStore.getItemAsync("token");
        if (token) {
          router.replace("/home");
        } else {
          router.replace("/Hero");
        }
      } catch (error) {
        console.log(error);
        router.replace("/Hero");
      }
    };
    checkToken();
  }, []);

  return null;
};

export default Index;
