import { useState,useEffect } from "react"
import {Form,Button,Col} from 'react-bootstrap';
import FormContainer from "../components/FormContainer"
import CheckoutSteps from "../components/CheckoutSteps"
import { useNavigate } from "react-router-dom";
import { useDispatch,useSelector } from "react-redux";
import { savePaymentMethod } from "../slices/cartSlice";

const PaymentScreen = () => {
    const [paymentMethod, setPaymentMethod] = useState('PayPal');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const cart = useSelector((state)=> state.cart);
    const {shippingAddress} = cart;

    useEffect(()=>{
        if(!shippingAddress?.address || !shippingAddress?.country){
            navigate("/shipping");
        }
    },[shippingAddress,navigate])

    const submitHandler = (e)=>{
        e.preventDefault();
        dispatch(savePaymentMethod(paymentMethod));
        navigate("/placeorder");
    }

  return (
    <FormContainer>
        <CheckoutSteps step1 step2 step3/>
        <h1>Payment Method</h1>
        <Form onSubmit={submitHandler}>
            <Form.Group>
                <Form.Label as="legend">Select Method</Form.Label>
                <Col>
                    <Form.Check type='radio' className="my-2" label='PayPal or Credit Card' id="PyaPal" name="paymentMethod" value="PayPal" checked onChange={(e)=>setPaymentMethod(e.target.value)}></Form.Check>
                    <Button type="submit" variant="primary">Continue</Button>
                </Col>
            </Form.Group>
        </Form>
    </FormContainer>
  )
}

export default PaymentScreen