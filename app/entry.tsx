import { store } from "@/store/store";
import React from "react";
import { View } from "react-native";
import { Provider } from "react-redux";
import Index from "../app/index";

const entry = () => {
  return (
    <View>
      <Provider store={store}>
        <Index />
      </Provider>
    </View>
  );
};

export default entry;
