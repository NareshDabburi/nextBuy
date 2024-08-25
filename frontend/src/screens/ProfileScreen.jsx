import {useState,useEffect} from "react";
import {Form,Button,Row,Col} from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import {toast} from 'react-toastify';
import Loader from '../components/Loader';
import Message from "../components/Message";
import { useDispatch,useSelector } from "react-redux";
import { useProfileMutation } from "../slices/userApiSlice";
import { setCredential } from "../slices/authSlice";
import {useGetMyOrdersQuery} from "../slices/orderApiSlices";
import{FaTimes} from 'react-icons/fa';

const ProfileScreen = () => {
    const [name,setName] = useState("");
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [confirmPassword,setConfirmPassword] = useState("");

    const dispatch = useDispatch();
    const {userInfo} = useSelector((state)=>state.auth);
    const [updateProfile,{isLoading:loadingUpdateProfile}]=useProfileMutation();
    const {data:orders,isLoading,error} =useGetMyOrdersQuery();

    useEffect(()=>{
        if(userInfo){
            setName(userInfo.name);
            setEmail(userInfo.email);
        }
    },[userInfo,userInfo.name,userInfo.email]);

    const submitHandler = async(e)=>{
        e.preventDefault();
        if(password !== confirmPassword){
            toast.error("Password does not match");
        }else{
            try{
                const res = await updateProfile({_id:userInfo._id,name,email,password}).unwrap();
                dispatch(setCredential(res));
                toast.success("Profile Updated");
            }
            catch(err){
                toast.error(err?.data.message || err?.message);
            }
        }
    }

  return (
    <Row className="mt-4 mb-2">
        <Col md={3}>
        <div className="theme-heading theme-text-dark-green">User Profile</div>
        <Form onSubmit={submitHandler} className='theme-text-grey'>
            <Form.Group controlId="name" className="my-2">
                <Form.Label>Name</Form.Label>
                <Form.Control type='name' placeholder="Enter name" value={name} onChange={(e)=>setName(e.target.value)}></Form.Control>
            </Form.Group>
            <Form.Group controlId="email" className="my-2">
                <Form.Label>Email Address</Form.Label>
                <Form.Control type='email' placeholder="Enter email" value={email} onChange={(e)=>setEmail(e.target.value)}></Form.Control>
            </Form.Group>
            <Form.Group controlId="password" className="my-2">
                <Form.Label>Password</Form.Label>
                <Form.Control type='password' placeholder="Enter password" value={password} onChange={(e)=>setPassword(e.target.value)}></Form.Control>
            </Form.Group>
            <Form.Group controlId="confirmPassword" className="my-2">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control type='password' placeholder="Enter confirm password" value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)}></Form.Control>
            </Form.Group>
            <Button type="submit" variant="primary" className="my-2 theme-btn" >Update</Button>
        {loadingUpdateProfile && <Loader/> }
        </Form>
        
        </Col>
        <Col md={9}>
            <div className="theme-heading theme-text-dark-green">My Orders</div>
            {isLoading ? (<Loader/>) : error ? (<Message variant='danger'>{error?.data?.message || error.error}</Message>) : (
                <table className="table theme-text-grey" >
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Date</th>
                            <th>TOTAL</th>
                            <th>PAID</th>
                            <th>DELIVERED</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order)=>(
                            <tr key={order._id}> 
                                <td>{order._id}</td>
                                <td>{order.createdAt.substring(0,10)}</td>
                                <td>{order.totalPrice}</td>
                                <td>
                                    {order.isPaid?(<div className="bg-green-100 rounded-full">
                                        {order.paidAt.substring(0,10)}
                                    </div>):(<div className="pl-14"><FaTimes style={{color:'red'}}/></div>)}
                                </td>
                                <td>
                                    {order.isDelivered?(<div className="bg-green-100 rounded-full">{order.deliveredAt.substring(0,10)}</div>):(<FaTimes style={{color:'red'}}/>)}
                                </td>
                                <td>
                                    <LinkContainer to={`/orders/${order._id}`}>
                                        <Button className="btn-sm theme-btn"  variant="light">Details</Button>
                                    </LinkContainer>
                                </td>
                            </tr>
                        ))}
                    </tbody>

                </table>
            )}
        </Col>
        
    </Row>
  )
}

export default ProfileScreen