import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, SafeAreaView, TextInput, TouchableOpacity, Alert, Platform } from 'react-native';
import { useFocusEffect, Stack  } from 'expo-router'; 
import { AntDesign } from '@expo/vector-icons'; 

const API_URL = 'http://localhost:5050/api/users';

interface User {
  _id: string;
  name: string;
  email: string;
  phone_number: string;
}

export default function UserListScreen() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch Users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      
      if (data.data) {
        setUsers(data.data);
      } else {
        // Fallback in case structure changes
        setUsers(data);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
      Alert.alert("Error", "Could not load users. Check if backend is running.");
    } finally {
      setLoading(false);
    }
  };

 // Delete User
  const handleDelete = async (userId: string) => {
    
    // The actual logic to send the DELETE request
    const performDelete = async () => {
      try {
        const response = await fetch(`${API_URL}/${userId}`, { method: 'DELETE' });
        if (response.ok) {
          setUsers(prev => prev.filter(u => u._id !== userId));
          if (Platform.OS !== 'web') Alert.alert("Success", "User deleted");
        } else {
          alert("Error: Failed to delete");
        }
      } catch (e) {
        alert("Error: Network error");
      }
    };

    // CHECK
    if (Platform.OS === 'web') {
      // Using standard browser confirm
      if (confirm("Are you sure you want to delete this user?")) {
        await performDelete();
      }
    } else {
      // Using Mobile Native Alert
      Alert.alert("Confirm Deletion", "Are you sure?", [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: 'destructive',
          onPress: performDelete
        }
      ]);
    }
  };

  // Reload data when screen opens
  useFocusEffect(
    useCallback(() => {
      fetchUsers();
    }, [])
  );

  // Search Filter
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Render Individual Card
  const renderItem = ({ item }: { item: User }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardText}>Email: {item.email}</Text>
        <Text style={styles.cardText}>Phone: {item.phone_number}</Text>
      </View>
      <TouchableOpacity onPress={() => handleDelete(item._id)} style={styles.deleteButton}>
        <AntDesign name="delete" size={20} color="red" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
    <Stack.Screen options={{ title: 'List' }} />
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by Name or Email..."
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
      </View>

      <Text style={styles.title}>User List ({filteredUsers.length})</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={{marginTop: 20}} />
      ) : (
        <FlatList
          data={filteredUsers}
          renderItem={renderItem}
          keyExtractor={item => item._id}
          contentContainerStyle={{ padding: 10 }}
          ListEmptyComponent={<Text style={{textAlign: 'center', marginTop: 20}}>No users found.</Text>}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginVertical: 10 },
  searchContainer: { padding: 15, backgroundColor: 'white', borderBottomWidth: 1, borderColor: '#ddd' },
  searchInput: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, fontSize: 16 },
  card: { flexDirection: 'row', backgroundColor: 'white', padding: 15, borderRadius: 10, marginBottom: 10, alignItems: 'center', shadowOpacity: 0.1, shadowRadius: 3, elevation: 2 },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  cardText: { fontSize: 14, color: '#555' },
  deleteButton: { padding: 10 },
});