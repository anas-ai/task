import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const FruitsList = ({
  data,
  onSearch,
  onSelect,
  loading,
}: {
  data: any[];
  onSearch: (text: string) => void;
  onSelect: (item: any) => void;
  loading: boolean;
}) => {
  const [text, setText] = useState("");
  const [hasSearch, setHasSearch] = useState(false);

  const handleSearch = () => {
    const query = text.trim();
    onSearch(query);
    setHasSearch(query.length > 0);
  };

  return (
    <View>
      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <TextInput
            placeholder="Type to Search Fruit ... "
            placeholderTextColor="gray"
            style={{ flex: 1 }}
            value={text}
            onChangeText={setText}
          />
        </View>
        <TouchableOpacity style={styles.buttonContainer} onPress={handleSearch}>
          {loading ? (
            <ActivityIndicator color={"white"} size={"small"} />
          ) : (
            <Text style={styles.buttonText}>Search</Text>
          )}
        </TouchableOpacity>
      </View>

        <FlatList
          data={data}
          keyExtractor={(item) => item.id.toString()}
          ListEmptyComponent={
            hasSearch ? (
              <Text style={{ marginTop: 20 }}>No fruits found</Text>
            ) : null
          }
          renderItem={({ item, index }) => (
            <View
              style={{
                paddingVertical: 10,
                flexDirection: "row",
                justifyContent: "space-between",
                borderBottomColor: "black",
                borderBottomWidth: 0.5,
                marginTop: index === 0 ? 14 : 0,
              }}
            >
              <Text>{item.name}</Text>
              <TouchableOpacity
                style={[styles.buttonContainer, { backgroundColor: "green" }]}
                onPress={() => onSelect(item)}
              >
                <Text style={styles.buttonText}>Info</Text>
              </TouchableOpacity>
            </View>
          )}
        />
    
    </View>
  );
};

export default FruitsList;

const styles = StyleSheet.create({
  searchSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  searchContainer: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 8,
    paddingHorizontal: 10,
    flex: 1,
  },
  buttonContainer: {
    backgroundColor: "#426ff5",
    padding: 10,
    borderRadius: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});
