import {
  AuthStackParamList,
  BottomTabParamsList,
  CompositeMainProfile,
  CompositeMainProgress,
  CompositeProgressProfile,
  MainStackParamsList,
  ProfileStackParamsList,
  ProgressStackParamsList,
} from '../mobile-types/navigation.type';
import { NavigationProp, useNavigation } from '@react-navigation/native';

export const useAuthNavigation = () => {
  return useNavigation<NavigationProp<AuthStackParamList>>();
};

export const useMainNavigation = () => {
  return useNavigation<NavigationProp<MainStackParamsList>>();
};

export const useProfileNavigation = () => {
  return useNavigation<NavigationProp<ProfileStackParamsList>>();
};

export const useBottomTabNavigation = () => {
  return useNavigation<NavigationProp<BottomTabParamsList>>();
};

export const useProgressNavigation = () => {
  return useNavigation<NavigationProp<ProgressStackParamsList>>();
};

export const useMainProfileNavigation = () => {
  return useNavigation<CompositeMainProfile>();
};

export const useMainProgressNavigation = () => {
  return useNavigation<CompositeMainProgress>();
};

export const useProfileProgressNavigation = () => {
  return useNavigation<CompositeProgressProfile>();
};
