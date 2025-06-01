import React, { useMemo, useState } from 'react';
import { Modal, StyleSheet, Text, TextInput, View } from 'react-native';

import { Button, Size } from '@components/Button';
import { If } from '@components/If';
import { t } from '@config/i18next';

// eslint-disable-next-line no-useless-escape
const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

type Props = {
  visible: boolean;
  handleClose: () => void;
  handleAccept: (email: string) => void | Promise<void>;
};

export const InviteModal = ({ visible, handleClose, handleAccept }: Props) => {
  const [email, setEmail] = useState('');

  const handleSendInvite = () => {
    handleAccept(email);
    setEmail('');
    handleClose();
  };

  const error = useMemo(() => {
    return !emailRegex.test(email);
  }, [email]);

  return (
    <Modal animationType='fade' transparent={true} visible={visible} onRequestClose={handleClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{t('invite-modal.title')}</Text>
          <TextInput
            style={styles.input}
            placeholder={t('invite-modal.placeholder')}
            value={email}
            onChangeText={setEmail}
          />
          <If value={!!(error && email.length)}>
            <Text style={styles.errorText}>{t('invite-modal.error')}</Text>
          </If>
          <View style={styles.buttonContainer}>
            <Button
              title={t('invite-modal.cancel')}
              onPress={handleClose}
              size={Size.SMALL}
              rounded
            />
            <Button
              title={t('invite-modal.accept')}
              onPress={handleSendInvite}
              size={Size.SMALL}
              rounded
              disabled={!email.length || error}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  errorText: {
    fontSize: 16,
    fontWeight: '500',
    color: 'red',
  },
  modalContent: {
    width: '100%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButton: {
    backgroundColor: 'gray',
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: 'blue',
    marginLeft: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
