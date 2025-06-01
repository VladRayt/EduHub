import React, { useState } from 'react';
import type { PropsWithChildren } from 'react';
import {
  LayoutAnimation,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

import { Colors } from '@styles/colors';
import { typographyStyles } from '@styles/typography';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type AccordionItemPros = PropsWithChildren<{
  title: string;
}>;

export const AccordionItem = ({ children, title }: AccordionItemPros) => {
  const [expanded, setExpanded] = useState(false);

  function toggleItem() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  }

  const body = <View style={styles.accordBody}>{children}</View>;

  return (
    <View style={styles.accordContainer}>
      <TouchableOpacity style={styles.accordHeader} onPress={toggleItem} activeOpacity={0.7}>
        <Text style={styles.accordTitle}>{title}</Text>
        <Icon name={expanded ? 'chevron-up' : 'chevron-down'} size={20} color='#bbb' />
      </TouchableOpacity>
      {expanded && body}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  accordContainer: {
    paddingBottom: 4,
    height: 'auto',
  },
  accordHeader: {
    padding: 12,
    backgroundColor: Colors.WHITE,
    borderRadius: 12,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    shadowColor: Colors.BLACK,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  accordTitle: {
    color: Colors.DARK_GRAY,
    ...typographyStyles.large,
  },
  accordBody: {
    padding: 12,
  },
});
