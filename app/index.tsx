import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, SafeAreaView, Platform } from 'react-native';
import { useRouter, Stack } from 'expo-router'; 

export default function AddUserScreen() {
  const router = useRouter();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    // 1. Basic Empty Check (Frontend)
    if (!name || !email || !phone) {
      alert("Error: Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      const userData = { 
        name: name, 
        email: email, 
        phone_number: phone 
      };

      // 2. Send Request to Backend
      // Using localhost since you are testing on Web
      const response = await fetch('http://localhost:5050/api/users/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      // 3. Handle Response
      const data = await response.json(); // Read the JSON response from backend

      if (response.ok) {
        // SUCCESS
        alert("Success: " + (data.message || "User added!"));
        setName(''); setEmail(''); setPhone(''); // Clear form
      } else {
        // ERROR (Validation failed, Duplicate user, etc.)
        
        // Your ApiError usually sends the message in 'message' or just inside the body
        // We check multiple places to be safe
        let errorMessage = "Failed to add user.";
        
        if (data.message) {
          errorMessage = data.message;
        } else if (typeof data === 'string') {
          errorMessage = data;
        }

        // SHOW THE ALERT ON WEB
        alert("Error: " + errorMessage);
        console.log("Backend Error Details:", data); // Check Console (F12) if alert is vague
      }

    } catch (error) {
      console.error(error);
      alert("Network Error: Is the backend server running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: 'Home Screen' }} /> 

      <View style={styles.content}>
        <Text style={styles.title}>Add User</Text>

        <Text style={styles.label}>Name</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Enter Name" 
          value={name} 
          onChangeText={setName} 
        />

        <Text style={styles.label}>Email</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Enter Email" 
          value={email} 
          onChangeText={setEmail} 
          autoCapitalize="none"
        />

        <Text style={styles.label}>Phone</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Enter Phone" 
          value={phone} 
          onChangeText={setPhone} 
          keyboardType="phone-pad"
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Submit</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.secondaryButton} 
          onPress={() => router.push('/list' as any)}
        >
          <Text style={styles.secondaryButtonText}>View User List</Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 20, marginTop: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  label: { fontSize: 16, marginBottom: 5, fontWeight: '500' },
  input: { 
    borderWidth: 1, 
    borderColor: '#ccc', 
    borderRadius: 8, 
    padding: 12, 
    marginBottom: 15, 
    fontSize: 16 
  },
  button: { 
    backgroundColor: '#007AFF', 
    padding: 15, 
    borderRadius: 8, 
    alignItems: 'center' 
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  secondaryButton: { 
    marginTop: 20, 
    backgroundColor: '#34C759', 
    padding: 15, 
    borderRadius: 8, 
    alignItems: 'center' 
  },
  secondaryButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});