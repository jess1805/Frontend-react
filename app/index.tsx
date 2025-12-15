import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';

export default function AddUserScreen() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async () => {
    // basic frontend validation
    if (!name || !email || !phone) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const userData = {
        name,
        email,
        phone_number: phone,
      };

      const response = await fetch('http://localhost:5050/api/users/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message || 'User added successfully');
        setName('');
        setEmail('');
        setPhone('');
      } else {    
        const message = data.message;

        if (typeof message === 'string') {
          const cleanedMessage = message.split(':').pop()?.trim();
          setError(cleanedMessage || 'Failed to add user');
          } else if (typeof message === 'object' && message !== null) {
          // handles cases like { phone_number: "Invalid phone number" }
        const firstError = Object.values(message)[0];
          setError(String(firstError));
      } else {
      setError('Failed to add user');
        }
      }
    } catch (err) {
      // this usually means server is down or unreachable
      setError('Server not reachable. Please try again later.');
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

        {/* showing backend / validation errors here */}
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {/* success message after user is added */}
        {success ? <Text style={styles.successText}>{success}</Text> : null}

        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Submit</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => router.push('/list')}
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: { fontSize: 16, marginBottom: 5, fontWeight: '500' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
  successText: {
    color: 'green',
    marginBottom: 10,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  secondaryButton: {
    marginTop: 20,
    backgroundColor: '#34C759',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  secondaryButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
