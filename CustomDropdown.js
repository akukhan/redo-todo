import React, { useState } from 'react';
import { View, Text, Modal, TextInput, Button, FlatList, TouchableOpacity } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

const CustomDropdown = ({ selectedCategory, setSelectedCategory, categories, setCategories }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [newCategory, setNewCategory] = useState('');

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      setCategories([...categories, { label: newCategory, value: newCategory }]);
      setNewCategory('');
      setModalVisible(false);
    }
  };

  const handleDeleteCategory = (categoryToDelete) => {
    const updatedCategories = categories.filter(category => category.value !== categoryToDelete);
    setCategories(updatedCategories);
  };

  return (
    <View>
      <RNPickerSelect
        onValueChange={(value) => setSelectedCategory(value)}
        items={categories}
        value={selectedCategory}
        placeholder={{ label: 'Select Category', value: null }}
      />

      <Button title="Add Category" onPress={() => setModalVisible(true)} />

      <Modal visible={modalVisible} animationType="slide">
        <View>
          <TextInput
            placeholder="New Category"
            value={newCategory}
            onChangeText={setNewCategory}
          />
          <Button title="Add" onPress={handleAddCategory} />
          <Button title="Cancel" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>

      <FlatList
        data={categories}
        keyExtractor={(item) => item.value}
        renderItem={({ item }) => (
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10 }}>
            <Text>{item.label}</Text>
            <Button title="Delete" onPress={() => handleDeleteCategory(item.value)} />
          </View>
        )}
      />
    </View>
  );
};

export default CustomDropdown;
