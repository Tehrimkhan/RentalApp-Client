import React, { useState, useEffect, useRef } from "react";
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
import { useImageUpload } from "../utils/helpers";
import Menu from "../Component/Menu";
import { useNavigation } from "@react-navigation/native";
import { API } from "../api/config";

const { height, width } = Dimensions.get("window");

const CarAdPage = () => {
  const [postImages, setPostImages] = useState(null);
  const [progress, setProgress] = useState(0);
  const [title, setTitle] = useState("Car");
  const [make, setMake] = useState("");
  const [name, setName] = useState("");
  const [model, setModel] = useState("");
  const [variant, setVariant] = useState("");
  const [rent, setRent] = useState("");
  const [description, setDescription] = useState("");
  const [ac, setAc] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const { uploadImage } = useImageUpload();

  const handleImageSelect = (uri) => {
    if (!uri) {
      Alert.alert("Please select an image");
      return;
    }
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

      if (!make || !name || !model || !variant || !rent || !description) {
        Alert.alert("Please Fill All Post Fields!");
        setIsLoading(false);
      } else {
        const paymentData = {
          title,
          make,
          name,
          model,
          variant,
          rent,
          description,
          ac,
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
            onChangeText={(text) => setMake(text)}
            value={make}
            placeholder="Enter Make.."
            placeholderTextColor="white"
          />
          <TextInput
            style={styles.input}
            onChangeText={(text) => setModel(text)}
            value={model}
            placeholder="Enter Model.."
            placeholderTextColor="white"
          />
          <TextInput
            style={styles.input}
            onChangeText={(text) => setVariant(text)}
            value={variant}
            placeholder="Enter Variant.."
            placeholderTextColor="white"
          />
          <TextInput
            style={styles.input}
            onChangeText={(text) => setAc(text)}
            value={ac}
            placeholder="Enter About AC.."
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

export default CarAdPage;
