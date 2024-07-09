import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchReviews } from '../redux/actions/reviewsActions';
import SubmitPage from "./SubmitReviewScreen";
import i from '../utils/i18n_local';
import { useNavigation } from '@react-navigation/native';

const ReviewsScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { reviews, loading, error } = useSelector(state => state.reviews);

  React.useEffect(() => {
    dispatch(fetchReviews());
  }, [dispatch]);

  const renderReviewItem = ({ item }) => (
    <View style={styles.reviewItem}>
      <Text style={styles.reviewAuthor}>{item.name}</Text>
      <Text style={styles.reviewMessage}>{item.message}</Text>
      <Text style={styles.reviewDate}>{new Date(item.timestamp * 1000).toLocaleDateString()}</Text>
    </View>
  );

  if (loading) {
    return <View style={styles.centerContainer}><Text>Loading...</Text></View>;
  }

  if (error) {
    return <View style={styles.centerContainer}><Text>Error: {error}</Text></View>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={reviews}
        keyExtractor={(item) => item.post_id.toString()}
        renderItem={renderReviewItem}
        ListEmptyComponent={<Text style={styles.emptyList}>{i.t('No reviews yet')}</Text>}
      />
      <TouchableOpacity 
        style={styles.addButton} 
        onPress={() => navigation.navigate('SubmitReviewScreen', {
          onReviewSubmitted: () => dispatch(fetchReviews())
        })}
      >
        <Text style={styles.addButtonText}>{i.t('Add Review')}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reviewItem: {
    backgroundColor: '#f9f9f9',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  reviewAuthor: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  reviewMessage: {
    marginTop: 5,
  },
  reviewDate: {
    marginTop: 5,
    color: '#888',
    fontSize: 12,
  },
  emptyList: {
    textAlign: 'center',
    marginTop: 20,
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ReviewsScreen;