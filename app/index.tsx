// task 1 start

// import AsyncStorage from "@react-native-async-storage/async-storage";
// import NetInfo from "@react-native-community/netinfo";
// import axios from "axios";
// import * as DocumentPicker from "expo-document-picker";
// import React, { useEffect, useState } from "react";
// import {
//   ActivityIndicator,
//   Alert,
//   FlatList,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";

// type FileItem = {
//   id: string;
//   name: string;
//   uri: string;
//   type: string;
//   source: "online" | "offline";
//   size?: number;
// };

// const STORAGE_KEY = "OFFLINE_FILES";
// const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
// const Index = () => {
//   const [isOnline, setIsOnline] = useState(false);
//   const [onlineFile, setOnlineFile] = useState<FileItem | null>(null);
//   const [syncing, setSyncing] = useState(false);
//   const [uploading, setUploading] = useState(false);
//   const [files, setFiles] = useState<FileItem[]>([]);

//   useEffect(() => {
//     loadOfflineFiles();
//   }, []);
//   useEffect(() => {
//     const unsubscribe = NetInfo.addEventListener((state) => {
//       setIsOnline(!!state.isConnected);
//     });
//     return () => unsubscribe();
//   }, []);

//   const loadOfflineFiles = async () => {
//     try {
//       const data = await AsyncStorage.getItem(STORAGE_KEY);
//       if (data) {
//         const parsed = JSON.parse(data);
//         setFiles(Array.isArray(parsed) ? parsed : []);
//       }
//     } catch (error) {
//       console.error("Failed to load offline files:", error);
//       Alert.alert("Error", "Failed to load saved files");
//     }
//   };

//   const saveOfflineFiles = async (data: FileItem[]) => {
//     try {
//       setFiles(data);
//       await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
//     } catch (error) {
//       console.error("Failed to save offline files:", error);
//       Alert.alert("Error", "Failed to save file locally");
//     }
//   };

//   const pickFile = async () => {
//     try {
//       const result = await DocumentPicker.getDocumentAsync({
//         type: "*/*",
//         copyToCacheDirectory: true,
//       });
//       if (result.canceled) return;
//       const f = result.assets[0];
//       if (f.size && f.size > MAX_FILE_SIZE) {
//         Alert.alert("Error", "File size exceeds 10MB limit");
//         return;
//       }
//       const fileObj: FileItem = {
//         id: Date.now().toString(),
//         name: f.name ?? "file",
//         type: f.mimeType ?? "mimeType",
//         uri: f.uri,
//         source: isOnline ? "online" : "offline",
//         size: f.size,
//       };
//       const isDuplicate = files.some(
//         (file) => file.name === fileObj.name && file.size === fileObj.size
//       );

//       if (isDuplicate) {
//         Alert.alert("Warning", "This file already exists");
//         return;
//       }

//       if (isDuplicate) {
//         Alert.alert("Warning", "This file already exists");
//         return;
//       }

//       if (isOnline) {
//         setOnlineFile(fileObj);
//       } else {
//         const updated = [fileObj, ...files];
//         await saveOfflineFiles(updated);
//         Alert.alert("Offline", "File saved locally");
//       }
//     } catch (error) {
//       console.error("File picker error:", error);
//       Alert.alert("Error", "Failed to pick file");
//     }
//   };

//   const uploadFile = async (file: FileItem) => {
//     setUploading(true);
//     try {
//       const formData = new FormData();

//       formData.append("file", {
//         uri: file.uri,
//         name: file.name,
//         type: file.type,
//       } as any);

//       const response = await axios.post(
//         "https://next-files-upload-backend.vercel.app/api/files-upload",
//         formData,
//         {
//           headers: {
//             apikey: "dummy-key",
//             "Content-Type": "multipart/form-data",
//           },
//           timeout: 30000,
//         }
//       );

//       if (response.status === 200) {
//         Alert.alert("Success", `${file.name} uploaded`);
//         setOnlineFile(null);
//         return true;
//       } else {
//         throw new Error("Upload failed");
//       }
//     } catch (error) {
//       if (axios.isAxiosError(error)) {
//         if (error.code === "ECONNABORTED") {
//           Alert.alert("Error", "Upload timeout - file may be too large");
//           return;
//         }

//         if (!error.response) {
//           Alert.alert("Error", "Network error - check your connection");
//           return;
//         }

//         const data = error.response.data;

//         let message = "Upload failed";

//         if (typeof data === "string") {
//           message = data;
//         } else if (typeof data === "object") {
//           message = data.message || data.error || JSON.stringify(data);
//         }

//         Alert.alert(`Error ${error.response.status}`, message);
//       } else {
//         Alert.alert("Error", "Upload failed");
//       }
//       return false;
//     } finally {
//       setUploading(false);
//     }
//   };

