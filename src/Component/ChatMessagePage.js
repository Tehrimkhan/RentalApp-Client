import React, {
  useState,
  useEffect,
  useRef,
  useContext,
  createContext,
} from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { Entypo, FontAwesome, AntDesign } from "@expo/vector-icons";
import moment from "moment";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../context/authContext";
import { API } from "../api/config";
import io from "socket.io-client";

const SocketContext = createContext();
export const useSocketContext = () => {
  return useContext(SocketContext);
};

const ChatMessagePage = ({ route }) => {
  const [userIdArray] = useContext(AuthContext);
  const userId = userIdArray?.data?.user?._id;
  const socket = io("http://127.0.0.1:8080", {
    transports: ["websocket"],
    query: {
      userId: userId,
    },
  });

  const [messages, setMessages] = useState([]);
  const navigation = useNavigation();
  const token = API.defaults.headers.common["Authorization"];
  const { recieverName, profileImage, receiverId } = route.params;
  const [newMessage, setNewMessage] = useState("");
  const scrollViewRef = useRef();
  const [senderId, setSenderId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const renderMessages = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <Image
            source={require("../../assets/Spinner-1s-200px.gif")}
            style={{ width: 50, height: 50 }}
          />
        </View>
      );
    }

    if (!messages || messages.length === 0) {
      return (
        <View style={styles.noMessagesContainer}>
          <Text style={styles.noMessagesText}>
            Send a message to start the conversation
          </Text>
        </View>
      );
    }
    return messages.map((msg, index) => {
      if (!msg || typeof msg !== "object") {
        return null;
      }

      const isCurrentUser = msg.senderId === userId;

      return (
        <View
          key={index}
          style={[
            styles.messageContainer,
            isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage,
          ]}
        >
          <View
            style={[
              styles.messageBubble,
              isCurrentUser ? styles.currentUserBubble : styles.otherUserBubble,
            ]}
          >
            <Text style={styles.messageText}>{msg.message}</Text>
            <Text style={styles.messageTime}>
              {moment(msg.createdAt).format("LT")}
            </Text>
          </View>
        </View>
      );
    });
  };

  const [sendingMessage, setSendingMessage] = useState(false);

  const scrollToBottom = () => {
    scrollViewRef.current.scrollToEnd({ animated: true });
  };

  const handleSend = async () => {
    try {
      setSendingMessage(true);
      if (!token || token.trim() === "") {
        alert("Authorization token missing. Please log in.");
        return;
      }
      const response = await API.post(
        `/messages/send/${receiverId}`,
        {
          message: newMessage,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      const sentMessage = response.data;
      const senderId = sentMessage.senderId;
      setSenderId(senderId);
      setMessages((prevMessages) => [...prevMessages, sentMessage]);

      socket.emit("message", {
        message: newMessage,
        senderId: userId,
        receiverId: receiverId,
        createdAt: new Date(),
      });
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error.message);
    } finally {
      setSendingMessage(false);
    }
  };

  socket.on("message", (message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
    scrollToBottom();
  });

  useEffect(() => {
    socket.on("connection", () => {
      console.log("client is connected to the server: ", socket.id);
    });

    return () => {
      socket.off("message");
    };
  }, []);

  useEffect(() => {
    const getMessages = async () => {
      try {
        if (!token || token.trim() === "") {
          alert("Authorization token missing. Please log in.");
          return;
        }
        const response = await API.get(`/messages/${receiverId}`, {
          headers: {
            Authorization: token,
          },
        });

        const data = response.data;
        setMessages(data);
      } catch (error) {
        console.error(error);
        alert("Error Getting Messages");
      } finally {
        setIsLoading(false);
      }
    };

    getMessages();
  }, [receiverId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const navigateToChatPage = () => {
    navigation.navigate("ChatPage");
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={navigateToChatPage}>
            <AntDesign
              name="doubleleft"
              size={24}
              color="#fff"
              marginLeft={5}
            />
          </TouchableOpacity>
          {profileImage && profileImage.length > 0 ? (
            <Image
              source={{ uri: profileImage[0]?.secure_url }}
              style={styles.profileImage}
            />
          ) : (
            <Image
              source={require("../../assets/user.png")}
              style={styles.profileImage}
            />
          )}
          <Text style={styles.userName}>{recieverName}</Text>
        </View>
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.messagesContainer}
        >
          {renderMessages()}
        </ScrollView>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Type your message..."
            placeholderTextColor="#aaa"
            multiline
            maxLength={100}
            onContentSizeChange={(e) => {
              const { height } = e.nativeEvent.contentSize;
              if (height > 120) {
                scrollViewRef.current.scrollToEnd({ animated: true });
              }
            }}
          />
          <View style={styles.sendButtonContainer}>
            <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
              <FontAwesome name="send-o" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "#17171f",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 30,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  userName: {
    fontWeight: "bold",
    fontSize: 16,
    marginRight: "auto",
    color: "#fff",
  },
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
    marginLeft: 10,
  },
  messagesContainer: {
    flexGrow: 1,
  },
  messageContainer: {
    marginBottom: 5,
    alignSelf: 'flex-start', 
    maxWidth: "80%", 
    minWidth: "30%"
  },
  messageBubble: {
    padding: 8,
    borderRadius: 20,
    elevation: 1,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  messageText: {
    fontSize: 17,
    color: "#FFFFFF",
  },
  messageTime: {
    fontSize: 12,
    color: "#ccc",
    marginTop: 10,
    textAlign: "right",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#342d4e",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    padding: 10,
    height: 60,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginRight: 10,
    color: "#fff",
  },
  sendButton: {
    padding: 10,
    right: 1,
  },
  sendButtonContainer: {
    padding: 1,
    backgroundColor: "#9c80e7",
    borderRadius: 25,
  },
  noMessagesContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  noMessagesText: {
    fontSize: 16,
    color: "#aaa",
  },
  currentUserMessage: {
    alignSelf: "flex-end",
    marginRight: 10,
    marginLeft: 35,
  },
  otherUserMessage: {
    alignSelf: "flex-start",
    marginLeft: 10,
    marginRight: 35,
  },
  currentUserBubble: {
    backgroundColor: "#9E72C3",
  },
  otherUserBubble: {
    backgroundColor: "#4A2574",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ChatMessagePage;
