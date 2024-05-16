import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Spinner, Table, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function OrdersPage() {
    const { t, i18n } = useTranslation(); // Ensure you're using `i18n` from `useTranslation`
    const [orders, setOrders] = useState([]);
    const [displayedOrders, setDisplayedOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [ordersToShow, setOrdersToShow] = useState(10);

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            const token = localStorage.getItem('userToken');
            if (!token) {
                return;
            }
            try {
                const response = await axios.get('http://localhost:8000/api/orders', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const sortedOrders = response.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                setOrders(sortedOrders);
                setDisplayedOrders(sortedOrders.slice(0, ordersToShow));
            } catch (error) {
                console.error('Failed to fetch orders:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [ordersToShow]);

    const handleSeeMore = () => {
        setOrdersToShow(ordersToShow + 10);
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">{t('orders.loading')}</span>
                </Spinner>
            </div>
        );
    }

    return (
        <div>
            <h2 className='text-center my-3'>{t('orders.my_orders')}</h2>
            {displayedOrders.length > 0 ? (
                <Table responsive="sm" className="mt-3">
                    <thead>
                        <tr>
                            <th>{t('orders.order_id')}</th>
                            <th>{t('orders.medicine_name')}</th>
                            <th>{t('orders.quantity')}</th>
                            <th>{t('orders.price')}</th>
                            <th>{t('orders.payment_method')}</th>
                            <th>{t('orders.total')}</th>
                            <th>{t('orders.status')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayedOrders.map((order) =>
                            order.items.map((item, index) => (
                                <tr key={item.id}>
                                    {index === 0 && (
                                        <td rowSpan={order.items.length}>{order.id}</td>
                                    )}
                                    <td>{i18n.language === 'ar' && item.medicine_name_ar ? item.medicine_name_ar : item.medicine_name}</td>
                                    <td>{item.quantity}</td>
                                    <td>${item.price}</td>
                                    <td>{order.payment_method}</td>
                                    {index === 0 && (
                                        <>
                                            <td rowSpan={order.items.length}>${order.total_price}</td>
                                            <td rowSpan={order.items.length}><span className="badge bg-success">{t('orders.completed')}</span></td>
                                        </>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </Table>
            ) : (
                <p>{t('orders.no_orders')}</p>
            )}
            {orders.length > displayedOrders.length && (
                <div className="text-center my-3">
                    <Button onClick={handleSeeMore}>{t('orders.see_more')}</Button>
                </div>
            )}
        </div>
    );
}
