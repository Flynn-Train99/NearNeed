import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors, fonts, sizes, spacing, shadows } from '../constants/theme';

const RequestCard = ({ request, onRespond }) => {
  const navigation = useNavigation();
  
  // Default avatar if none provided
  const avatarSource = request.userId.photo 
    ? { uri: request.userId.photo } 
    : require('../assets/images/default-avatar.png');

  const handleCardPress = () => {
    navigation.navigate('RequestDetail', { requestId: request._id });
  };

  return (
    <TouchableOpacity 
      style={styles.card}
      onPress={handleCardPress}
      activeOpacity={0.8}
    >
      <View style={styles.cardContent}>
        <Text style={styles.title} numberOfLines={1}>
          {request.need}
        </Text>
        
        <Text style={styles.budget}>
          {request.budget.type === 'cash' 
            ? `£${request.budget.amount}` 
            : 'Favor'} | {request.distance} mi
        </Text>
        
        <View style={styles.userRow}>
          <Image source={avatarSource} style={styles.avatar} />
          
          <View style={styles.userInfo}>
            <Text style={styles.userName}>
              {request.userId.name?.split(' ')[0] || 'User'} {request.userId.name?.split(' ')[1]?.charAt(0) || ''}. 
              <Text style={styles.userRating}>
                {' '}{request.userId.rating?.average?.toFixed(1) || '0.0'}★ 
                {request.userId.rating?.count ? `, ${request.userId.rating.count} reviews` : ''}
              </Text>
            </Text>
            
            <Text style={styles.favorStats}>
              {request.userId.favorStats?.done || 0} done, 
              {request.userId.favorStats?.missed || 0} missed
            </Text>
          </View>
          
          <TouchableOpacity 
            style={styles.respondButton}
            onPress={() => onRespond(request)}
          >
            <Text style={styles.respondButtonText}>Respond</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.socialRow}>
          <TouchableOpacity style={styles.socialButton}>
            <Ionicons name="heart-outline" size={20} color={colors.gray} />
            <Text style={styles.socialCount}>0</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.socialButton}>
            <Ionicons name="chatbubble-outline" size={20} color={colors.gray} />
            <Text style={styles.socialCount}>0</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.socialButton}>
            <Ionicons name="share-outline" size={20} color={colors.gray} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '90%',
    maxWidth: 600,
    height: 300,
    marginVertical: 10,
    marginHorizontal: '5%',
    borderRadius: 12,
    backgroundColor: colors.white,
    ...shadows.medium
  },
  cardContent: {
    flex: 1,
    padding: spacing.m
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: sizes.l,
    color: colors.black,
    marginBottom: spacing.xs
  },
  budget: {
    fontFamily: fonts.medium,
    fontSize: sizes.m,
    color: colors.teal,
    marginBottom: spacing.m
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.m
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: spacing.s
  },
  userInfo: {
    flex: 1
  },
  userName: {
    fontFamily: fonts.medium,
    fontSize: sizes.m,
    color: colors.black
  },
  userRating: {
    fontFamily: fonts.medium,
    fontSize: sizes.m,
    color: colors.gold
  },
  favorStats: {
    fontFamily: fonts.regular,
    fontSize: sizes.s,
    color: colors.gray
  },
  respondButton: {
    backgroundColor: colors.orange,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.m,
    borderRadius: 20,
    height: 40,
    justifyContent: 'center'
  },
  respondButtonText: {
    fontFamily: fonts.medium,
    fontSize: sizes.m,
    color: colors.white
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 'auto'
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: spacing.m
  },
  socialCount: {
    fontFamily: fonts.regular,
    fontSize: sizes.s,
    color: colors.gray,
    marginLeft: spacing.xs
  }
});

export default RequestCard;