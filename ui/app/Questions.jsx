import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  FlatList,
  TextInput,
  Alert,
} from "react-native";
import { useLocalSearchParams  } from 'expo-router';

const Questions = () => {
  const { email } = useLocalSearchParams(); // Extract userId from navigation params
  const [step, setStep] = useState(1); // Current step
  const [householdSize, setHouseholdSize] = useState(null); // Single selection
  const [specialDiet, setSpecialDiet] = useState([]); // Multiple selection
  const [mostCookedCuisine, setMostCookedCuisine] = useState([]); // Multiple selection
  const [customCuisine, setCustomCuisine] = useState(""); // Custom cuisine input

  const handleOptionSelect = (setState, currentValue, isMultiple) => {
    if (isMultiple) {
      setState((prev) =>
        prev.includes(currentValue)
          ? prev.filter((item) => item !== currentValue) // Deselect if already selected
          : [...prev, currentValue] // Add if not selected
      );
    } else {
      setState((prev) => (prev === currentValue ? null : currentValue));
    }
  };

  const handleSubmit = async () => {
    try {
      const query = `
        mutation {
          addQuestion(
            email: "${email}",
            householdSize: "${householdSize}",
            specialDiet: ${JSON.stringify(specialDiet)},
            mostCookedCuisine: ${JSON.stringify([
              ...mostCookedCuisine,
              ...(customCuisine ? [customCuisine] : []),
            ])}
          ) {
            id
          }
        }
      `;

      const response = await fetch("http://172.20.10.8:5000/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      const result = await response.json();
      if (response.ok && result.data?.addQuestion) {
        Alert.alert("Success", "Your answers have been submitted!");
      } else {
        throw new Error(result.errors?.[0]?.message || "Submission failed.");
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  if (step === 1) {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Welcome!</Text>
          <Text style={styles.subtitle}>
            Let's personalize grocery shopping for you!
          </Text>
          <Image
            source={require("../public/images/Welcome.png")} // Replace with the correct image path
            style={styles.image}
          />
          <Text style={styles.description}>
            Answer a few questions to help us plan your grocery shopping basket.
          </Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={() => setStep(2)}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (step === 2) {
    return (
      <View style={styles.container}>
        <Text style={styles.questionTitle}>How many people in your household?</Text>
        <FlatList
          data={["1", "2", "3-4", "5+"]}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.option,
                householdSize === item && styles.selectedOption,
              ]}
              onPress={() => handleOptionSelect(setHouseholdSize, item, false)}
            >
              <Text style={styles.optionText}>{item}</Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.optionsList}
        />
        <View style={styles.navButtons}>
          <TouchableOpacity style={styles.nextButton} onPress={() => setStep(3)}>
            <Text style={styles.nextButtonText}>→</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (step === 3) {
    return (
      <View style={styles.container}>
        <Text style={styles.questionTitle}>What specific diet do you follow?</Text>
        <Text style={styles.subTitleSmall}>Select all that apply</Text>
        <FlatList
          data={[
            "🥗 Vegetarian",
            "🍖 Meat-based",
            "🥑 Vegan",
            "🥗🍖 Mixed",
            "🧑‍🍳 No specific diet",
          ]}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.option,
                specialDiet.includes(item) && styles.selectedOption,
              ]}
              onPress={() => handleOptionSelect(setSpecialDiet, item, true)}
            >
              <Text style={styles.optionText}>{item}</Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.optionsList}
        />
        <TouchableOpacity style={styles.nextButton} onPress={() => setStep(4)}>
          <Text style={styles.nextButtonText}>→</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (step === 4) {
    return (
      <View style={styles.container}>
        <Text style={styles.questionTitle}>
          What is the most cooked cuisine at home?
        </Text>
        <Text style={styles.subTitleSmall}>Select all that apply</Text>
        <FlatList
          key={"two-columns"} // Use a static key since numColumns isn't dynamic
          numColumns={2} // Explicitly set numColumns
          data={[
            { name: "Indian", image: require("../public/images/indian.png") },
            { name: "Asian", image: require("../public/images/asian.png") },
            { name: "American", image: require("../public/images/american.png") },
            { name: "Italian", image: require("../public/images/italian.png") },
            {
              name: "Mediterranean",
              image: require("../public/images/mediterranean.png"),
            },
            { name: "Mexican", image: require("../public/images/mexican.png") },
          ]}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.cuisineOption,
                mostCookedCuisine.includes(item.name) && styles.selectedOption,
              ]}
              onPress={() =>
                handleOptionSelect(setMostCookedCuisine, item.name, true)
              }
            >
              <Image source={item.image} style={styles.cuisineImage} />
              <Text style={styles.optionText}>{item.name}</Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.optionsList}
        />
        <TextInput
          style={styles.input}
          placeholder="Not listed? Please specify here"
          placeholderTextColor="#A9A9A9"
          value={customCuisine}
          onChangeText={setCustomCuisine}
        />
        <TouchableOpacity style={styles.nextButton} onPress={handleSubmit}>
          <Text style={styles.nextButtonText}>✔</Text>
        </TouchableOpacity>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F9F9",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 20,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "80%",
  },
  image: {
    width: 300,
    height: 300,
    resizeMode: "contain",
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: "#000000",
    textAlign: "center",
    marginBottom: 20,
  },
  subTitleSmall: {
    fontSize: 14,
    color: "#6D6D6D",
    marginBottom: 10,
    textAlign: "center",
  },
  description: {
    fontSize: 14,
    color: "#6D6D6D",
    textAlign: "center",
    lineHeight: 22,
  },
  button: {
    backgroundColor: "#24A19C",
    width: "90%",
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  questionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "left",
    width: "90%",
    color: "#000",
    marginVertical: 20,
  },
  optionsList: {
    alignItems: "center",
    width: "100%",
  },
  option: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    width: "90%",
    marginVertical: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  selectedOption: {
    backgroundColor: "#24A19C",
  },
  optionText: {
    fontSize: 16,
    color: "#000",
    textAlign: "center",
  },
  nextButton: {
    backgroundColor: "#24A19C",
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  nextButtonText: {
    fontSize: 24,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  cuisineOption: {
    alignItems: "center",
    justifyContent: "center",
    width: "40%",
    margin: 10,
    borderRadius: 10,
    backgroundColor: "#FFF",
    paddingVertical: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cuisineImage: {
    width: 50,
    height: 50,
    marginBottom: 10,
    resizeMode: "contain",
  },
  input: {
    borderWidth: 1,
    borderColor: "#A9A9A9",
    borderRadius: 10,
    padding: 10,
    width: "90%",
    marginBottom: 20,
    fontSize: 16,
    color: "#000",
  },
});

export default Questions;
