import {Link , useParams} from 'react-router-dom'
import {Row , Col , ListGroup , Image , Card , Button} from 'react-bootstrap'
import {toast} from 'react-toastify'
import {useEffect} from 'react'
import { useSelector} from 'react-redux'
import {PayPalButtons ,usePayPalScriptReducer } from '@paypal/react-paypal-js'
import Message from '../components/message'
import Loader from '../components/loader'
import { useGetOrderDetailsQuery , usePayOrderMutation , useGetPaypalClientIdQuery , useDeliveryOrderMutation } from '../slices/orderApiSlice'

import React from 'react'

const OrderScreen = () => {
    const {id :orderId } = useParams();

    const {data : order , refetch ,isLoading , error} = useGetOrderDetailsQuery(orderId);
    const [payOrder , {isLoading : LoadingPay }] = usePayOrderMutation();
    const [deliveryOrder , {isLoading: LoadingDelivery}] = useDeliveryOrderMutation();
    const {data : paypal , isLoading: LoadingPaypal , error: errorPaypal} = useGetPaypalClientIdQuery();
    const [{isPending}, paypalDispatch ] = usePayPalScriptReducer();

    const {userInfo} = useSelector(state => state.auth);


    useEffect(() => {
        if(!errorPaypal && !LoadingPaypal && paypal.clientId){
            const loadPayPalScript = async () => {
                paypalDispatch({
                    type: 'resetOptions',
                    value: {
                        'client-id': paypal.clientId,
                        currency: 'USD'
                    }
                });
                paypalDispatch({type: 'setLoadingStatus', value: 'pending'});
            };
            if(order && !order.isPaid){
                if(!window.paypal){
                    loadPayPalScript();
                }else{
                    paypalDispatch({type: 'resetOptions', value: {}})
                }
            }
        }
    },[order , paypal , paypalDispatch , errorPaypal , LoadingPaypal]);


    function createOrder(data, actions){
        return actions.order.create({
            purchase_units:[
                {
                    amount:{
                        value: order.totalPrice
                    }
                }
            ]
        }).then((orderId)=>{
            return orderId;
        });
    };
    function onApprove(data , actions){
        return actions.order.capture().then( async function(details){
            try {
                await payOrder({orderId , details});
                refetch();
                toast.success('Successfully Paid');
            } catch (error) {
                toast.error(error?.data?.message || error.message);
            }
        });
    };
    function onError(err){
        toast.error(err.message);
    };

    const DeliverOrderHandler = async () => {
        try {
            await deliveryOrder(orderId);
            refetch();
            toast.success('Order Delivered');
        } catch (error) {
            toast.error(error?.data?.message || error.message);
        }
    }

  return isLoading ? <Loader/> : error ? <Message variant='danger'>{error}</Message> : (
    <>
     <h1>Order {order._id}</h1>
     <Row>
        <Col md={8}>
            <ListGroup variant='flush'>
                <ListGroup.Item>
                    <h2>Shipping</h2>
                    <p>
                        <strong>Name:</strong> {order.user.name}
                    </p>
                    <p>
                        <strong>Email:</strong> {order.user.email}
                    </p>
                    <p>
                        <strong>Address:</strong>
                        {order.shippingAddress.address} , {order.shippingAddress.city} , {order.shippingAddress.postalCode} , {order.shippingAddress.country}
                    </p>
                    {
                        order.isDelivered ? (
                            <Message variant='success'>Delivered on {order.deliveredAt}</Message>
                        ):(
                            <Message variant='danger'>Not Delivered</Message>
                        )
                    }
                </ListGroup.Item>
                <ListGroup.Item>
                    <h2>Payment Method</h2>
                    <p>
                        <strong>Method:</strong>
                        {order.paymentMethod}
                    </p>
                    {
                        order.isPaid ? (
                            <Message variant='success'>Paid on {order.paidAt}</Message>
                        ):(
                            <Message variant='danger'>Not Paid</Message>
                        )
                    }
                </ListGroup.Item>
                <ListGroup.Item>
                    <h2>Order Items</h2>
                    {order.orderItems.map((item , index )=>(
                        <ListGroup.Item key={index}>
                            <Row>
                                <Col md={1}>
                                    <Image src={item.image} alt={item.name} fluid rounded/>
                                </Col>
                                <Col>
                                    <Link to={`/product/${item.product}`}>{item.name}</Link>
                                </Col>
                                <Col md={4}>
                                    {item.qty} x ${item.price} = ${(item.qty * item.price).toFixed(2)}
                                </Col>
                            </Row>
                        </ListGroup.Item>
                    ))}
                </ListGroup.Item>
            </ListGroup>
        </Col>
        <Col md={4}>
            <Card>
                <ListGroup variant='flush'>
                    <ListGroup.Item>
                        <h2>Order Summary</h2>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <Row>
                            <Col>Items</Col>
                            <Col>${order.itemsPrice}</Col>
                        </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <Row>
                            <Col>Shipping</Col>
                            <Col>${order.shippingPrice}</Col>
                        </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <Row>
                            <Col>Tax</Col>
                            <Col>${order.taxPrice}</Col>
                        </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <Row>
                            <Col>Total</Col>
                            <Col>${order.totalPrice}</Col>
                        </Row>
                    </ListGroup.Item>
                    {
                        !order.isPaid && (
                            <ListGroup.Item>
                                {LoadingPay && <Loader/>}
                                {isPending ? <Loader/>:(
                                    <div>
                                        <div>
                                            <PayPalButtons
                                               createOrder={createOrder}
                                               onApprove={onApprove}
                                               onError={onError}
                                            ></PayPalButtons>
                                        </div>
                                    </div>
                                )}
                            </ListGroup.Item>
                         )}
                    {LoadingDelivery && <Loader/>}

                    {userInfo && userInfo.admin && order.isPaid && !order.isDelivered && (
                        <ListGroup.Item>
                            <Button type='Button' className='btn btn-block' onClick={DeliverOrderHandler} >
                                Mark as Delivered
                            </Button>
                        </ListGroup.Item>    
                    )}
                </ListGroup>
            </Card>
        </Col>
     </Row>
    </>
  );
}

export default OrderScreen
