import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
} from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';
import { useRouter } from 'expo-router';

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in both fields.');
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      Alert.alert('Success', `Welcome back, ${userCredential.user.email}!`);
      // Navigate to the home screen or another screen after login
      router.push({ pathname: '/Questions', params: { email } });
    } catch (error) {
      Alert.alert('Login Failed', error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Title */}
        <Text style={styles.title}>Login</Text>

        {/* Email Input */}
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {/* Password Input */}
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {/* Login Button */}
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        {/* Sign Up Link */}
        <Text style={styles.footerText}>
          Don't have an account?{' '}
          <Text
            style={styles.signUpText}
            onPress={() => router.push('/EmailSignIn')}
          >
            Sign Up
          </Text>
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  content: {
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 40,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    backgroundColor: '#F8F8F8',
    width: '100%',
  },
  loginButton: {
    backgroundColor: '#24A19C',
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  footerText: {
    marginTop: 20,
    fontSize: 14,
    color: '#333333',
  },
  signUpText: {
    color: '#24A19C',
    fontWeight: '600',
  },
});

export default Login;
