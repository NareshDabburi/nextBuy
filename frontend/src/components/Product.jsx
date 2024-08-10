import React from 'react'
import { Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Rating from './Rating'
const Product = ({product}) => {
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
            <div className='rounded pb-2'>
                 <Link to ={`/product/${product._id}`}>
                    <img className='rounded-sm  w-full h-48 object-cover' src={product.image} alt={product.name}></img>
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