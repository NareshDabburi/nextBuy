import { useState,useEffect } from "react"
import {Link,useNavigate,useParams} from "react-router-dom"
import {Form,Button} from "react-bootstrap"
import Message from "../../components/Message"
import Loader from "../../components/Loader"
import{toast} from "react-toastify"
import FormContainer from "../../components/FormContainer"
import {useGetUserDetailsQuery,useUpdateUserMutation} from "../../slices/userApiSlice";

const UserEditScreen = () => {
    const {id:userId} = useParams();
    const[name,setName] = useState("");
    const[email,setEmail] = useState("");
    const[isAdmin,setIsAdmin] = useState(false);
    

    const{data:user,isLoading,refetch,error} = useGetUserDetailsQuery(userId);
    const[updateUser,{isLoading:loadingUser}] = useUpdateUserMutation();
    

    const navigate = useNavigate();
    useEffect(()=>{
        if(user){
            setName(user.name);
            setEmail(user.email);
            setIsAdmin(user.isAdmin); 
        }
    },[user])

    const submitHandler = async(e)=>{
        e.preventDefault();
        try{
            console.log(name);
            await updateUser({userId,name,email,isAdmin});
            toast.success("User updated successfully");
            refetch();
            navigate('/admin/userlist')
        }
        catch(err){
            toast.error(err?.data?.messaage || err?.error);
        }
    }
   
  return (
    <>
    <Link to="/admin/userlist" className="btn btn-light my-3">
        Go Back
    </Link>
    <FormContainer>
        <h1>Edit User</h1>
        {loadingUser && <Loader/>}
        {isLoading ? <Loader/> : error ? <Message variant='danger'>{error}</Message> : (
            <Form onSubmit={submitHandler}>
                <Form.Group controlId="name">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type='name' placeholder="Enter name" value={name} onChange={(e)=>setName(e.target.value)}></Form.Control>
                </Form.Group>
                <Form.Group controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type='email' placeholder="Enter email" value={email} onChange={(e)=>setEmail(e.target.value)}></Form.Control>
                </Form.Group>
                <Form.Group>
                    <Form.Group controlId="isAdmin">
                        <Form.Check type="checkbox" label="isAdmin" checked={isAdmin} onChange={(e)=>setIsAdmin(e.target.checked)}>
                        </Form.Check>
                    </Form.Group>
                </Form.Group>
                <Button type='submit' variant="primary">Update</Button>
            </Form>
        )}
    </FormContainer>
    </>
  )
}

export default UserEditScreen;