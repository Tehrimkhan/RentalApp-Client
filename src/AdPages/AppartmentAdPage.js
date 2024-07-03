import React, { useState, useContext, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  ActivityIndicator,
  ScrollView,
  Keyboard,
  Platform,
  Dimensions,
} from "react-native";
import Background from "../Component/Background";
import SelectImage from "../Component/SelectImage";
import { MaterialIcons } from "@expo/vector-icons";
import { AuthContext } from "../context/authContext";
import { API } from "../api/config";
import Menu from "../Component/Menu";
import { useImageUpload } from "../utils/helpers";

const { height, width } = Dimensions.get("window");

const AppartmentAdPage = ({ navigation }) => {
  const [postImages, setpostImages] = useState("");
  const [progress, setProgress] = useState(0);
  const [title, setTitle] = useState("Apartment");
  const [name, setName] = useState("");
  const [area, setArea] = useState("");
  const [floor, setFloor] = useState("");
  const [room, setRoom] = useState("");
  const [rent, setRent] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [state] = useContext(AuthContext);
  const token = state.data.token;

  const { uploadImage } = useImageUpload();

  const handleImageSelect = (uri) => {
    setpostImages(uri);
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        scrollViewRef.current.scrollToEnd({ animated: true });
      }
    );

    return () => {
      keyboardDidShowListener.remove();
    };
  }, []);

  const scrollViewRef = useRef();

  const handleSubmit = async () => {
    if (!postImages) {
      console.log("No image selected");
      return;
    }

    setIsLoading(true);

    let _file = {
      uri: postImages,
      name: "IMG_" + Math.random(4000) + ".png",
      type: "image/png",
    };

    try {
      const imageResponse = await uploadImage(_file, setProgress);
      //console.log("Cloudinary response sent to the backend", imageResponse);

      if (!name || !area || !floor || !room || !rent || !description) {
        Alert.alert("Please Fill All Post Fields!");
      } else {
        const paymentData = {
          title,
          name,
          area,
          floor,
          room,
          rent,
          description,
          postImages: imageResponse,
        };

        navigation.navigate("Payment", { paymentData });
      }
    } catch (error) {
      Alert.alert("Error uploading image:", error.message);
      setIsLoading(false);
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.backgroundContainer}>
        <Background />
      </View>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.innerContainer}>
          <View style={styles.selectionContainer}>
            {!postImages && <SelectImage onSelectImage={handleImageSelect} />}
          </View>
          {postImages ? (
            <Image source={{ uri: postImages }} style={styles.image} />
          ) : null}

          <TextInput
            style={styles.input}
            onChangeText={(text) => setName(text)}
            value={name}
            placeholder="Enter Name.."
            placeholderTextColor="white"
          />
          <TextInput
            style={styles.input}
            onChangeText={(text) => setArea(text)}
            value={area}
            placeholder="Enter Area.."
            placeholderTextColor="white"
          />
          <TextInput
            style={styles.input}
            onChangeText={(text) => setFloor(text)}
            value={floor}
            placeholder="Enter Floor.."
            placeholderTextColor="white"
          />
          <TextInput
            style={styles.input}
            onChangeText={(text) => setRoom(text)}
            value={room}
            placeholder="Enter Room.."
            placeholderTextColor="white"
          />
          <TextInput
            style={styles.input}
            onChangeText={(text) => setRent(text)}
            value={rent}
            placeholder="Enter Rent.."
            placeholderTextColor="white"
          />
          <TextInput
            style={[styles.input, styles.descInput]}
            onChangeText={(text) => setDescription(text)}
            value={description}
            placeholder="Enter Description.."
            placeholderTextColor="white"
            multiline={true}
            numberOfLines={6}
          />

          <TouchableOpacity
            style={styles.saveButton}
            onPress={() => handleSubmit(token)}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <>
                <MaterialIcons name="add-box" size={24} color="white" />
                <Text style={styles.buttonText}>CREATE POST</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
      <View style={styles.menuContainer}>
        <Menu />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backgroundContainer: {
    position: "absolute",
    top: 30,
    left: 0,
    height: height,
    width: width,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    paddingBottom: 100,
  },
  innerContainer: {
    marginTop: 140,
    flex: 1,
    width: "100%",
    alignItems: "center",
  },
  selectionContainer: {
    marginBottom: 5,
    flexDirection: "row",
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
    marginBottom: 20,
    borderRadius: 15,
  },
  input: {
    width: "100%",
    padding: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "#524678",
    color: "white",
  },
  descInput: {
    height: 120,
    textAlignVertical: "top",
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    borderRadius: 5,
    width: "100%",
    backgroundColor: "#9c80e7",
  },
  buttonText: {
    marginLeft: 5,
    fontFamily: "appfont",
    fontSize: 18,
    color: "white",
  },
  menuContainer: {
    position: "absolute",
    bottom: 20,
    left: 0,
    width: "100%",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#ccc",
  },
});

export default AppartmentAdPage;
