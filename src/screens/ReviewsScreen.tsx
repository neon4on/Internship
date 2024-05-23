import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { fetchReviews, fetchReviewsSuccess, fetchReviewsFailure } from '../redux/actions/reviewsActions';
import AxiosInstance from '../services/api';

const ReviewsScreen = () => {
  const dispatch = useDispatch();
  const { reviews, loading, error } = useSelector((state) => state.reviews);

  useEffect(() => {
    const fetchData = async () => {
      dispatch(fetchReviews());
      try {
        const response = await AxiosInstance.get('/discussion_messages');
        dispatch(fetchReviewsSuccess(response.data.data));
      } catch (error) {
        dispatch(fetchReviewsFailure(error.message));
      }
    };

    fetchData();
  }, [dispatch]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {reviews.map((review) => (
        <View key={review.post_id} style={styles.reviewItem}>
          <Text style={styles.reviewText}>{review.message}</Text>
        </View>
      ))}
      <TouchableOpacity style={styles.submitButton} onPress={() => {}}>
        <Text style={styles.submitButtonText}>Submit Review</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
    },
    reviewItem: {
      marginBottom: 16,
    },
    reviewAuthor: {
      fontWeight: 'bold',
      fontSize: 16,
    },
    reviewText: {
      fontSize: 14,
    },
    submitButton: {
      backgroundColor: 'blue',
      padding: 16,
      borderRadius: 8,
      marginTop: 16,
    },
    submitButtonText: {
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
    },
});

export default ReviewsScreen; 