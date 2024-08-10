import React from 'react'
import {Link,useNavigate} from "react-router-dom"
import {Row,Col,ListGroup,Image,Form,Button,Card} from "react-bootstrap"
import { FaTrash } from 'react-icons/fa'
import Message from "../components/Message"
import { useDispatch,useSelector } from 'react-redux'
import { addToCart,removeFromCart } from '../slices/cartSlice'

const CartScreen = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const cart  = useSelector((state)=> state.cart )
    const {cartItems} = cart;

    const addToCartHandler = async(product,qty)=>{
        dispatch(addToCart({...product,qty}))
    }

    const removeFromCartHandler = (id)=>{
        dispatch(removeFromCart(id))
    }

    const checkOutHandler = ()=>{
        navigate('/login?redirect=/shipping');
    }

  return (
    <Row>
        <Col md={8}>
            
            <div className="theme-heading theme-text-dark-green mb-20 ">Your Cart</div>
            {cartItems.length === 0 ? (
                <Message >
                    Your cart is Empty <Link className='underline theme-text-green ' to="/">Go Back</Link>
                </Message>
            ) : (
                <ListGroup variant='flush'>
                    {cartItems.map((item)=> (
                        <ListGroup.Item key={item._id}>
                            <Row>
                                <Col md={2}>
                                <Image  src={item.image} alt = {item.name} fluid rounded/>
                                </Col>
                                <Col md={3}>
                                <Link to = {`/product/${item._id}`} className='theme-text-grey'>{item.name}</Link>
                                </Col>
                                <Col md={2} className='theme-text-grey'>
                                ${item.price}
                                </Col>
                                <Col md={2}>
                                <Form.Control as="select" className='theme-text-grey' value={item.qty} onChange={(e)=>addToCartHandler(item,Number(e.target.value))}>
                                        {[...Array(item.countInStock).keys() ].map((x)=>(
                                            <option key={x+1} value={x+1}>{x+1}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Col>
                                <Col md={2}>
                                        <Button type='button' variant='light' onClick={()=> removeFromCartHandler(item._id)}>
                                            <FaTrash/>
                                        </Button>
                                </Col>
                            </Row>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            ) }
        </Col>
        <Col md={4}>
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

export default CartScreen