//   const syncOfflineFiles = async () => {
//     if (files.length === 0) return;
//     setSyncing(true);
//     const falied: FileItem[] = [];
//     try {
//       for (let i = 0; i < files.length; i++) {
//         const success: any = await uploadFile(files[i]);
//         if (!success) falied.push(files[i]);
//       }
//       await saveOfflineFiles(falied);
//     } catch (error: any) {
//       console.log("error on syncofflineFiles", error.message);
//     } finally {
//       setSyncing(false);
//     }
//   };
//   const deleteOfflineFile = async (id: string) => {
//     const updated = files.filter((d) => d.id !== id);
//     await saveOfflineFiles(updated);
//   };
//   return (
//     <View style={{ flex: 1, padding: 20 }}>
//       <Text style={{ fontWeight: "bold", fontSize: 18 }}>
//         Network : {isOnline ? "🟢 Online" : "🔴 Offline"}
//       </Text>

//       <TouchableOpacity
//         onPress={pickFile}
//         disabled={uploading}
//         style={{
//           backgroundColor: uploading ? "#ccc" : "#2563eb",
//           padding: 14,
//           borderRadius: 5,
//           alignItems: "center",
//           marginVertical: 20,
//         }}
//       >
//         <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
//           {uploading ? "Processing..." : "Pick Files"}
//         </Text>
//       </TouchableOpacity>

//       {isOnline && onlineFile && (
//         <View style={{ marginBottom: 20 }}>
//           <Text style={{ marginBottom: 8 }}>Selected: {onlineFile.name}</Text>

//           <TouchableOpacity
//             onPress={() => uploadFile(onlineFile)}
//             disabled={uploading}
//             style={{
//               backgroundColor: uploading ? "#ccc" : "#2563eb",
//               padding: 14,
//               borderRadius: 6,
//               flexDirection: "row",
//               justifyContent: "center",
//               alignItems: "center",
//             }}
//           >
//             {uploading && (
//               <ActivityIndicator color="white" style={{ marginRight: 10 }} />
//             )}
//             <Text style={{ color: "white", textAlign: "center" }}>
//               {uploading ? "Uploading..." : "Upload File"}
//             </Text>
//           </TouchableOpacity>
//         </View>
//       )}

//       <Text>Offline Saved Files({files.length})</Text>

//       <FlatList
//         data={files}
//         keyExtractor={(item) => item.id}
//         ListEmptyComponent={
//           <Text style={{ color: "gray", fontStyle: "italic" }}>
//             No offline files saved
//           </Text>
//         }
//         renderItem={({ item }) => (
//           <View
//             style={{
//               padding: 10,
//               borderWidth: 1,
//               borderColor: "#ddd",
//               borderRadius: 6,
//               marginBottom: 8,
//               flexDirection: "row",
//               justifyContent: "space-between",
//               alignItems: "center",
//             }}
//           >
//             <View style={{ flex: 1 }}>
//               <Text style={{ fontWeight: "500" }}>{item.name}</Text>
//               <Text style={{ fontSize: 12, color: "gray" }}>
//                 Status: Saved locally
//               </Text>
//               {item.size && (
//                 <Text style={{ fontSize: 12, color: "gray" }}>
//                   Size: {(item.size / 1024).toFixed(2)} KB
//                 </Text>
//               )}
//             </View>

//             <TouchableOpacity onPress={() => deleteOfflineFile(item.id)}>
//               <Text style={{ color: "red" }}>Delete</Text>
//             </TouchableOpacity>
//           </View>
//         )}
//       />

//       {isOnline && files.length > 0 && (
//         <TouchableOpacity
//           onPress={syncOfflineFiles}
//           disabled={syncing}
//           style={{
//             backgroundColor: syncing ? "#ccc" : "green",
//             padding: 14,
//             borderRadius: 6,
//             marginTop: 20,
//             flexDirection: "row",
//             justifyContent: "center",
//             alignItems: "center",
//           }}
//         >
//           {syncing && (
//             <ActivityIndicator color="white" style={{ marginRight: 10 }} />
//           )}
//           <Text style={{ color: "white", textAlign: "center" }}>
//             {syncing
//               ? "Syncing..."
//               : `Sync ${files.length} Offline File${
//                   files.length > 1 ? "s" : ""
//                 }`}
//           </Text>
//         </TouchableOpacity>
//       )}
//     </View>
//   );
// };

// export default Index;

// task 1 end

// task 2 start
import FruitsInfo from "@/components/FruitsInfo";
import FruitsList from "@/components/FruitsList";
import axios from "axios";
import React, { useState } from "react";
import { Alert, StatusBar, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Index = () => {
  const [list, setList] = useState<any[]>([]);
  const [Selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSearch = async (text: string) => {
    if (!text) {
      Alert.alert("Error", "Please enter fruit name to search");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.get(
        `https://www.fruityvice.com/api/fruit/${text}`
      );
      console.log(res.data, "res");
      setList([res.data]);
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        console.log("Not Found", "No fruit found with that name");
      } else {
        Alert.alert("Error", "Failed to fetch fruits");
      }

      setList([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={"dark-content"} />
      <FruitsList
        data={list}
        onSearch={onSearch}
        onSelect={setSelected}
        loading={loading}
      />
      <FruitsInfo fruit={Selected} />
    </SafeAreaView>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor:'white'
  },
});
// task 2 end