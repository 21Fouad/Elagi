import React from 'react';
import ReactStars from "react-rating-stars-component";
import PropTypes from 'prop-types';

export const StarRating = ({ rating, setRating }) => {
    return (
        <ReactStars
            count={5}
            onChange={setRating}
            size={24}
            activeColor="#ffd700"
            value={rating}
        />
    );
};

StarRating.propTypes = {
    rating: PropTypes.number.isRequired,
    setRating: PropTypes.func.isRequired
};
