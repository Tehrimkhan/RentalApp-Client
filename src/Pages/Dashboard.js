import React, { useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import Menu from "../Component/Menu";
import Banner from "../Component/Banner/DashboardBanner";
import { PostContext } from "../context/postContext";

const headlogo = require("../../assets/SHAPE.png");
const header = require("../../assets/header.png");
const carlogo = require("../../assets/carlogo.png");
const applogo = require("../../assets/applogo.png");
const apartlogo = require("../../assets/apartlogo.png");
const furnlogo = require("../../assets/furnlogo.png");

const Dashboard = ({ navigation }) => {
  const [posts] = useContext(PostContext);
  const filteredCarPosts = posts.filter((post) => post.title === "Car");

  const filteredAppartmentPosts = posts.filter(
    (post) => post.title === "Apartment"
  );
  const filteredApparelPosts = posts.filter((post) => post.title === "Apparel");

  const filteredFurniturePosts = posts.filter(
    (post) => post.title === "Furniture"
  );

  const submitCar = () => {
    navigation.navigate("CarPage", { carPosts: filteredCarPosts });
  };
  const submitApparels = () => {
    navigation.navigate("ApparelsPage", {
      apparelPosts: filteredApparelPosts,
    });
  };
  const submitAppartment = () => {
    navigation.navigate("AppartmentPage", {
      apartmentPosts: filteredAppartmentPosts,
    });
  };
  const submitFurniture = () => {
    navigation.navigate("FurniturePage", {
      furniturePosts: filteredFurniturePosts,
    });
  };
  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Image source={headlogo} style={styles.headLogo} resizeMode="contain" />
        <View style={styles.headerContainer}>
          <Image
            source={header}
            style={styles.headerImage}
            resizeMode="contain"
          />
        </View>
      </View>
      <View style={styles.sliderContainer}>
        <Banner />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.carbuttonStyle}
          onPress={() => submitCar()}
        >
          <View style={styles.buttonContent}>
            <View style={styles.circle}></View>
            <Image
              source={carlogo}
              style={styles.btnImageStyle}
              resizeMode="contain"
            />
            <Text style={styles.buttonText}>SUBSCRIBE YOUR CAR</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.appbuttonStyle}
          onPress={() => submitApparels()}
        >
          <View style={styles.buttonContent}>
            <View style={styles.circle}></View>
            <Image
              source={applogo}
              style={styles.btnImageStyle}
              resizeMode="contain"
            />
            <Text style={styles.buttonText}>SUBSCRIBE YOUR APPARELS</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.apartbuttonStyle}
          onPress={() => submitAppartment()}
        >
          <View style={styles.buttonContent}>
            <View style={styles.circle}></View>
            <Image
              source={apartlogo}
              style={styles.btnImageStyle}
              resizeMode="contain"
            />
            <Text style={styles.buttonText}>SUBSCRIBE YOUR APPARTMENT</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.furnbuttonStyle}
          onPress={() => submitFurniture()}
        >
          <View style={styles.buttonContent}>
            <View style={styles.circle}></View>
            <Image
              source={furnlogo}
              style={styles.btnImageStyle}
              resizeMode="contain"
            />
            <Text style={styles.buttonText}>SUBSCRIBE YOUR FURNITURE</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.bottomMenu}>
        <Menu />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#17171f",
  },
  topContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    top: -2,
    left: -3,
  },
  headLogo: {
    width: 200,
    height: 200,
    margin: 20,
    //Added
    left: -30,
    bottom: 40,
  },
  headerContainer: {
    //flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerImage: {
    width: 300, // Adjust the width of your header image
    height: 70, // Adjust the height of your header image
    //left: -110, // Center the header image
    left: -180,
    bottom: 20,
  },
  sliderContainer: {
    marginTop: 80,
    //Added
    marginBottom: 10,
  },
  buttonContainer: {
    marginTop: 20,
  },
  carbuttonStyle: {
    backgroundColor: "#342d4e",
    borderRadius: 26,
    paddingVertical: 29,
    width: 380,
    height: 75,
    marginBottom: 10,
  },
  appbuttonStyle: {
    backgroundColor: "#342d4e",
    borderRadius: 26,
    paddingVertical: 29,
    width: 380,
    height: 75,
    marginBottom: 10,
  },
  apartbuttonStyle: {
    backgroundColor: "#342d4e",
    borderRadius: 26,
    paddingVertical: 29,
    width: 380,
    height: 75,
    marginBottom: 10,
  },
  furnbuttonStyle: {
    backgroundColor: "#342d4e",
    borderRadius: 26,
    paddingVertical: 29,
    width: 380,
    height: 75,
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 15,
    fontFamily: "appfont",
    // fontWeight: "bold",
    color: "white",
    marginLeft: 30,
    marginBottom: 27,
    // lineHeight: 22, // Adjust the line height as per your preference
  },
  btnImageStyle: {
    width: 60,
    height: 50,
    left: 10,
    bottom: 15,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  circle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#1c1c28",
    position: "absolute",
    top: -26,
    left: 10,
  },
  bottomMenu: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    borderTopWidth: 2,
    borderTopColor: "#DDDDDD",
  },
});

export default Dashboard;
