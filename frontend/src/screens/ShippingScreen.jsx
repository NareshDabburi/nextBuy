import React from 'react'
import { useState } from 'react';
import {Form,Button,Row,Col,ListGroup,Card} from 'react-bootstrap';
import FormContainer from '../components/FormContainer';
import { useDispatch,useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { saveShippingAddress } from '../slices/cartSlice';
import CheckoutSteps from '../components/CheckoutSteps';

const ShippingScreen = () => {
    const cart = useSelector((state)=>state.cart);
    const {shippingAddress,cartItems} = cart;

    const [address,setAddress] = useState(shippingAddress?.address||'');
    const [city,setCity] = useState(shippingAddress?.city||'');
    const [postalCode,setPostalCode] = useState(shippingAddress?.postalCode||'');
    const [country,setCountry] = useState(shippingAddress?.country||'');

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const checkOutHandler = (e)=>{
        e.preventDefault();
        dispatch(saveShippingAddress({address,city,postalCode,country}));
        //navigate("/payment");
        navigate("/placeorder");
    }
  return (
    <Row >
        <CheckoutSteps step1 step2 />
        <Col md={8}>
            <FormContainer>
                <div className="theme-heading theme-text-dark-green">Shipping Address</div>
                <Form className='theme-text-grey'>
                    <Form.Group controlId='address' className='my-2'>
                        <Form.Label>Address</Form.Label>
                        <Form.Control type="text" placeholder="Enter address"name="address" value = {address} onChange={(e)=>setAddress(e.target.value)}></Form.Control>
                    </Form.Group>
                    <Form.Group controlId='city' className='my-2'>
                        <Form.Label>City</Form.Label>
                        <Form.Control type="text" placeholder="Enter city"name="city" value = {city} onChange={(e)=>setCity(e.target.value)}></Form.Control>
                    </Form.Group>
                    <Form.Group controlId='postalCode' className='my-2'>
                        <Form.Label>Post Code</Form.Label>
                        <Form.Control type="text" placeholder="Enter postal code"name="postalCode" value = {postalCode} onChange={(e)=>setPostalCode(e.target.value)}></Form.Control>
                    </Form.Group>
                    <Form.Group controlId='country' className='my-2'>
                        <Form.Label>Country</Form.Label>
                        <Form.Control type="text" placeholder="Enter Country"name="country" value = {country} onChange={(e)=>setCountry(e.target.value)}></Form.Control>
                    </Form.Group>
                    
                </Form>
            </FormContainer>
        </Col> 
        <Col md={4} className='mt-4'>
            <Card>
                <ListGroup variant='flush'>
                    <ListGroup.Item>
                        <h2 className='theme-text-grey'>SubTotal({cartItems.reduce((acc,item)=>acc+item.qty,0)}) items</h2>
                        <div className='theme-text-grey'>${cartItems.reduce((acc,item)=>acc+ (item.qty * item.price),0).toFixed(2)}</div>

                    </ListGroup.Item>
                    <ListGroup.Item>
                        <Button type="button" className='theme-btn' disabled={cartItems.length === 0} onClick = {checkOutHandler}>
                            Procced to Checkout
                        </Button>
                    </ListGroup.Item>
                </ListGroup>
            </Card>
        </Col>
    </Row>
  )
}
export default ShippingScreen;