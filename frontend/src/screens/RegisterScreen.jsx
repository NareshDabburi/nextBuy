import {useState,useEffect} from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import{Form, Button, Row, Col} from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import { useDispatch,useSelector } from "react-redux";
import Loader from "../components/Loader";
import { useRegisterMutation } from "../slices/userApiSlice";
import { setCredential } from "../slices/authSlice";
import { toast } from "react-toastify";

const RegisterScreen = () => {
    const[name,setName] = useState('');
    const[email,setEmail] = useState('');
    const[confirmPassword,setconfirmPassword] = useState('');
    const[password,setPassword] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [register,{isLoading}] = useRegisterMutation();

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
        if(password !== confirmPassword){
            toast.error("Passowords do not match")
        }else{
            try{
                const res = await register({name,email,password}).unwrap();
                dispatch(setCredential({...res,}));
                navigate(redirect)

            }catch(err){
                toast.error(err?.data?.message || err.error)
            }
        }
    }

  return (
    <FormContainer>
        <h1>Sign Up</h1>
        <Form onSubmit = {submitHandler}>
            <Form.Group controlId="name" className="my-3">
                <Form.Label>Name</Form.Label>
                <Form.Control type="name" placeholder="Enter Name" value = {name} onChange={(e)=>setName(e.target.value)}></Form.Control>
            </Form.Group>
            <Form.Group controlId="email" className="my-3">
                <Form.Label>Email Address</Form.Label>
                <Form.Control type="email" placeholder="Email Address" value = {email} onChange={(e)=>setEmail(e.target.value)}></Form.Control>
            </Form.Group>
            <Form.Group controlId="confirmPassword" className="my-3">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control type="password" placeholder="Confirm Password" value = {confirmPassword} onChange={(e)=>setconfirmPassword(e.target.value)}></Form.Control>
            </Form.Group>
            <Form.Group controlId="password" className="my-3">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Enter Password" value = {password} onChange={(e)=>setPassword(e.target.value)}></Form.Control>
            </Form.Group>
            <Button type='submit'variant="primary" className="mt-2" disabled={isLoading}>Register</Button>
            {isLoading && <Loader/>}
        </Form>
        <Row className="py-3">
            <Col>
            Already have an account ? <Link to={redirect ? `/login?redirect=${redirect}`:"/login"}>Sign In</Link>
            </Col>
        </Row>
    </FormContainer>
  )
}

export default RegisterScreen