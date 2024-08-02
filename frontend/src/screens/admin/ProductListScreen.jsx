import {LinkContainer} from "react-router-bootstrap";
import {Table,Button,Row,Col} from "react-bootstrap";
import{FaEdit,FaTrash} from 'react-icons/fa';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { useGetProductsQuery,useCreateProductMutation,useDeleteProductMutation } from "../../slices/productsApiSlice"; 
import {toast} from 'react-toastify';

const ProductListScreen = () => {
    const {data:products,isLoading,error,refetch}=useGetProductsQuery();
    const [createProduct,{isLoading:loadingCreateProduct}] = useCreateProductMutation();
    const [deleteProduct,{isLoading:loadingDeleteProduct}] = useDeleteProductMutation();
    const deleteHandler = async(id)=>{
        if(window.confirm("Are you sure?")){
            try{
                await deleteProduct(id);
                refetch();
            }catch(err){
                toast.error(err?.data?.messaage || err?.error);
            }
        }
        
    }
    const createProductHandler = async()=>{
        console.log("In create Product");
        if(window.confirm('Are you sure you want to create new product')){
            try{
                await createProduct();
                refetch();
            }
            catch(err){
                toast.error(err?.data?.messaage || err?.error);
            }
        }
    }
  return (
    <>
    <Row className="align-items-center">
        <Col>
        <h1>Products</h1>
        </Col>
        <Col className="text-end">
        <Button className="btn-sm my-3" onClick={createProductHandler}>
            <FaEdit/> Create Product
        </Button>
        </Col>
    </Row>
    {loadingCreateProduct && <Loader/>}
    {loadingDeleteProduct && <Loader/>}
    {isLoading ? <Loader/> : error ? <Message variant='danger'>{error.data.message}</Message>:(
        <>
            <Table striped hover responsive className="table-sm">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>NAME</th>
                        <th>PRICE</th>
                        <th>CATEGORY</th>
                        <th>BRAND</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product)=>(
                        <tr key={product._id}>
                            <td>{product._id}</td>
                            <td>{product.name}</td>
                            <td>{product.price}</td>
                            <td>{product.category}</td>
                            <td>
                                <LinkContainer to={`/admin/product/${product._id}/edit`}>
                                    <Button variant="light" className="btn-sm max-2" >
                                        <FaEdit />
                                    </Button>
                                </LinkContainer>
                                <Button variant="danger" className="btn-sm" onClick={()=>deleteHandler(product._id)}><FaTrash style={{color:'white'}}/></Button>
                            </td>
                        </tr>
                    ))}       
                </tbody>
            </Table>
        </>
    )}
    </>
  )
}

export default ProductListScreen;