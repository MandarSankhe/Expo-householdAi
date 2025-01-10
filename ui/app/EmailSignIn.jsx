import React, { useState } from "react";
import {
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  Modal,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase"; // Import the Firebase auth instance

const EmailSignIn = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [focusedInput, setFocusedInput] = useState(null); // Track focused input
  const [isChecked, setIsChecked] = useState(false); // For the terms and conditions checkbox
  const [showTerms, setShowTerms] = useState(false); // Manage the visibility of the terms popup

  // Check if the button should be enabled
  const isFormValid =
    email &&
    password &&
    confirmPassword &&
    password === confirmPassword &&
    isChecked;

  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    try {
      // Create Firebase user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      Alert.alert(
        "Success",
        `Account created for ${userCredential.user.email}`
      );

      // GraphQL mutation query
      const query = `
        mutation {
          registerUser(username: "${
            username || "Anonymous"
          }", email: "${email}") {
            id
            username
            email
          }
        }
      `;

      // Use fetch instead of axios
      const response = await fetch("http://10.0.0.117:5000/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      const result = await response.json();

      if (response.ok && result.data && result.data.registerUser) {
        const user = result.data.registerUser;
        console.log(user);
      } else {
        throw new Error(result.errors?.[0]?.message || "Error occurred");
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const getInputStyle = (inputName) => [
    styles.input,
    focusedInput === inputName && styles.focusedInput, // Add focus styles
  ];

  const getInputStylesForPassword = (inputName) => [
    styles.row2,
    focusedInput === inputName && styles.focusedPassword, // Add focus styles
  ];

  return (
    <>
      <ScrollView style={styles.scrollView}>
        <View style={styles.row}>
          <Image
            source={{ uri: "assets:/ArrowLeft.png" }}
            style={styles.image}
          />
          <Text style={styles.text}>{"Create Account"}</Text>
        </View>
        <Text style={styles.text2}>{"Full Name "}</Text>
        <TextInput
          placeholder={"Enter your full name"}
          value={username}
          onChangeText={setUsername}
          style={getInputStyle("username")}
          onFocus={() => setFocusedInput("username")}
          onBlur={() => setFocusedInput(null)}
        />
        <Text style={styles.text3}>{"Email* "}</Text>
        <TextInput
          placeholder={"Enter your email "}
          value={email}
          onChangeText={setEmail}
          style={getInputStyle("email")}
          onFocus={() => setFocusedInput("email")}
          onBlur={() => setFocusedInput(null)}
        />
        <Text style={styles.text2}>{"Password*"}</Text>
        <View
          style={getInputStylesForPassword("password")}
          onFocus={() => setFocusedInput("password")}
          onBlur={() => setFocusedInput(null)}
        >
          <TextInput
            placeholder={"Enter your password"}
            value={password}
            onChangeText={setPassword}
            style={styles.input3}
          />
          <Image
            source={{ uri: "https://i.imgur.com/1tMFzp8.png" }}
            resizeMode={"stretch"}
            style={styles.image2}
          />
        </View>
        <Text style={styles.text4}>{"Confirm Password*"}</Text>
        <View
          style={getInputStylesForPassword("confirmPassword")}
          onFocus={() => setFocusedInput("confirmPassword")}
          onBlur={() => setFocusedInput(null)}
        >
          <TextInput
            placeholder={"Enter your password"}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            style={styles.input3}
          />
          <Image
            source={{ uri: "https://i.imgur.com/1tMFzp8.png" }}
            resizeMode={"stretch"}
            style={styles.image2}
          />
        </View>
        {/* Terms and Conditions */}
        <View style={styles.row4}>
          <TouchableOpacity
            style={[
              styles.radioButton,
              isChecked && styles.radioButtonSelected,
            ]}
            onPress={() => setIsChecked(!isChecked)}
          >
            {isChecked && <View style={styles.radioButtonInner} />}
          </TouchableOpacity>
          <Text style={styles.text5}>
            {"I accept the "}
            <Text
              style={styles.linkText}
              onPress={() => setShowTerms(true)} // Show terms popup
            >
              Terms and Privacy Policy
            </Text>
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.button, !isFormValid && styles.buttonDisabled]}
          onPress={handleSignUp}
          disabled={!isFormValid}
        >
          <Text style={styles.text6}>{"Sign Up"}</Text>
        </TouchableOpacity>
      </ScrollView>
      {/* Terms and Conditions Modal */}
      <Modal
        visible={showTerms}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowTerms(false)}
      >
        <View style={styles.fullScreenModal}>
          <View style={styles.modalColumn}>
            <View style={styles.box} />
            <View style={styles.modalRow}>
              <Text style={styles.modalText1}>{"Terms and Conditions"}</Text>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setShowTerms(false)}
              >
                <Text style={styles.text2}>{"X"}</Text>
              </TouchableOpacity>
            </View>
            <ScrollView>
              <Text style={styles.modalText}>
                {
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer euismod, nisi ac faucibus facilisis, dolor lacus mollis libero, ut pulvinar quam purus ac lorem. Integer posuere ut nisi sed dapibus. Phasellus vehicula, purus et malesuada suscipit, turpis eros congue quam, a malesuada sapien erat quis nisi. Vivamus suscipit, lectus eu egestas tempor, tortor sapien convallis augue, id ornare ipsum ligula euismod urna. Suspendisse potenti. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Aenean lacinia eu nulla at fermentum. Morbi tincidunt tincidunt velit, sed fringilla lacus pharetra quis. Praesent ut eros felis. Ut auctor lectus sed nisl tincidunt, vel hendrerit nisi convallis. Suspendisse venenatis eros nec tortor volutpat, a laoreet sem pharetra."
                }
              </Text>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    backgroundColor: "#24A19C",
    borderRadius: 16,
    paddingVertical: 21,
  },
  buttonDisabled: {
    backgroundColor: "#rgba(36, 161, 156, 0.45)", // Disabled button color
  },
  image: {
    width: 17,
    height: 14,
    marginRight: 29,
  },
  image2: {
    width: 24,
    height: 24,
  },
  image3: {
    width: 20,
    height: 20,
    marginRight: 14,
  },
  input: {
    color: "#A9B0C5",
    fontSize: 16,
    marginBottom: 10,
    backgroundColor: "#F6F7F9",
    borderColor: "#E0E5ED",
    borderRadius: 6,
    borderWidth: 1,
    padding: 22,
  },
  focusedInput: {
    backgroundColor: "#F6F7F9",
    borderColor: "#24A19C",
    borderRadius: 6,
    borderWidth: 2,
  },
  input2: {
    color: "#A9B0C5",
    fontSize: 16,
    marginBottom: 31,
    backgroundColor: "#F6F7F9",
    borderColor: "#E0E5ED",
    borderRadius: 6,
    borderWidth: 1,
    padding: 22,
  },
  input3: {
    color: "#A9B0C5",
    fontSize: 16,
    marginRight: 4,
    flex: 1,
    paddingVertical: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 40,
  },
  row2: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F6F7F9",
    borderColor: "#E0E5ED",
    borderRadius: 6,
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  focusedPassword: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F6F7F9",
    borderColor: "#24A19C",
    borderRadius: 6,
    borderWidth: 2,
    paddingHorizontal: 18,
    marginBottom: 39,
  },
  row3: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F6F7F9",
    borderColor: "#E0E5ED",
    borderRadius: 6,
    borderWidth: 1,
    paddingHorizontal: 18,
    marginBottom: 10,
  },
  row4: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  scrollView: {
    backgroundColor: "#FFFFFF",
    paddingTop: 40,
    paddingHorizontal: 37,
  },
  text: {
    color: "#1B1B1E",
    fontSize: 24,
    flex: 1,
  },
  text2: {
    color: "#1B1C1F",
    fontSize: 16,
    marginBottom: 11,
  },
  text3: {
    color: "#1B1C1F",
    fontSize: 16,
    marginBottom: 12,
  },
  text4: {
    color: "#1B1C1F",
    fontSize: 16,
    marginBottom: 13,
  },
  text5: {
    color: "#8E8E8E",
    fontSize: 14,
    flex: 1,
  },
  text6: {
    color: "#FFFFFF",
    fontSize: 18,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#1DB3B3",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  radioButtonSelected: {
    backgroundColor: "#1DB3B3",
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "white",
  },
  // Modal Specific Styles
  fullScreenModal: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: 40,
  },
  modalColumn: {
    flex: 1,
    backgroundColor: "#F1F1F1",
    paddingTop: 6,
    paddingHorizontal: 10,
    paddingBottom: 48,
  },
  modalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 20,
  },
  modalText1: {
    color: "#000000",
    fontSize: 20,
    fontWeight: "bold",
  },
  modalText: {
    color: "#8E8E8E",
    fontSize: 14,
    marginHorizontal: 16,
    lineHeight: 20,
  },
  modalButton: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#7F7F7F33",
    borderRadius: 15, // Circular button
  },
  modalBox: {
    height: 5,
    width: 50,
    backgroundColor: "#CCCCCC",
    borderRadius: 3,
    alignSelf: "center",
    marginBottom: 20,
  },
});

export default EmailSignIn;