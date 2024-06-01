import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactStars from 'react-rating-stars-component';

const FeedbackForm = () => {
    const [name, setName] = useState(' '); 
    const [email, setEmail] = useState(''); 
    const [feedback, setFeedback] = useState('');
    const [rating, setRating] = useState(0);
    const [showThankYou, setShowThankYou] = useState(false);
    const token = localStorage.getItem('userToken');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const { data } = await axios.get('http://localhost:8000/api/user', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setName(data.name);
                setEmail(data.email);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        fetchUserData();
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8000/api/feedback', {
                name,
                email,
                feedback,
                rating,
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });
        } catch (error) {
            console.error('Error submitting feedback:', error);
        }
        setShowThankYou(true);
        setTimeout(() => {
            setShowThankYou(false);
        }, 5000);
    };
    

    return (
        <>
            {showThankYou && (
                <>
                    <div className="overlay"></div>
                    <div className="thank-you-card position-fixed top-50 start-50 translate-middle">
                        <div className="card text-center">
                            <div className="card-body">
                                <p className="card-text">Thank you for your Feedback ❤️</p>
                            </div>
                        </div>
                    </div>
                </>
            )}


            <div className="container my-5">
                <div className="row justify-content-center">
                <div className="col-md-6">
                    <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="userName" className="form-label">Name</label>
                        <div className='input-group'>
                            <span className="input-group-text" id="basic-addon1"><i className="fas fa-user"></i></span>
                            <input type="text" id="userName" className="form-control" value={name} readOnly />
                        </div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="userEmail" className="form-label">Email</label>
                        <div className='input-group'>
                            <span className="input-group-text" id="basic-addon2"><i className="fas fa-envelope"></i></span>
                            <input type="email" id="userEmail" className="form-control" value={email} readOnly />
                        </div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="userFeedback" className="form-label">Feedback</label>
                        <textarea id="userFeedback" className="form-control" rows="3" value={feedback} onChange={e => setFeedback(e.target.value)} required></textarea>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Rating</label>
                        <ReactStars count={5} onChange={setRating} size={24} activeColor="#ffd700" value={rating} />
                    </div>
                    <button type="submit" className="btn btn-primary">Submit Feedback</button>
                    </form>
                </div>
                </div>
            </div>
        </>
    );
};

export default FeedbackForm;
