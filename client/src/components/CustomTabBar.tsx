import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { colors, shadows, radius, spacing } from '@/theme/theme';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types/navigation';

const ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  Home: 'home-outline',
  History: 'time-outline',
  NewFocus: 'add-circle-outline',
  Statistics: 'analytics-outline',
  Badges: 'ribbon-outline',
  Profile: 'person-outline',
};

export const CustomTabBar: React.FC<BottomTabBarProps> = ({ state, navigation }) => {
  const renderTab = (route: (typeof state.routes)[number]) => {
    const isFocused = state.routes[state.index].key === route.key;
    return (
      <TouchableOpacity
        key={route.key}
        onPress={() => navigation.navigate(route.name)}
        style={styles.tabButton}
        activeOpacity={0.7}
      >
        <Ionicons
          name={ICONS[route.name]}
          size={26}
          color={isFocused ? colors.accent : colors.textMuted}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {state.routes.map((route) => renderTab(route))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.tabBar,
    height: 78,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
    width: '100%',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
    ...shadows.card,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
