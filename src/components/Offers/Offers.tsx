import axios from 'axios';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {APP_URL} from '../../../App';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import Offer from './Offer';
import PriceRangeFilter from './PriceRangeFilter/PriceRangeFilter';
import {debounce} from 'lodash';
import RNPickerSelect from 'react-native-picker-select';

export interface OfferProps {
  id: number;
  price: string;
  currency: string;
  name: string;
  prize_amount: number;
  desc: string;
  url_desktop: string;
  url_mobile: string;
  discount: {
    discount_id: number;
    percent: number;
    end_date: string;
    new_price: number;
  };
  tags: Array<any>;
}

const PointsCoefficient = 100;
const Offers = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [offers, setOffers] = useState<Array<OfferProps>>([]);
  const [search, setSearch] = useState<string>('');
  const [filterOption, setFilterOption] = useState<string>('GEL');
  const [filteredOffers, setFilteredOffers] = useState<Array<OfferProps>>([]);
  const [sort, setSort] = useState<string>('PRICE_DESC');
  const [price, setPrice] = useState<any>({
    low: 0,
    high: 1000,
  });
  const sortRef = useRef<RNPickerSelect>(null);

  const loadOffers = () => {
    axios
      .get(
        `${APP_URL}/?app=market/api&resource=getList&currency=${filterOption}`,
      )
      .then(response => {
        const res = response.data?.data;
        let data = [];

        if (filterOption === 'GEL') {
          data = res.sort(
            (
              a: {discount: {new_price: number}},
              b: {discount: {new_price: number}},
            ) => b.discount.new_price - a.discount.new_price,
          );
        } else {
          data = res.sort(
            (a: {price: number}, b: {price: number}) => b.price - a.price,
          );

          data = data.map((item: OfferProps) => ({
            ...item,
            discount: {
              ...item.discount,
              new_price: parseFloat(item.price),
            },
          }));
        }

        setFilteredOffers(data);
        setOffers(data);
      })
      .catch(e => console.log(e))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadOffers();
  }, [filterOption]);

  const filter = useCallback(
    debounce((value: string) => {
      const filteredItems =
        value?.trim()?.length > 0
          ? offers.filter(item =>
              item.name.toLowerCase().includes(value.toLowerCase()),
            )
          : offers;

      const newFilteredOffers = filteredItems.filter(
        item =>
          item.discount.new_price >= price.low &&
          item.discount.new_price <= price.high,
      );

      
      setFilteredOffers(sortBy({data: newFilteredOffers, sort: sort}));
    }, 100),
    [offers, price, sort],
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handlePriceChange = useCallback(
    debounce((newLow: number, newHigh: number) => {
      const h = filterOption === 'GEL' ? newHigh : newHigh * PointsCoefficient;
      const l = filterOption === 'GEL' ? newLow : newLow * PointsCoefficient;
      setPrice({
        low: l,
        high: h,
      });

      const newFilteredOffers = offers.filter(
        item => item.discount.new_price >= l && item.discount.new_price <= h,
      );

      const filteredItems =
        search?.trim()?.length > 0
          ? newFilteredOffers.filter(item =>
              item.name.toLowerCase().includes(search.toLowerCase()),
            )
          : newFilteredOffers;

      setFilteredOffers(sortBy({data: filteredItems, sort: sort}));
    }, 100),
    [offers, search, sort],
  );

  const handleTypeChange = () => {
    setSearch('');
    if (filterOption === 'GEL') {
      setFilterOption('POINTS');
    } else {
      setFilterOption('GEL');
    }
  };

  const sortBy = ({data, sort}: {data: Array<OfferProps>; sort: string}) => {
    if (sort === 'PRICE_ASC') {
      return [...data].sort(
        (a, b) => a.discount.new_price - b.discount.new_price,
      );
    } else if (sort === 'PRICE_DESC') {
      return [...data].sort(
        (a, b) => b.discount.new_price - a.discount.new_price,
      );
    } else if (sort === 'NAME_ASC') {
      return [...data].sort((a, b) =>
        a.name.localeCompare(b.name, undefined, {sensitivity: 'base'}),
      );
    } else if (sort === 'NAME_DESC') {
      return [...data].sort((a, b) =>
        b.name.localeCompare(a.name, undefined, {sensitivity: 'base'}),
      );
    }

    return data;
  };

  const rangeSlider = useMemo(() => {
    return (
      <PriceRangeFilter
        pointsCoefficient={PointsCoefficient}
        filterOption={filterOption}
        handlePriceChange={handlePriceChange}
        from={0}
        to={1000}
      />
    );
  }, [filterOption, handlePriceChange]);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" style={[styles.loader]} />
      ) : (
        <>
          <TextInput
            placeholder={'Search'}
            value={search}
            onChangeText={value => {
              setSearch(value);
              filter(value);
            }}
            style={styles.search}
          />
          <View style={styles.priceRange}>{rangeSlider}</View>
          <View style={styles.filterTypeSwitcherContainer}>
            <Text>ქულა</Text>
            <Switch
              style={styles.filterTypeSwitcher}
              onValueChange={handleTypeChange}
              value={filterOption === 'GEL'}
            />
            <Text>ლარი</Text>
          </View>

          <View style={styles.sort}>
            <Text onPress={() => sortRef?.current?.togglePicker()}>
              სორტირება
            </Text>
            <RNPickerSelect
              ref={sortRef}
              onValueChange={value => {
                setSort(value);
                setFilteredOffers(sortBy({data: filteredOffers, sort: value}));
              }}
              items={[
                {label: 'ფასის კლებადობით', key: 0, value: 'PRICE_DESC'},
                {label: 'ფასის ზრდადობით', key: 1, value: 'PRICE_ASC'},
                {label: 'A-Z ანბანი', key: 2, value: 'NAME_ASC'},
                {label: 'Z-A ანბანი', key: 3, value: 'NAME_DESC'},
              ]}
            />
          </View>

          <FlatList
            data={filteredOffers}
            numColumns={2}
            initialNumToRender={12}
            windowSize={12}
            maxToRenderPerBatch={12}
            removeClippedSubviews={true}
            renderItem={({item}) => (
              <Offer filterOption={filterOption} offer={item} />
            )}
            keyExtractor={item => item.id.toString()}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: Dimensions.get('screen').height,
    justifyContent: 'center',
    paddingBottom: 60,
  },
  loader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  search: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(183,182,182,0.7)',
    margin: 8,
    borderRadius: 8,
    padding: 8,
    width: '95%',
  },
  priceRange: {
    marginBottom: 12,
    width: '95%',
    marginLeft: 8,
  },
  filterTypeSwitcherContainer: {
    marginLeft: 8,
    flexDirection: 'row',
  },
  filterTypeSwitcher: {
    marginTop: -4,
    marginLeft: 8,
    marginRight: 8,
  },
  sort: {
    marginLeft: 8,
  },
});

export default Offers;
