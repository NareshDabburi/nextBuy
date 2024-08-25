import {LinkContainer} from "react-router-bootstrap";
import {Button} from "react-bootstrap";
import{FaEdit} from 'react-icons/fa';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { useGetProductsQuery,useCreateProductMutation,useDeleteProductMutation } from "../../slices/productsApiSlice"; 
import {toast} from 'react-toastify';
import {useParams} from "react-router-dom"
import  Paginate  from "../../components/Paginate";
import { RiDeleteBin5Line } from "react-icons/ri";


const ProductListScreen = () => {
    const{pageNumber} = useParams();
    const {data,isLoading,error,refetch}=useGetProductsQuery({pageNumber});
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
    {/* <Row className="align-items-center">
        <Col>
        <h1>Products</h1>
        </Col>
        <Col className="text-end">
        <Button className="btn-sm my-3"   onClick={createProductHandler}>
            <FaEdit/> 
            <div>
                Create Product
            </div>
        </Button>
        </Col>
    </Row>  */}
    <div className="flex justify-between pb-4 mt-4">
        <div className="theme-heading theme-text-dark-green">
            Products
        </div>
        <div className=" flex rounded p-2 theme-btn" onClick={createProductHandler} >
            <FaEdit className="m-1"/>
            <div>
                Create Product
            </div>
        </div>
    </div>
    {loadingCreateProduct && <Loader/>}
    {loadingDeleteProduct && <Loader/>}
    {isLoading ? <Loader/> : error ? <Message variant='danger'>{error?.data?.message}</Message>:(
        <>
            {/* <Table hover responsive className="table-sm">
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
                    {data?.products.map((product)=>(
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
            </Table> */}

            <table className="table">
                <thead>
                    <tr className="theme-text-bold-sm theme-green">
                        <th>ID</th>
                        <th>NAME</th>
                        <th>PRICE</th>
                        <th>CATEGORY</th>
                        <th>BRAND</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody className="theme-text-grey">
                    {data?.products.map((product)=>(
                        <tr key={product._id}>
                            <td>{product._id}</td>
                            <td>{product.name}</td>
                            <td>{product.price}</td>
                            <td>{product.category}</td>
                            <td>
                                <LinkContainer to={`/admin/product/${product._id}/edit`}>
                                    <Button className="border-none p-2 bg-transparent" >
                                        <FaEdit className="theme-text-green"/>
                                    </Button>
                                </LinkContainer>
                                <Button className="btn-sm  bg-red-700 border-none hover:bg-red-700" onClick={()=>deleteHandler(product._id)}><RiDeleteBin5Line style={{color:'white'}}/></Button>
                            </td>
                        </tr>
                    ))}       
                </tbody>
            </table>
            <Paginate pages={data.pages} page={data.page} isAdmin={true}/>
        </>
    )}
    </>
  )
}

export default ProductListScreen;