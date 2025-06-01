import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { IconButton } from '@components/IconButton';
import { If } from '@components/If';
import { useMainNavigation } from '@hooks/useTypedNavigation';
import { MainNavigation } from '../../../mobile-types/navigation.type';
import { StackActions } from '@react-navigation/native';
import { useCreateOrganization } from '@requests/organization';
import { Colors, PrimaryColor } from '@styles/colors';

import { InviteUsersPage } from './OrganizationMembersPage';
import { OrganizationSetupPage } from './OrganizationSetupPage';

export const CreateOrganization = () => {
  const [step, setStep] = useState<number>(1);
  const [organizationName, setOrganizationName] = useState('');
  const [organizationDescription, setOrganizationDescription] = useState('');

  const [primaryColor, setPrimaryColor] = useState(PrimaryColor.CrimsonRed);
  const [emails, setEmails] = useState<string[]>([]);

  const { navigate, setOptions, goBack, dispatch } = useMainNavigation();

  const setHeaderOptions = useCallback(() => {
    setOptions({
      headerStyle: {
        backgroundColor: primaryColor,
      },
      headerLeft: () => (
        <IconButton
          iconLib='Feather'
          iconName='arrow-left'
          iconColor={Colors.LIGHT_GRAY}
          onPress={() => (step === 2 ? setStep(1) : goBack())}
        />
      ),
    });
  }, [step, primaryColor]);

  useEffect(() => {
    setHeaderOptions();
  }, [setHeaderOptions]);

  const { createOrganization, isError, isLoading } = useCreateOrganization();

  const handleSubmit = async () => {
    const organizationId = await createOrganization({
      title: organizationName,
      color: primaryColor,
      description: organizationDescription,
    });
    if (!organizationId) return;
    dispatch(StackActions.popToTop());
    navigate(MainNavigation.ORGANIZATION_DETAILS, {
      organizationId: organizationId,
    });
  };

  return (
    <View style={styles.container}>
      <If value={step === 1}>
        <OrganizationSetupPage
          organizationName={organizationName}
          setOrganizationName={setOrganizationName}
          organizationDescription={organizationDescription}
          setOrganizationDescription={setOrganizationDescription}
          primaryColor={primaryColor}
          setPrimaryColor={setPrimaryColor}
          handleNext={() => setStep(2)}
        />
      </If>
      <If value={step === 2}>
        <InviteUsersPage
          emails={emails}
          setEmails={setEmails}
          disabled={isLoading || isError}
          handleSubmit={handleSubmit}
        />
      </If>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: '7.5%',
    flex: 1,
    width: '100%',
  },
});
