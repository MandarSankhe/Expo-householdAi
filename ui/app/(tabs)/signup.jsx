import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import * as Google from 'expo-auth-session/providers/google';
import { makeRedirectUri } from 'expo-auth-session';
import { getAuth, signInWithCredential, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebase'; // Make sure this is correctly configured
import { Platform } from 'react-native';

const SignUpScreen = () => {
  const [user, setUser] = useState(null);

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    webClientId: '663909239939-5glbctcrsgan2stb37ulf9d2cpght417.apps.googleusercontent.com',
    iosClientId: '663909239939-97jguodrco7hacq1im949gtqfhhhjghd.apps.googleusercontent.com',
    redirectUri: makeRedirectUri({ useProxy: true }),
  });

  useEffect(() => {
    if (Platform.OS === 'web') {
      // Web-specific handling
      const url = window.location.href;
      if (url.includes('access_token') || url.includes('id_token')) {
        const params = new URLSearchParams(url.split('#')[1]);
        const idToken = params.get('id_token');
        if (idToken) {
          const credential = GoogleAuthProvider.credential(idToken);
          signInWithCredential(auth, credential)
            .then((userCredential) => {
              setUser(userCredential.user);
              console.log('User Signed In (Web):', userCredential.user);
            })
            .catch((error) => {
              console.error('Firebase Authentication Error (Web):', error);
            });
        }
      }
    } else {
      // Native-specific handling (Expo Go on iOS/Android)
      if (response?.type === 'success') {
        const { id_token } = response.params;
        if (id_token) {
          const credential = GoogleAuthProvider.credential(id_token);
          signInWithCredential(auth, credential)
            .then((userCredential) => {
              setUser(userCredential.user);
              console.log('User Signed In (Native):', userCredential.user);
            })
            .catch((error) => {
              console.error('Firebase Authentication Error (Native):', error);
            });
        }
      } else if (response?.type === 'dismiss') {
        console.error('Sign-in process was dismissed.');
      }
    }
  }, [response]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Icon name="link-variant" size={80} color="#24A19C" />
          <Text style={styles.logoText}>Household AI</Text>
        </View>

        {/* Sign Up with Email Button */}
        <TouchableOpacity style={styles.emailButton}>
          <FontAwesome name="envelope" size={20} color="#FFFFFF" />
          <Text style={styles.buttonText}>Sign Up with Email</Text>
        </TouchableOpacity>

        {/* Divider */}
        <Text style={styles.orText}>or</Text>

        {/* Continue with Google Button */}
        <TouchableOpacity style={styles.googleButton} onPress={() => promptAsync()}>
          <Image
            source={require('@/assets/images/google-icon.png')}
            style={styles.googleIcon}
          />
          <Text style={styles.buttonTextDark}>Continue with Google</Text>
        </TouchableOpacity>

        {/* Continue as Guest Button */}
        <TouchableOpacity style={styles.guestButton}>
          <Text style={styles.buttonTextDark}>Continue as guest</Text>
        </TouchableOpacity>

        {/* Login Link */}
        <Text style={styles.footerText}>
          Already have an account?{' '}
          <Text style={styles.loginText}>Login</Text>
        </Text>

        {/* Display User Info */}
        {user && (
          <View style={styles.userInfo}>
            <Text>Welcome, {user.displayName}</Text>
            <Text>Email: {user.email}</Text>
            <Image source={{ uri: user.photoURL }} style={styles.profilePic} />
          </View>
        )}
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
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#24A19C',
    marginTop: 10,
  },
  emailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#24A19C',
    paddingVertical: 12,
    borderRadius: 8,
    width: '80%',
    marginBottom: 20,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingVertical: 12,
    borderRadius: 8,
    width: '80%',
    marginBottom: 15,
  },
  guestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingVertical: 12,
    borderRadius: 8,
    width: '80%',
  },
  googleIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 10,
  },
  buttonTextDark: {
    color: '#333333',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 10,
  },
  orText: {
    color: '#A9A9A9',
    fontSize: 14,
    marginVertical: 10,
  },
  footerText: {
    marginTop: 20,
    fontSize: 14,
    color: '#333333',
  },
  loginText: {
    color: '#24A19C',
    fontWeight: '600',
  },
  userInfo: {
    marginTop: 20,
    alignItems: 'center',
  },
  profilePic: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginTop: 10,
  },
});

export default SignUpScreen;
