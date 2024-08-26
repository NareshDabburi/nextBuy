import { useState,useEffect } from "react"
import {Link,useNavigate,useParams} from "react-router-dom"
import {Form,Button} from "react-bootstrap"
import Message from "../../components/Message"
import Loader from "../../components/Loader"
import{toast} from "react-toastify"
import FormContainer from "../../components/FormContainer"
import {useUpdateProductMutation,useGetProductDetailsQuery,useUploadProductImageMutation} from "../../slices/productsApiSlice";

const ProductEditScreen = () => {
    const {id:productId} = useParams();
    const[name,setName] = useState("");
    const[price,setPrice] = useState(0);
    const[image,setImage] = useState("");
    const[images,setImages] = useState([]);
    const[brand,setBrand] = useState("");
    const[category,setCategory] = useState("");
    const[countInStock,setCountInStock] = useState(0);
    const[description,setDescription] = useState("");


    const{data:product,isLoading,error} = useGetProductDetailsQuery(productId);
    const[updateProduct,{isLoading:loadingUpdate}] = useUpdateProductMutation();
    const[uploadProductImage,{isLoading:loadingUpload}] = useUploadProductImageMutation();
    const navigate = useNavigate();
    useEffect(()=>{
        if(product){
            setName(product.name);
            setPrice(product.price);
            setImage(product.image);
            setImages(product.images || []);
            setBrand(product.brand);
            setCategory(product.category);
            setCountInStock(product.countInStock);
            setDescription(product.description);
        }
    },[product])

    const submitHandler = async(e)=>{
        e.preventDefault();
        const updatedProduct = {
            productId,
            name,
            price,
            images,
            image,
            brand,
            category,
            countInStock,
            description
        };
        const result = await updateProduct(updatedProduct);
        if(result.error){
            toast.error(result.error);
        }else{
            toast.success('Product updated');
            navigate('/admin/productlist');
        }
    }
    const uploadFileHandler = async (e)=>{
        e.preventDefault(); 
        const formData = new FormData();

        if (e.target.files.length === 0) {
            toast.error("No files selected.");
        return;
        }

        if (e.target.files.length >= 6) {
            toast.error("Please upload upto 5 images only");
            return;
        }
        
        //formData.append('image',e.target.files[0]);
        for (let i = 0; i < e.target.files.length; i++) {
            formData.append('images', e.target.files[i]);
        }
        
        try{
            const res = await uploadProductImage(formData).unwrap();
            console.log(res);
            toast.success(res.message);
            setImages(res.images);
            setImage(res.image);
        }catch(err){
            toast.error(err?.data?.message || err?.error);
        }
        
    }
  return (
    <>
    <Link to="/admin/productlist" className=" btn theme-btn my-3">
        Go Back
    </Link>
    <FormContainer>
        <div className="theme-heading theme-text-dark-green mb-2">Edit Product</div>
        {loadingUpdate && <Loader/>}
        {loadingUpload && <Loader/>}
        {isLoading ? <Loader/> : error ? <Message variant='danger'>{error.data.message}</Message> : (
            <Form onSubmit={submitHandler} className="theme-text-grey">
                <Form.Group controlId="name">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type='name' placeholder="Enter name" value={name} onChange={(e)=>setName(e.target.value)}></Form.Control>
                </Form.Group>
                <Form.Group controlId="price">
                    <Form.Label>Price</Form.Label>
                    <Form.Control type='number' placeholder="Enter price" value={price} onChange={(e)=>setPrice(e.target.value)}></Form.Control>
                </Form.Group>
                <Form.Group controlId="image">
                   <Form.Label>Upload Images (Upto 5)</Form.Label>
                  
                   <Form.Control type='file'multiple label="Choose file" onChange={uploadFileHandler}></Form.Control>
                   {images?.length > 0 && (
                                <div className="mt-2 flex">
                                    {images?.map((image, index) => (
                                        <img key={index} src={image} alt={`Uploaded preview ${index}`} style={{ width: '200px', height: '200px', marginRight: '10px' }} />
                                    ))}
                                </div>
                            )}
                </Form.Group>
                <Form.Group controlId="brand">
                    <Form.Label>Brand</Form.Label>
                    <Form.Control type='text' placeholder="Enter brand" value={brand} onChange={(e)=>setBrand(e.target.value)}></Form.Control>
                </Form.Group>
                <Form.Group controlId="category">
                    <Form.Label>Category</Form.Label>
                    <Form.Control type='text' placeholder="Enter category" value={category} onChange={(e)=>setCategory(e.target.value)}></Form.Control>
                </Form.Group>
                <Form.Group controlId="countInStock">
                    <Form.Label>Count In Stock</Form.Label>
                    <Form.Control type='number' placeholder="Enter count in stock" value={countInStock} onChange={(e)=>setCountInStock(e.target.value)}></Form.Control>
                </Form.Group>
                <Form.Group controlId="description">
                    <Form.Label>Description</Form.Label>
                    <Form.Control type='text' placeholder="Enter description" value={description} onChange={(e)=>setDescription(e.target.value)}></Form.Control>
                </Form.Group>
                <Button type='submit' className="theme-btn">Update</Button>
            </Form>
        )}
    </FormContainer>
    </>
  )
}

export default ProductEditScreen