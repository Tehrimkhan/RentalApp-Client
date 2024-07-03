import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Modal,
  FlatList,
  ActivityIndicator,
  Image,
  Alert,
} from "react-native";
import { API } from "../api/config";
const Payment = ({ route, navigation }) => {
  const { paymentData } = route.params;
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [cvc, setCvc] = useState("");
  const [expiration, setExpiration] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [amountToPay, setAmountToPay] = useState(0);
  console.log(paymentData);
  const generateTransactionId = () => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const length = 64;
    let transactionId = "";

    for (let i = 0; i < length; i++) {
      transactionId += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }

    return `cs_test_${transactionId}`;
  };
  useEffect(() => {
    if (paymentData) {
      const amount = parseFloat(paymentData.rent) * 0.1;
      setAmountToPay(amount);
    }
  }, [paymentData]);

  const countries = [
    { label: "USA", value: "USA" },
    { label: "Canada", value: "Canada" },
    { label: "UK", value: "UK" },
    { label: "Germany", value: "Germany" },
    { label: "Pakistan", value: "Pakistan" },
    { label: "France", value: "France" },
    { label: "Italy", value: "Italy" },
    { label: "Spain", value: "Spain" },
    { label: "Australia", value: "Australia" },
    { label: "Brazil", value: "Brazil" },
    { label: "China", value: "China" },
  ];

  const formatCardNumber = (input) => {
    const cardNumberDigits = input.replace(/\D/g, "");

    let formattedNumber = "";
    for (let i = 0; i < cardNumberDigits.length; i++) {
      if (i > 0 && i % 4 === 0) {
        formattedNumber += " ";
      }
      formattedNumber += cardNumberDigits[i];
    }

    return formattedNumber;
  };

  const handleCardNumberChange = (input) => {
    const formattedNumber = input.replace(/\D/g, "").substring(0, 16);
    setCardNumber(formatCardNumber(formattedNumber));
  };

  const handleCvcChange = (input) => {
    const formattedCvc = input.replace(/\D/g, "").substring(0, 3);
    setCvc(formattedCvc);
  };

  const handleExpirationChange = (input) => {
    const formattedExpiration = input.replace(/\D/g, "").substring(0, 4);

    const today = new Date();
    const currentYear = today.getFullYear().toString().substring(2, 4);
    const currentMonth = (today.getMonth() + 1).toString().padStart(2, "0");

    if (
      formattedExpiration.length === 4 &&
      (formattedExpiration.substring(2, 4) < currentYear ||
        (formattedExpiration.substring(2, 4) === currentYear &&
          formattedExpiration.substring(0, 2) < currentMonth))
    ) {
      setExpiration("");
      setError("Expiration date cannot be in the past");
    } else {
      setExpiration(formattedExpiration);
      setError("");
    }
  };

  const selectCountry = (country) => {
    setSelectedCountry(country);
    setModalVisible(false);
  };

  const handlePayment = async () => {
    if (!cardNumber || !cvc || !expiration || !selectedCountry) {
      setError("Please fill in all fields");
      return;
    }
    const transactionId = generateTransactionId();
    const token = API.defaults.headers.common["Authorization"];
    setIsLoading(true);

    try {
      const paymentInfo = {
        paymentId: transactionId,
        totalamount: paymentData.rent,
        percentage: amountToPay,
        currency: "PKR",
        productName: paymentData.name,
      };

      const response = await API.post("/post/paymentInfo", paymentInfo, {
        headers: {
          Authorization: token,
        },
      });

      Alert.alert(response.data.message);

      await new Promise((resolve) => setTimeout(resolve, 2000));

      let createPostResponse;

      if (paymentData.title === "Car") {
        createPostResponse = await API.post(
          "/post/create-post",
          {
            postImages: paymentData.postImages,
            title: "Car",
            name: paymentData.name,
            make: paymentData.make,
            model: paymentData.model,
            variant: paymentData.variant,
            ac: paymentData.ac,
            rent: paymentData.rent,
            description: paymentData.description,
          },
          {
            headers: {
              Authorization: token,
            },
          }
        );
      } else if (paymentData.title === "Furniture") {
        createPostResponse = await API.post(
          "/post/create-post",
          {
            postImages: paymentData.postImages,
            title: "Furniture",
            name: paymentData.name,
            color: paymentData.color,
            material: paymentData.material,
            style: paymentData.style,
            rent: paymentData.rent,
            description: paymentData.description,
          },
          {
            headers: {
              Authorization: token,
            },
          }
        );
      } else if (paymentData.title === "Apparel") {
        createPostResponse = await API.post(
          "/post/create-post",
          {
            postImages: paymentData.postImages,
            title: "Apparel",
            name: paymentData.name,
            color: paymentData.color,
            fabric: paymentData.fabric,
            size: paymentData.size,
            gender: paymentData.gender,
            rent: paymentData.rent,
            description: paymentData.description,
          },
          {
            headers: {
              Authorization: token,
            },
          }
        );
      } else if (paymentData.title === "Appartment") {
        createPostResponse = await API.post(
          "/post/create-post",
          {
            postImages: paymentData.postImages,
            title: "Appartment",
            name: paymentData.name,
            area: paymentData.area,
            floor: paymentData.floor,
            room: paymentData.room,
            rent: paymentData.rent,
            description: paymentData.description,
          },
          {
            headers: {
              Authorization: token,
            },
          }
        );
      }

      Alert.alert(createPostResponse?.data.message);
      Alert.alert("Post Will Be Published After Admin Approval");
      navigation.navigate("Dashboard");
    } catch (error) {
      console.error("Error during payment:", error);
      setError("Payment failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const isPayDisabled = !cardNumber || !cvc || !expiration || !selectedCountry;

  return (
    <View style={styles.background}>
      <View style={styles.container}>
        <Image
          source={{ uri: paymentData.postImages.secure_url }}
          style={styles.image}
        />

        <Text style={styles.label}>{paymentData.name}</Text>
        <Text style={styles.amount}>Rs {amountToPay.toFixed(2)}</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Card Information"
          value={cardNumber}
          onChangeText={handleCardNumberChange}
          keyboardType="number-pad"
          maxLength={19}
        />
        <View style={styles.cardDetails}>
          <TextInput
            style={styles.inputShort}
            placeholder="MM / YY"
            value={expiration}
            onChangeText={handleExpirationChange}
            keyboardType="number-pad"
            maxLength={5}
          />
          <TextInput
            style={styles.inputShort}
            placeholder="CVC"
            value={cvc}
            onChangeText={handleCvcChange}
            keyboardType="number-pad"
            maxLength={3}
          />
        </View>
        <TextInput style={styles.input} placeholder="Name on card" />

        {/* Custom dropdown */}
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.dropdownText}>
            {selectedCountry ? selectedCountry.label : "Select Country"}
          </Text>
        </TouchableOpacity>

        {/* Modal for country selection */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <FlatList
                data={countries}
                keyExtractor={(item) => item.value}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={() => selectCountry(item)}
                  >
                    <Text style={styles.modalItemText}>{item.label}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </Modal>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        {/* Pay Button */}
        <TouchableOpacity
          style={[styles.button, { opacity: isPayDisabled ? 0.5 : 1 }]}
          onPress={handlePayment}
          disabled={isPayDisabled}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>
              Pay Rs {amountToPay.toFixed(2)}
            </Text>
          )}
        </TouchableOpacity>

        <Text style={styles.belowText}>Powered by Stripe</Text>
        <Text style={styles.belowText2}>Terms | Privacy</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  container: {
    alignItems: "center",
    paddingHorizontal: 20,
    height: 700,
    width: 370,
    top: 100,
    right: 20,
    left: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: "contain",
    marginBottom: 10,
  },
  label: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  amount: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
    width: "100%",
  },
  cardDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  inputShort: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
    width: "48%",
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
    width: "100%",
  },
  dropdownText: {
    fontSize: 15,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    width: "100%",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    maxHeight: "60%",
    width: "80%",
  },
  modalItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    alignItems: "flex-start",
  },
  modalItemText: {
    fontSize: 16,
  },
  error: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
  belowText: {
    marginTop: 30,
    color: "#ccc",
  },
  belowText2: {
    marginTop: 10,
    color: "#ccc",
  },
});

export default Payment;
