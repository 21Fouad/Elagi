import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useLocation } from 'react-router-dom'; // Import if you're using react-router-dom

const PaymentResultPage = () => {
    const [paymentStatus, setPaymentStatus] = useState('pending');
    // If you're using react-router-dom and passing data through URL
    const { paymentId } = useParams(); // Assuming you have a route like "/payment-result/:paymentId"
    const location = useLocation();

    useEffect(() => {
        const checkPaymentStatus = async () => {
            try {
                // Adjust the URL to your actual endpoint that checks the payment status
                // This endpoint should communicate with Paymob to verify the payment status or check your database
                // It could use a payment ID or session information to identify the payment
                const response = await axios.get(`https://9556-41-46-157-177.ngrok-free.app/api/check-payment-status/${paymentId}`, {
                    // Include headers as necessary, e.g., for authentication
                });
                console.log(response);
                setPaymentStatus(response.data.status); // Assuming your endpoint returns { status: 'success' | 'failed' | 'error' }
            } catch (error) {
                console.error('Failed to check payment status:', error);
                setPaymentStatus('error'); // Handle error state
            }
        };

        checkPaymentStatus();
    }, [paymentId, location]);

    return (
        <div>
            {paymentStatus === 'pending' && <p>Checking payment status...</p>}
            {paymentStatus === 'success' && <p>Payment successful! Thank you for your purchase.</p>}
            {paymentStatus === 'failed' && <p>Payment failed. Please try again or contact support.</p>}
            {paymentStatus === 'error' && <p>Unable to check payment status. Please contact support.</p>}
        </div>
    );
};

export default PaymentResultPage;
