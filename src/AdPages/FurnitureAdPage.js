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
  Dimensions,
} from "react-native";
import Background from "../Component/Background";
import SelectImage from "../Component/SelectImage";
import { MaterialIcons } from "@expo/vector-icons";
import { AuthContext } from "../context/authContext";
import { API } from "../api/config";
import Menu from "../Component/Menu";
import { useImageUpload } from "../utils/helpers";
import { useNavigation } from "@react-navigation/native";

const { height, width } = Dimensions.get("window");

const FurnitureAdPage = () => {
  const [postImages, setPostImages] = useState("");
  const [progress, setProgress] = useState(0);
  const [title, setTitle] = useState("Furniture");
  const [name, setName] = useState("");
  const [color, setColor] = useState("");
  const [material, setMaterial] = useState("");
  const [style, setStyle] = useState("");
  const [rent, setRent] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [state] = useContext(AuthContext);
  const token = state.data.token;

  const navigation = useNavigation();
  const { uploadImage } = useImageUpload();

  const handleImageSelect = (uri) => {
    setPostImages(uri);
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
      Alert.alert("No image selected");
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

      if (!name || !color || !material || !style || !rent || !description) {
        Alert.alert("Please Fill All Post Fields!");
        setIsLoading(false);
      } else {
        const paymentData = {
          title,
          name,
          color,
          material,
          style,
          rent,
          description,
          postImages: imageResponse,
        };

        navigation.navigate("Payment", { paymentData });
      }
    } catch (error) {
      Alert.alert("Error uploading image:", error);
      Alert.alert(
        error.response ? error.response.data.message : "Unknown error occurred"
      );
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
            onChangeText={(text) => setColor(text)}
            value={color}
            placeholder="Enter Color.."
            placeholderTextColor="white"
          />
          <TextInput
            style={styles.input}
            onChangeText={(text) => setMaterial(text)}
            value={material}
            placeholder="Enter Material.."
            placeholderTextColor="white"
          />
          <TextInput
            style={styles.input}
            onChangeText={(text) => setStyle(text)}
            value={style}
            placeholder="Enter Style.."
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
            onPress={handleSubmit}
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

export default FurnitureAdPage;
