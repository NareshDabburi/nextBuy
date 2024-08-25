import React from 'react'
import { Link,useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import Rating from './Rating'
import {FaRegHeart} from 'react-icons/fa';
import {addToWishist} from "../slices/wishlistSlice";

const Product = ({product}) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const addToWishList = (e)=>{
        e.preventDefault();
        const {_id,name,image,price,category,brand,description,countInStock} = product;
        const addProduct = {
            _id,
            name,
            image,
            price,
            category,
            brand,
            description,
            countInStock
        }
        dispatch(addToWishist({...addProduct}))
        navigate("/wishlist");
    }
  return (
    // <Card className='my-3 p-3 rounded'>
    //     <Link to ={`/product/${product._id}`}>
    //         <Card.Img src = {product.image} variant='top' style={{height: "200px"}}/>
    //     </Link>
    //     <Card.Body>
    //         <Link to = {`/product/${product._id}`}>
    //         <Card.Title as="div" className='product-title'>
    //             <strong>{product.name}</strong>
    //         </Card.Title>
    //         </Link>
    //         <Card.Text as='div'>
    //             <Rating value={product.rating} text = {`${product.numReviews}`} reviews/>
    //         </Card.Text>
    //         <Card.Text as="h3">
    //             ${product.price}
    //         </Card.Text>
    //     </Card.Body>
    // </Card>
    <>
        <div className='grid sm:grid-1 md:grid-2 lg:grid-3 p-3 rounded-md  shadow-2xl h-100 border-gray-50 border '>
            <div className='rounded pb-2 relative' >
                 <Link to ={`/product/${product._id}`}>
                    <img className='rounded-sm  w-full h-48 object-cover' src={product.image} alt={product.name} ></img>
                    <FaRegHeart className='top-1.5 right-1.5 p-1 w-6 h-6 absolute  theme-green text-white rounded-full theme-btn' onClick={addToWishList}/>
                </Link>
            </div>
             <div className='theme-text-grey underline font-bold pb-4 '>
                <Link to = {`/product/${product._id}`}>{product.name}</Link>
                
            </div>
            <div className=' theme-text-grey underline font-bold pb-1'>
                <Rating value={product.rating} text = {`${product.numReviews}`} reviews/>
               
            </div>
            <div className=' theme-text-grey underline font-bold'>
                ${product.price}
            </div>
        </div>
    </>
  )
}

export default Product