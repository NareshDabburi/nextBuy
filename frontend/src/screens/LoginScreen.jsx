import {useState,useEffect} from "react";
import {Link,useLocation,useNavigate} from "react-router-dom";
import{Form,Button,Row,Col} from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import { useDispatch,useSelector } from "react-redux";
import Loader from "../components/Loader";
import { useLoginMutation } from "../slices/userApiSlice";
import { setCredential } from "../slices/authSlice";
import { toast } from "react-toastify";

const LoginScreen = () => {
    const[email,setEmail] = useState('');
    const[password,setPassword] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [login,{isLoading}] = useLoginMutation();

    const {userInfo} = useSelector((state)=>state.auth);

    const {search} = useLocation();
    const sp = new URLSearchParams(search);
    const redirect = sp.get('redirect') || '/';

    useEffect(()=>{
        if(userInfo){
            navigate(redirect);
        }
    },[userInfo,redirect,navigate])


    const submitHandler = async(e)=>{
        e.preventDefault();
        try{
            const res = await login({email,password}).unwrap();
            dispatch(setCredential({...res,}));
            navigate(redirect)

        }catch(err){
            toast.error(err?.data?.message || err.error)
        }
    }

  return (
    <div className=" w-1/2 p-4 mx-auto shadow-lg relative theme-text-dark-green" style={{ background: 'linear-gradient(200deg,#22543d 10%,#FFFFFF 90%)'}}>
        <div className="theme-heading">Sign In</div>
        <Form onSubmit = {submitHandler} >
            <Form.Group controlId="email" className="my-3">
                <Form.Label>Email Address</Form.Label>
                <Form.Control type="email" placeholder="Email Address" value = {email} onChange={(e)=>setEmail(e.target.value)}></Form.Control>
            </Form.Group>
            <Form.Group controlId="password" className="my-3">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Enter Password" value = {password} onChange={(e)=>setPassword(e.target.value)}></Form.Control>
            </Form.Group>
            <Button type='submit'variant="primary" className="mt-2 theme-btn" disabled={isLoading}>Sign In</Button>
            {isLoading && <Loader/>}
        </Form>
        <Row className="py-3">
            <Col>
            New Customer ? <Link to={redirect ? `/register?redirect=${redirect}`:"/register"}>Register</Link>
            </Col>
        </Row>
    </div>
  )
}

export default LoginScreen