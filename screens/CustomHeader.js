import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

const CustomHeader = ({ selectedCategory, setSelectedCategory }) => {


  return (
    <View style={styles.headerContainer}>
      <Text style={styles.title}>Select Category:</Text>
      <TouchableOpacity style={styles.pickerContainer}>
        <RNPickerSelect
          onValueChange={(value) => setSelectedCategory(value)}
          items={[
            { label: 'All', value: 'All' },
            { label: 'Work', value: 'Work' },
            { label: 'Personal', value: 'Personal' },
            { label: 'Home', value: 'Home' },
            { label: 'Shopping', value: 'Shopping' },
            { label: 'Completed', value: 'Completed' },
          ]}
          value={selectedCategory}
          style={pickerSelectStyles}
          placeholder={{ label: 'Select Category', value: null }}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    padding: 5,
    backgroundColor: '#a98a56',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 15,
    marginBottom: 5,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
  },
  pickerContainer: {
    flex: 1, // Ensures it takes up available space
    marginLeft: 10,
  },
});

const pickerSelectStyles = {
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30, // to ensure the text is not cut off by the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is not cut off by the icon
  },
};

export default CustomHeader;
