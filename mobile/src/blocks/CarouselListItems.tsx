import {
  Dimensions,
  GestureResponderEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Carousel from 'react-native-snap-carousel';

import { IconButton } from '@components/IconButton';
import { Colors, PrimaryColor } from '@styles/colors';
import { typographyStyles } from '@styles/typography';

type CarouselItem = {
  title: string;
  description: string;
  id: string;
  color: PrimaryColor;
};

type Props = {
  seeAll: string;
  title: string;
  items: CarouselItem[];
  onSeeAllPress: () => void | Promise<void>;
  onItemPress: (id: string) => void | Promise<void>;
  onIconPress: (item: CarouselItem) => void | Promise<void>;
};

export function CarouselListItems(props: Props) {
  const { title, items, onSeeAllPress, onItemPress, onIconPress, seeAll } = props;

  const handleIconPress = (event: GestureResponderEvent, item: CarouselItem) => {
    event.stopPropagation();
    onIconPress(item);
  };
  return (
    <View style={styles.carouselContainer}>
      <View style={styles.carouselHeaderContainer}>
        <Text style={styles.carouselTitle}>{title}</Text>
        <TouchableOpacity onPress={onSeeAllPress}>
          <Text style={styles.carouselLink}>{seeAll}</Text>
        </TouchableOpacity>
      </View>
      <Carousel
        vertical={false}
        layout={'default'}
        sliderWidth={Dimensions.get('window').width * 0.85}
        itemWidth={Dimensions.get('window').width * 0.85}
        data={items}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              style={[styles.itemContainer, { backgroundColor: item.color }]}
              activeOpacity={0.7}
              onPress={() => onItemPress(item.id)}
            >
              <View style={styles.itemTextWrapper}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemDescription}>{item.description}</Text>
              </View>
              {/* <IconButton
                onPress={(e) => handleIconPress(e, item)}
                iconLib='Feather'
                iconName='more-horizontal'
              /> */}
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  carouselContainer: {
    rowGap: 24,
  },
  carouselHeaderContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  carouselTitle: {
    ...typographyStyles.xl,
  },
  carouselLink: {
    ...typographyStyles.large,
    color: Colors.BLUE,
    textDecorationLine: 'underline',
  },
  itemContainer: {
    borderRadius: 12,
    height: 180,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemTextWrapper: {
    rowGap: 12,
  },
  itemTitle: {
    ...typographyStyles.xl2,
    color: Colors.LIGHT_GRAY,
  },
  itemDescription: {
    ...typographyStyles.medium,
    color: Colors.LIGHT_GRAY,
  },
});
