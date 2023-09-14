import React from 'react';
import {
  Dimensions,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {OfferProps} from './Offers';
import moment from 'moment';
import {STATIC_URL} from '../../../App';

const Offer: React.FC<{offer: OfferProps; filterOption: string}> = ({
  offer,
  filterOption,
}) => {
  const {end_date, percent, new_price} = offer.discount;
  const {name, price} = offer;
  const image = {
    uri: `${STATIC_URL}/market/${offer.id}.png`,
  };

  const formatDate = () => {
    const month = moment(end_date).format('MMMM').slice(0, 3) + '.';
    const day = moment(end_date).format('D');
    const hour = moment(end_date).format('H:mm'); // September 13th 2023, 10:23:48 pm
    return day + ' ' + month + ' ' + hour;
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      // onPress={toggleSlide}
      style={styles.container}>
      <ImageBackground style={styles.image} source={image}>
        {filterOption === 'GEL' && (
          <View style={styles.discount}>
            <Text style={styles.discountDate}>{formatDate()}</Text>
            <Text style={styles.discountPercent}>{percent}%</Text>
          </View>
        )}

        <View style={styles.titleContainer}>
          <Text style={styles.title}>{name}</Text>
          <View style={styles.pricesContainer}>
            <Text style={styles.price}>
              {new_price} {filterOption}
            </Text>
            {filterOption === 'GEL' && (
              <Text style={styles.oldPrice}>
                {price} {filterOption}
              </Text>
            )}
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    padding: 8,
    borderRadius: 16,
  },
  image: {
    resizeMode: 'cover',
    height: Dimensions.get('screen').width / 3 - 16,
    width: Dimensions.get('screen').width / 2 - 16,
  },
  discount: {
    position: 'absolute',
    backgroundColor: '#c83800',
    right: 0,
    top: 0,
    padding: 6,
  },
  discountDate: {
    fontSize: 12,
    color: '#fff',
  },
  discountPercent: {
    paddingTop: 6,
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    width: '100%',
    padding: 8,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 10,
    color: '#fff',
  },
  price: {
    fontWeight: 'bold',
    fontSize: 10,
    color: '#ffee3f',
  },
  pricesContainer: {
    paddingTop: 4,
    flexDirection: 'row',
  },
  oldPrice: {
    paddingTop: 1,
    paddingLeft: 12,
    fontWeight: 'bold',
    fontSize: 9,
    color: '#ccc',
    textDecorationLine: 'line-through',
  },
});

export default Offer;
