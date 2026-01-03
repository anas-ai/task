import React from "react";
import { StyleSheet, Text, View } from "react-native";

const FruitsInfo = ({ fruit }: any) => {
  if (!fruit) return null;
  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          backgroundColor: "#F7F8BF",
          elevation: 2,
          borderRadius: 10,
          padding: 15,
          marginTop: 50,
        }}
      >
        <Text style={styles.titleText}>Fruit Info</Text>
        <View style={{ marginVertical: 10 }}>
          <Text style={{ color: "black",  }}>
            Fruit Name: {fruit.name}
          </Text>
          <Text style={{ color: "black", }}>
            Fruit Family: {fruit.family}
          </Text>
        </View>

        <Text style={[styles.titleText, { marginVertical: 20 }]}>
          Nutrition of that fruit
        </Text>
        <View>
          <Text>Calories: {fruit.nutritions.calories}</Text>
          <Text>Sugar: {fruit.nutritions.sugar}</Text>
          <Text>Carbohydrates: {fruit.nutritions.carbohydrates}</Text>
          <Text>Protein: {fruit.nutritions.protein}</Text>
        </View>
      </View>
    </View>
  );
};

export default FruitsInfo;

const styles = StyleSheet.create({
  titleText: {
    fontSize: 24,
    color: "black",
    fontWeight: "bold",
  },
});
