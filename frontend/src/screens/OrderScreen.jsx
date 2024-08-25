import React from 'react'
import{Link,useParams} from "react-router-dom";
import {Row, Col, ListGroup,Image,Button,Card, ListGroupItem} from "react-bootstrap";
import Loader from '../components/Loader';
import Message from "../components/Message";
import {toast} from 'react-toastify';
import {PayPalButtons,usePayPalScriptReducer} from '@paypal/react-paypal-js';
import { useGetPayPalClientIdQuery,usePayOrderMutation,useGetOrderDetailsQuery,useDeliverOrderMutation } from '../slices/orderApiSlices';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';

const OrderScreen = () => {
    const{id: orderId} = useParams();
    
    const {data:order,refetch,isLoading,error} = useGetOrderDetailsQuery(orderId);

    const [payOrder,{isLoading:loadingPay}] = usePayOrderMutation();

    const [{isPending},paypalDispatch] = usePayPalScriptReducer();

    const {data:paypal,isLoading : loadingPayPal, error:errorPayPal} = useGetPayPalClientIdQuery();

    const [deliverOrder,{isLoading:loadingDeliver}] = useDeliverOrderMutation();

   const {userInfo} = useSelector((state)=>state.auth)

    useEffect(()=>{
      if(!errorPayPal && !loadingPayPal && paypal.clientId){
        const loadPayPalScript = async()=>{
          paypalDispatch({
            type:'resetOption',
            value:{
              'client-id':paypal.clientId,
              currency:'USD'
            }
          });
          paypalDispatch({type:'setLoadingStatus',value:'pending'});
        }
        if(order && !order.isPaid){
          if(!window.paypal){
            loadPayPalScript();
          }
        }
      }
    },[order,paypal,paypalDispatch,loadingPayPal,errorPayPal])

    const onApproveTest = async ()=>{
        await payOrder({orderId,details:{payer:{}}});
        refetch();
        toast.success("Payment successfull");
    }

    function onApprove(data,actions){
      return actions.order.capture().then(async function(details){
        try{
          await payOrder({orderId,details}).unwrap();
          refetch();
          toast.success("Payment successfull");
        }
        catch(error){
          toast.error(error?.data?.message || error.message )
        }
      })
    }
    function createOrder(data,actions){
      return actions.order.create({
        purchase_units:[
          {
            amount:{
              value:order.totalPrice
            }
          }
        ]
      }).then ((orderId)=>{return orderId});
    }

    function onError(err){
      toast.error(err.message);
      
    }

    const deliverOrderHandler = async()=>{
      try{
        const response = await deliverOrder(orderId);
        console.log(response);
        if(response.error){
          toast.error(response.error?.data?.message || response.error?.message )
          return;
        }
        refetch();
        toast.success("Order delivered");
      }
      catch(error){
        toast.error(error?.data?.message || error.message )
      }

    }
    
  return isLoading ? <Loader/> : error ? <Message variant="danger">{error?.data?.message}</Message> : (
  <>
  <div className="theme-heading theme-text-dark-green mt-2" >Order {order._id}</div>
  <Row >
    <Col md={8}>
      <ListGroup variant='flush'>
        <ListGroup.Item className='theme-text-grey'>
          <h2 className='font-bold text-xl'>Shipping</h2>
          <p >
            <strong>Name:</strong>{order.user.name}
          </p>
          <p>
            <strong>Email:</strong>{order.user.email}
          </p>
          <p>
            <strong>Address:</strong>
            {order.shippingAddress.address}, {' '}
            {order.shippingAddress.city},{' '}
            {order.shippingAddress.postalCode},{' '}
            {order.shippingAddress.country}
          </p>
          <p>
            {order.isDelivered ? (
              <Message variant='success'>Delivered on {order.deliveredAt}</Message>
            ):(<Message variant='danger'>Not Delivered</Message>)}
          </p>
        </ListGroup.Item>
        <ListGroup.Item className='theme-text-grey'>
          <h2 className='font-bold text-xl'>Payment Method</h2>
          <p>
            <strong>Method:</strong>
            {order.paymentMethod}
          </p>
          <p>
            {order.isPaid ? (
              <Message variant='success'>Paid  on {order.paidAt}</Message>
            ):(<Message variant='danger'>Not Paid</Message>)}
          </p>
        </ListGroup.Item>
        <ListGroup.Item className='theme-text-grey'>
            <h2 className='font-bold text-xl'>Order Item</h2>
            {order.orderItems.map((item,index)=>(
              <ListGroup.Item key={index}>
                <Row className='theme-text-grey'>
                  <Col md={1}>
                  <Image src={item.image} alt={item.name} fluid rounded/>
                  </Col>
                  <Col>
                  <Link to={`/product/${item.product}`}>{item.name}</Link>
                  </Col>
                  <Col md={4}>
                  {item.qty} x ${item.price} = ${item.qty} * ${item.price}
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup.Item>
      </ListGroup>
    </Col>
    <Col md={4}>
    <Card>
      <ListGroup>
        <ListGroup.Item className='theme-text-grey'>
          <h2>Order Summary</h2>
        </ListGroup.Item>
        <ListGroup.Item className='theme-text-grey'>
          <Row>
            <Col>Items</Col>
            <Col>${order.itemsPrice}</Col>
          </Row>
          <Row>
            <Col>Shipping</Col>
            <Col>${order.shippingPrice}</Col>
          </Row>
          <Row>
            <Col>Tax</Col>
            <Col>${order.taxPrice}</Col>
          </Row>
          <Row>
            <Col>Total</Col>
            <Col>${order.totalPrice}</Col>
          </Row>
        </ListGroup.Item>
        {!order.isPaid &&(
          <ListGroup.Item>
            {loadingPay && <Loader/>}
            {isPending ? <Loader/> : (
              <div>
                <Button className='theme-btn' onClick={onApproveTest} style={{marginBottom:'10px'}}>Test Pay Button</Button>
                <div>
                  <PayPalButtons createOrder={createOrder} onApprove={onApprove} onError={onError}></PayPalButtons>
                </div>
              </div>
            )}
          </ListGroup.Item>
        )}
        {loadingDeliver && <Loader/>}

        {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
          <ListGroupItem>
            <Button type='button' className='btn btn-block theme-btn' onClick={deliverOrderHandler}>Mark as Delivered</Button>
          </ListGroupItem>
        )}
      </ListGroup>
    </Card>
    </Col>
  </Row>
  </>
  )
    
}

export default OrderScreen