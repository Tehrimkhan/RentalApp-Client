import { StyleSheet, Text, View } from "react-native";
import React from "react";

const PaymentPage = () => {
  return (
    <View>
      <Text>PaymentPage</Text>
    </View>
  );
};

export default PaymentPage;

const styles = StyleSheet.create({});
// import React, { useEffect, useState } from "react";
// import { useRoute, useNavigation } from "@react-navigation/native";
// import { View, Text, ActivityIndicator, Alert } from "react-native";
// import { loadStripe } from "@stripe/stripe-js";
// import { API } from "../api/config";

// const stripePromise = loadStripe("your_stripe_public_key");

// const PaymentPage = () => {
//   const route = useRoute();
//   const navigation = useNavigation();
//   const paymentData = route.params?.paymentData;
//   console.log("ppp", paymentData);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const handlePayment = async () => {
//       try {
//         const token = API.defaults.headers.common["Authorization"];

//         if (!token || token.trim() === "") {
//           Alert.alert("Authorization token missing. Please log in.");
//           return;
//         }
//         const stripe = await stripePromise;
//         const response = await API.post(
//           "/post/create-checkout-session",
//           paymentData,
//           {
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: token,
//             },
//           }
//         );

//         const session = response.data;

//         const result = await stripe.redirectToCheckout({
//           sessionId: session.id,
//         });

//         if (result.error) {
//           console.error(result.error);
//           Alert.alert("Error processing payment");
//           setIsLoading(false);
//         } else {
//           try {
//             const createPostResponse = await API.post(
//               "/post/create-post",
//               {
//                 postImages: paymentData.postImages,
//                 title: "Furniture",
//                 name: paymentData.name,
//                 color: paymentData.color,
//                 material: paymentData.material,
//                 style: paymentData.style,
//                 rent: paymentData.rent,
//                 description: paymentData.description,
//               },
//               {
//                 headers: {
//                   Authorization: token,
//                 },
//               }
//             );
//             Alert.alert(createPostResponse?.data.message);
//             Alert.alert("Post Will Be Published After Admin Approval");
//             navigation.navigate("Dashboard");
//           } catch (postError) {
//             console.error(postError);
//             Alert.alert("Error creating post");
//           } finally {
//             setIsLoading(false);
//           }
//         }
//       } catch (error) {
//         console.error("Error during payment processing:", error);
//         setIsLoading(false);
//         Alert.alert("Error processing payment");
//       }
//     };

//     handlePayment();
//   }, []);

//   return (
//     <View>
//       <Text>Processing Payment...</Text>
//       {isLoading && <ActivityIndicator size="large" color="#0000ff" />}
//     </View>
//   );
// };

// export default PaymentPage;
