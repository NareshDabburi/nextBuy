import {useParams,Link,useNavigate} from 'react-router-dom'
import {Row, Col,Image,ListGroup,Card,Button,Form} from 'react-bootstrap'
import Rating from '../components/Rating';
import { useGetProductDetailsQuery } from '../slices/productsApiSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { useState } from 'react';
import {addToCart} from "../slices/cartSlice";
import { useDispatch } from 'react-redux';
function ProductScreen() {
    const {id:productId} = useParams();
    const [qty,setQty] = useState(1);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    

    const {data:product ,isLoading ,error} = useGetProductDetailsQuery(productId);

    const addToCartHandler = ()=>{
        dispatch(addToCart({...product,qty}))
        navigate("/cart");
    }

  return (
    <>
    <Link className='btn btn-light my-3' to='/'>Go Back</Link>
    
    {isLoading ? 
    (<Loader/>) : 
    error ? (<Message variant={'danger'}>{error.data?.message || error.message}</Message>) : 
    (
        <Row>
        <Col md={5}>
        <Image src={product.image} alt = {product.name} fluid></Image>
        </Col>
        <Col md={4}>
        <ListGroup variant='flush'>
            <ListGroup.Item>
                <h3>{product.name}</h3>
            <Rating value={product.rating} text = {`${product.numReviews} reviews` }/>
            </ListGroup.Item>
            <ListGroup.Item>
                Price:${product.price}
            </ListGroup.Item>
        </ListGroup>
        </Col>
        <Col md={3}>
        <Card>
            <ListGroup variant='flush'>
                <ListGroup.Item>
                    <Row>
                        <Col>Price:</Col>
                        <Col>
                        <strong>${product.price}</strong>
                        </Col>
                    </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                    <Row>
                        <Col>Status:</Col>
                        <Col>
                        <strong>{product.countInStock >0 ? "In Stock" : "Out of Stock"}
                        </strong>
                        </Col>
                    </Row>
                </ListGroup.Item>
                {product.countInStock > 0 && (
                    <ListGroup.Item>
                        <Row>
                            <Col>Qty</Col>
                            <Col>
                                <Form.Control as="select" value={qty} onChange={(e)=>setQty(Number(e.target.value))}>
                                    {[...Array(product.countInStock).keys() ].map((x)=>(
                                        <option key={x+1} value={x+1}>{x+1}

                                        </option>
                                    ))}
                                </Form.Control>
                            </Col>
                        </Row>
                    </ListGroup.Item>
                )}
                <ListGroup.Item>
                    <Button className='btn-block' type='button' 
                    disabled={product.countInStock ===0}
                    onClick = {addToCartHandler}
                    >
                        Add to Cart
                    </Button>
                    
                </ListGroup.Item>
            </ListGroup>
        </Card>
        </Col>
    </Row>
    ) }
    
    </>
  )
}

export default ProductScreen