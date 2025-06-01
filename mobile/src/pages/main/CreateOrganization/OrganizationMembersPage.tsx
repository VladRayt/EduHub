import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

import { Button, Size } from '@components/Button';
import { IconButton } from '@components/IconButton';
import { If } from '@components/If';
import { AnimatedInput } from '@components/Input';
import { FlashList } from '@shopify/flash-list';
import { Colors } from '@styles/colors';
import { typographyStyles } from '@styles/typography';

type Props = {
  emails: string[];
  setEmails: (value: ((prev: string[]) => string[]) | string[]) => void;
  disabled: boolean;
  handleSubmit: () => Promise<void>;
};

export const InviteUsersPage = (props: Props) => {
  const { emails, setEmails, disabled, handleSubmit } = props;
  const [email, setEmail] = useState('');
  const { t } = useTranslation();

  const addEmail = () => {
    if (email.trim() !== '') {
      setEmails((prevEmails) => [...prevEmails, email]);
      setEmail('');
    }
  };

  const removeEmail = (email: string) => {
    setEmails((prevEmails) => prevEmails.filter((m) => m !== email));
  };

  const renderItem = ({ item }: { item: string }) => (
    <View style={styles.emailItem}>
      <Icon name='users' size={32} />
      <Text style={[{ flex: 1 }, typographyStyles.medium]}>{item}</Text>
      <IconButton
        iconLib='Feather'
        iconName='trash-2'
        iconColor={Colors.DARK_GRAY}
        onPress={() => removeEmail(item)}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Text style={styles.title}>{t('main.create-organization.members')}</Text>
        <AnimatedInput
          placeholder={t('main.create-organization.email')}
          onChangeText={setEmail}
          value={email}
        />
        <Button
          title={t('main.create-organization.button-add')}
          size={Size.LARGE}
          onPress={addEmail}
          rounded
        />
      </View>

      <If value={emails.length > 0}>
        <FlashList
          data={emails}
          renderItem={renderItem}
          keyExtractor={(item, index) => `${item}-${index}`}
          style={styles.emailList}
        />
      </If>

      <If value={emails.length === 0}>
        <View style={[styles.emailList, { justifyContent: 'center', alignItems: 'center' }]}>
          <Image
            source={require('@assets/empty_list.png')}
            resizeMode='contain'
            width={Dimensions.get('screen').width * 0.5}
            style={{
              width: Dimensions.get('screen').width * 0.5,
              aspectRatio: 1,
              height: 'auto',
            }}
          />
          <Text style={{ ...typographyStyles.medium, textAlign: 'center' }}>
            {t('main.create-organization.empty')}
          </Text>
        </View>
      </If>

      <Button
        title={t('main.create-organization.button-create')}
        size={Size.LARGE}
        onPress={handleSubmit}
        disabled={disabled}
        rounded
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 24,
  },
  topContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    rowGap: 24,
  },
  title: { fontSize: 40, fontWeight: 'bold', alignSelf: 'flex-start' },
  emailList: {
    flex: 1,
    marginVertical: 20,
    width: '100%',
    rowGap: 10,
  },
  emailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    columnGap: 24,
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.LIGHT_GRAY,
  },
});
