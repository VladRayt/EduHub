import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { CardItem } from '@blocks/CardItem';
import { Button, Size } from '@components/Button';
import { AnimatedInput } from '@components/Input';
import { AnimatedTextArea } from '@components/TextArea';
import { PrimaryColor } from '@styles/colors';
import { typographyStyles } from '@styles/typography';

const emptyFunction = () => {};

type Props = {
  organizationName: string;
  primaryColor: PrimaryColor;
  setOrganizationName: (text: string) => void;
  setOrganizationDescription: (text: string) => void;
  organizationDescription: string;

  setPrimaryColor: (color: PrimaryColor) => void;
  handleNext: () => void;
};

export const OrganizationSetupPage = (props: Props) => {
  const {
    organizationName,
    setOrganizationName,
    primaryColor,
    setPrimaryColor,
    handleNext,
    organizationDescription,
    setOrganizationDescription,
  } = props;

  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Text style={{ fontSize: 40, fontWeight: 'bold', alignSelf: 'flex-start' }}>
          {t('main.create-organization.details')}
        </Text>
        <AnimatedInput
          placeholder={t('main.create-organization.title')}
          onChangeText={setOrganizationName}
          value={organizationName}
        />

        <AnimatedTextArea
          placeholder={t('main.create-organization.description')}
          onChangeText={setOrganizationDescription}
          value={organizationDescription}
        />
      </View>

      <View style={styles.bottomContainer}>
        <Text style={styles.label}>{t('main.create-organization.color')}</Text>
        <View style={styles.colorContainer}>
          {Object.values(PrimaryColor).map((color) => (
            <TouchableOpacity
              key={color}
              style={[
                styles.colorItem,
                {
                  backgroundColor: color,
                  borderColor: primaryColor === color ? 'black' : 'transparent',
                },
              ]}
              onPress={() => setPrimaryColor(color)}
            />
          ))}
        </View>

        <CardItem
          backgroundColor={primaryColor}
          title={organizationName}
          description={organizationDescription}
          onPress={emptyFunction}
          showIcon={false}
        />

        <Button
          title={t('main.create-organization.button-next')}
          size={Size.LARGE}
          onPress={handleNext}
          rounded
          disabled={!organizationName?.length || !primaryColor || !organizationName?.length}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    rowGap: 24,
  },
  topContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-start',
    marginTop: 24,
    alignItems: 'center',
    rowGap: 24,
  },
  bottomContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-end',
    marginBottom: 24,
    alignItems: 'center',
    rowGap: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    ...typographyStyles.medium,
    marginTop: 20,
    alignSelf: 'flex-start',
  },
  colorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  colorItem: {
    borderRadius: 25,
    width: 50,
    height: 50,

    borderWidth: 2,
  },
});
