import React from 'react'
import{Link,useParams} from "react-router-dom";
import {Row, Col, ListGroup,Image,Form,Button,Card} from "react-bootstrap";
import Loader from '../components/Loader';
import Message from "../components/Message";
import { useGetOrderDetailsQuery } from '../slices/orderApiSlices';

const OrderScreen = () => {
    const{id: orderId} = useParams();
    
    const {data:order,refetch,isLoading,error} = useGetOrderDetailsQuery(orderId);
    console.log(order);
    
  return isLoading ? <Loader/> : error ? <Message variant="danger"/> : (
  <>
  <h1>Order {order._id}</h1>
  <Row>
    <Col md={8}>col</Col>
    <Col md={4}>col</Col>
  </Row>
  </>
  )
    
}

export default OrderScreen