import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {TouchableOpacity, Alert} from 'react-native';

import {Container, CategoriesContainer, RestaurantsContainer} from './style';

import Header from '../../components/Header';
import Loading from '../../components/Loading';

import {getCategories} from '../../services/api_categories';
import {getRestaurants} from '../../services/api_restaurants';

import {
  setCategories,
  setRestaurants,
  handleLoading,
  setUser,
} from '../../store/actions/home';

import Category from './Category';
import Restaurant from './Restaurant';

const Home = ({navigation}) => {
  const dispatch = useDispatch();
  const categories = useSelector(state => state.home.categories);
  const restaurants = useSelector(state => state.home.restaurants);
  const isLoading = useSelector(state => state.home.isLoading);
  const user = useSelector(state => state.home.user);

  const handleRestaurantClick = () => {
    if (user.name) {
      Alert.alert('', `Você ja esta logado ${user.name}`, [
        {text: 'Ok'},
        {
          text: 'Sair',
          onPress: () => {
            dispatch(setUser({}));
            navigation.push('Login');
          },
        },
      ]);
    } else {
      navigation.push('Login');
    }
  };

  useEffect(() => {
    dispatch(handleLoading(true));
    Promise.all([getCategories(), getRestaurants()])
      .then(([categoriesData, restaurantsData]) => {
        dispatch(setCategories(categoriesData));
        dispatch(setRestaurants(restaurantsData));
        dispatch(handleLoading(false));
      });
  }, [dispatch]);

  return (
    <Container>
      <Loading isLoading={isLoading} />
      <Header />
      <CategoriesContainer horizontal showsHorizontalScrollIndicator={false}>
        {categories.map(category => (
          <Category
            name={category.name}
            image={category.image}
            key={category.name}
          />
        ))}
      </CategoriesContainer>
      <RestaurantsContainer>
        {restaurants.map(restaurant => (
          <TouchableOpacity
            onPress={handleRestaurantClick}
            key={restaurant.name}
          >
            <Restaurant
              name={restaurant.name}
              image={restaurant.image}
              comment={restaurant.comment}
              type={restaurant.type}
              distance={restaurant.distance}
              neigborhood={restaurant.neigborhood}
              price={restaurant.price}
              rating={restaurant.rating}
            />
          </TouchableOpacity>
        ))}
      </RestaurantsContainer>
    </Container>
  );
};

export default Home;
