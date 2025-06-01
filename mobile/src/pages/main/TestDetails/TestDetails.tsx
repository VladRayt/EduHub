import React, { useCallback, useLayoutEffect } from 'react';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';

import { t } from '@config/i18next';

import { Button, Size } from '@components/Button';
import { IconButton } from '@components/IconButton';
import { useMainNavigation } from '@hooks/useTypedNavigation';
import { MainNavigation, MainRouteProp } from '../../../mobile-types/navigation.type';
import { StackActions } from '@react-navigation/native';
import { useTestDetails } from '@requests/test';
import { Colors, PrimaryColor } from '@styles/colors';
import { typographyStyles } from '@styles/typography';
import { useOrganizationStore } from '@zustand/organization.store';
import { useTestStore } from '@zustand/test.store';

type Props = MainRouteProp<MainNavigation.TEST_DETAILS>;

export const TestDetails = ({ route }: Props) => {
  const { testId } = route.params;
  const { navigate, setOptions, dispatch } = useMainNavigation();
  const selectedTest = useTestStore((state) => state.selectedTest);
  const organizationColor = useOrganizationStore((state) => state.selectedOrganization?.color);

  useTestDetails(testId);

  const setHeaderOptions = useCallback(() => {
    const handleReturn = () => {
      dispatch(StackActions.popToTop());
      navigate(MainNavigation.ORGANIZATION_DETAILS, {
        organizationId: selectedTest?.organizationId ?? '',
      });
    };
    setOptions({
      title: selectedTest?.title,
      headerTitleStyle: {
        color: Colors.LIGHT_GRAY,
        ...typographyStyles.xl,
        textAlign: 'center',
      },
      headerTitleAlign: 'center',
      headerStyle: {
        backgroundColor: organizationColor,
      },
      headerLeft: () => (
        <IconButton
          iconLib='Feather'
          iconName='arrow-left'
          iconColor={Colors.LIGHT_GRAY}
          onPress={handleReturn}
        />
      ),
    });
  }, [selectedTest?.organizationId, selectedTest?.title, organizationColor]);

  useLayoutEffect(() => setHeaderOptions(), [setHeaderOptions]);

  const onTestStart = () => {
    navigate(MainNavigation.TEST_COMPLETING, {
      organizationColor: organizationColor as PrimaryColor,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={require('@assets/test_details.png')}
          resizeMode='contain'
          style={styles.image}
        />
      </View>
      <View style={styles.detailsStyle}>
        <Text style={typographyStyles.xl}>{selectedTest?.title}</Text>
        <Text style={typographyStyles.large}>{`${t('main.test.theme')}: ${selectedTest?.theme
          }`}</Text>
        <Text style={typographyStyles.medium}>{selectedTest?.description}</Text>
        <Text style={typographyStyles.medium}>{`${t('main.test.questions')}: ${selectedTest?.questions?.length ?? 0
          }`}</Text>
      </View>
      <Button
        onPress={onTestStart}
        color={organizationColor as PrimaryColor}
        title={t('main.test.button-start')}
        rounded
        size={Size.LARGE}
        style={styles.buttonStyle}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    flex: 1,
    flexBasis: '40%',
    paddingHorizontal: '7.5%',
    width: '100%',
  },
  imageContainer: {
    flex: 1,
    width: '100%',
    rowGap: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: Dimensions.get('screen').width * 0.5,
    aspectRatio: 1,
    height: 'auto',
  },
  textStyle: { ...typographyStyles.medium, textAlign: 'center', color: Colors.DARK_GRAY },
  detailsStyle: {
    justifyContent: 'center',
    flexBasis: '40%',
    rowGap: 16,
  },
  buttonStyle: { alignSelf: 'center' },
});
