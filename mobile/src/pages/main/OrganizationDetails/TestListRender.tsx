import React from 'react';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';

import { CompletedTestCard } from '@blocks/CompletedTestCard';
import { TestCard } from '@blocks/TestCard';
import { If } from '@components/If';
import { t } from '@config/i18next';
import { CompletedTest, Test } from '../../../mobile-types/front-types';
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list';
import { typographyStyles } from '@styles/typography';

const imageWidth = Dimensions.get('screen').width * 0.5;

type Props = {
  selectedTab: 'uncompleted' | 'completed';
  isAdmin: boolean;
  filteredUncompleted: Test[];
  filteredCompleted: CompletedTest[];
  isLoadingTests: boolean;
  selectTest: (test: CompletedTest | Test, isCompleted: boolean) => void;
};

export const TestListRender = (props: Props) => {
  const {
    selectedTab,
    isAdmin,
    filteredUncompleted,
    filteredCompleted,
    isLoadingTests,
    selectTest,
  } = props;

  const isUncompletedTab =
    selectedTab === 'uncompleted' && filteredUncompleted.length > 0 && !isLoadingTests;

  const isAdminTab = isAdmin && filteredUncompleted.length > 0 && !isLoadingTests;

  const isCompletedTab =
    selectedTab === 'completed' && filteredCompleted.length > 0 && !isLoadingTests;

  const isEmpty =
    ((selectedTab === 'completed' && filteredCompleted.length === 0) ||
      (selectedTab === 'uncompleted' && filteredUncompleted.length === 0)) &&
    !isLoadingTests;

  const renderUncompletedItem = ({ item }: ListRenderItemInfo<Test>) => (
    <TestCard test={item} onPress={() => selectTest(item, false)} />
  );

  const renderCompletedItem = ({ item }: ListRenderItemInfo<CompletedTest>) => (
    <CompletedTestCard completedTest={item} onPress={() => selectTest(item, true)} />
  );

  return (
    <>
      <If value={!isAdmin}>
        <If value={isUncompletedTab}>
          <FlashList
            estimatedItemSize={28}
            data={filteredUncompleted}
            renderItem={renderUncompletedItem}
          />
        </If>
        <If value={isCompletedTab}>
          <FlashList
            estimatedItemSize={28}
            data={filteredCompleted}
            renderItem={renderCompletedItem}
          />
        </If>
      </If>
      <If value={isAdminTab}>
        <FlashList
          estimatedItemSize={28}
          data={filteredUncompleted}
          renderItem={renderUncompletedItem}
        />
      </If>
      <If value={isEmpty}>
        <View style={styles.imageContainer}>
          <Image
            source={require('@assets/empty_list.png')}
            resizeMode='contain'
            width={imageWidth}
            style={styles.image}
          />
          <Text style={styles.textStyle}>{t('main.organization-details.empty')}</Text>
        </View>
      </If>
    </>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    flex: 1,
    width: '100%',
    rowGap: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: imageWidth,
    aspectRatio: 1,
    height: 'auto',
  },
  textStyle: { ...typographyStyles.medium, textAlign: 'center', color: Colors.DARK_GRAY },
});
