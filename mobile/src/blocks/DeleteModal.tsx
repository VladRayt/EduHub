import React from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';

import { Button } from '@components/Button';
import { t } from '@config/i18next';
import { Colors } from '@styles/colors';

type Props = {
  visible: boolean;
  handleClose: () => void;
  handleAccept: () => void | Promise<void>;
};

export const DeleteModal = ({ visible, handleAccept, handleClose }: Props) => {
  return (
    <Modal animationType='fade' transparent={true} visible={visible} onRequestClose={handleClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>{t('delete-modal.title')}</Text>
          <View style={styles.modalButtons}>
            <Button title={t('delete-modal.cancel')} onPress={handleClose} />
            <Button title={t('delete-modal.accept')} onPress={handleAccept} color={Colors.RED} />
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
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    alignItems: 'center',
  },
  modalText: {
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
});
