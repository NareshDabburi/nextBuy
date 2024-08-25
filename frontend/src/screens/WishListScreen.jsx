import React,{useState} from 'react'
import { useDispatch,useSelector } from 'react-redux'
import {Link,useNavigate} from "react-router-dom"
import {addToCart} from "../slices/cartSlice";
import {removeFromWishlist} from "../slices/wishlistSlice";
import {toast} from "react-toastify";
import { RxCrossCircled } from "react-icons/rx";
import {Form} from 'react-bootstrap'

const WishListScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const wishlist  = useSelector((state)=> state.wishlist )
  const {wishlistItems} = wishlist;
  

  const addToCartHandler = (wishlist,qty)=>{
    
    if(wishlist.countInStock <= 0){
      toast.error("This item is out of stock");
    }else{
      const {_id,name,image,price,category,brand,description,countInStock} = wishlist;
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
      dispatch(addToCart({...addProduct,qty}))
      navigate('/cart');
    }
  }

  const removeFromWishlistHandler = (id)=>{
    dispatch(removeFromWishlist(id));
  }

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [displayProduct,setDisplayProduct] = useState({});
  const [qty,setQty] = useState(1);

  const toggleModal = (wishlist) => {
    setDisplayProduct(wishlist);
    setIsModalOpen(!isModalOpen);
  };
  return (
    <>
    <div className={isModalOpen ? 'blur-sm' : ''}>
        <div className="theme-text-dark-green flex pt-10 pb-sm pl-2">
          <p className='text-bold font-extrabold'>My Wishlist</p> &nbsp;
          <p > {wishlistItems?.length} items</p>
        </div>
        <div className='cards flex gap-2 flex-wrap'>
          { wishlistItems?.length > 0 && wishlistItems.map((wishlist)=> (
            <div className='w-72 p-2 rounded-lg shadow-lg theme-text-grey'>

              <div className='relative'>
                <Link to={`/product/${wishlist._id}`}>
                  <img className='h-48 w-full object-cover' src={wishlist.image} alt={wishlist.name} />
                </Link>
                <RxCrossCircled
                  className='top-1.5 right-1.5 h-5 w-5 absolute text-black bg-white rounded-full'
                  onClick={() => removeFromWishlistHandler(wishlist._id)}
                />
              </div>
              <Link to = {`/product/${wishlist._id}`}>
                <div className='h-10 overflow-ellipsis whitespace-nowrap overflow-hidden'>{wishlist.name}</div>
                <div className='font-bold'>${wishlist.price}</div>
              </Link>
              <hr/>
              <div className='flex'>
                <div className='mx-auto hover:cursor-pointer theme-text-green uppercase font-bold mt-1' onClick={(e)=>{toggleModal(wishlist)}}>Add To Cart</div>
              </div>
            </div>
          ))}
        </div>
    </div>
        {isModalOpen && displayProduct && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" >
            <div className="modal-content  bg-white p-6 rounded-lg w-80 max-w-full">
                    <div className='w-full pb-1 rounded-lg'>
                      <div className='h-full'>
                          <img  src={displayProduct.image} alt={displayProduct.name} />
                      </div>
                      <div className=' p-2 flex flex-direction: row'>
                        <div className='grow-0 h-10'>{displayProduct.name}</div>
                        <div className='font-bold pt-4'>${displayProduct.price}</div>
                      </div>
                    </div>
                    <RxCrossCircled
                        className='top-1.5 right-1.5 h-5 w-5 absolute text-black bg-white rounded-full'
                        onClick={toggleModal}
                      />
                    <hr/>
                    <div className='pt-2'>
                      
                      {displayProduct.countInStock >0 ? (<><div className='pb-2'>Choose Quantity</div><Form.Control  className='theme-text-grey' as="select" value={qty} onChange={(e)=>setQty(Number(e.target.value))}>
                          {[...Array(displayProduct.countInStock).keys() ].map((x)=>(
                              <option key={x+1} value={x+1}>{x+1}
                              </option>
                          ))}
                      </Form.Control>
                      <div className='hover:cursor-pointer pt-2 pb-2 border w-full text-center mt-4 theme-btn' onClick={(e)=>{addToCartHandler(displayProduct,qty)}}>Done</div>
                      </>)
                       : <div className='theme-text-grey theme-text-green uppercase font-bold'> Out of Stock</div>}
                    </div>
            </div>
          </div>
        )}
    
    </>

    

  )
}

export default WishListScreen;