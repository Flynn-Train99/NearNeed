import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { colors, fonts, sizes, spacing, shadows } from '../constants/theme';

const FilterBar = ({ filters, onFilterChange }) => {
  const radiusOptions = ['All', '0.5', '1', '2', '5', '10'];
  const priceOptions = ['All', 'Free', '£1-5', '£5-10', 'Favors'];
  const categoryOptions = ['All', 'Tools', 'Pets', 'Help', 'Other'];
  
  return (
    <ScrollView 
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <View style={styles.filterItem}>
        <Text style={styles.label}>Radius:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            style={styles.picker}
            selectedValue={filters.radius}
            onValueChange={(value) => onFilterChange('radius', value)}
          >
            {radiusOptions.map((option) => (
              <Picker.Item 
                key={option} 
                label={option === 'All' ? option : `${option} mi`} 
                value={option}
              />
            ))}
          </Picker>
        </View>
      </View>
      
      <View style={styles.filterItem}>
        <Text style={styles.label}>Price:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            style={styles.picker}
            selectedValue={filters.price}
            onValueChange={(value) => onFilterChange('price', value)}
          >
            {priceOptions.map((option) => (
              <Picker.Item 
                key={option} 
                label={option} 
                value={option}
              />
            ))}
          </Picker>
        </View>
      </View>
      
      <View style={styles.filterItem}>
        <Text style={styles.label}>Category:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            style={styles.picker}
            selectedValue={filters.category}
            onValueChange={(value) => onFilterChange('category', value)}
          >
            {categoryOptions.map((option) => (
              <Picker.Item 
                key={option} 
                label={option} 
                value={option}
              />
            ))}
          </Picker>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 8,
    ...shadows.small,
    maxHeight: 50
  },
  content: {
    paddingHorizontal: spacing.s,
    alignItems: 'center'
  },
  filterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.xs,
    paddingVertical: spacing.xs
  },
  label: {
    fontFamily: fonts.medium,
    fontSize: sizes.s,
    color: colors.gray,
    marginRight: spacing.xs
  },
  pickerContainer: {
    backgroundColor: colors.lightGray,
    borderRadius: 4,
    width: 120
  },
  picker: {
    height: 30,
    width: '100%'
  }
});

export default FilterBar;