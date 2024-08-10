import {LinkContainer} from "react-router-bootstrap";
import {Table,Button} from "react-bootstrap";
import{FaTimes,FaTrash,FaEdit,FaCheck} from 'react-icons/fa';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import {useGetUsersQuery,useDelteUsersMutation} from '../../slices/userApiSlice';
import {toast} from 'react-toastify'

const UserListScreen = () => {
    const {data:users,refetch,isLoading,error}= useGetUsersQuery()
    const [deleteUser , {isLoading:loadingDelete}] = useDelteUsersMutation();
    console.log(users);
    const deleteHandler = async(id)=>{
        if(window.confirm("Are you sure?")){
            try{
                await deleteUser(id);
                refetch();
                toast.success("User deleted");
            }
            catch(err){
                toast.error(err?.data?.message|| err?.error);
            }
        }
    }
  return (
    <>
    <div className="theme-heading theme-text-dark-green">Users</div>
    {loadingDelete && <Loader/>}
    {isLoading ? (<Loader/>) : error ? (<Message variant='danger'>{error}</Message>):(<>
        {/* <Table striped hover responsive className="table=sm">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>NAME</th>
                    <th>EMAIL</th>
                    <th>ADMIN</th>
                </tr>
            </thead>
            <tbody>
                {users.map((user)=>(
                    <tr key={user._id}>
                        <td>{user._id}</td>
                        <td>{user.name}</td>
                        <td><a href={`mailTo:${user.email}`}>{user.email}</a></td>
                        <td>{user.isAdmin ? <FaCheck style={{color:'green'}}/> : <FaTimes style={{color:'red'}}/>}</td>
                        <td>
                            <LinkContainer to={`/admin/user/${user._id}/edit`}>
                                <Button variant="light" className="btn-sm"><FaEdit/></Button>
                            </LinkContainer>
                            <Button variant="danger" className="btn-sm" onClick={()=>deleteHandler(user._id)}><FaTrash style={{color:"white"}}/></Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table> */}

        <table  className="table">
            <thead>
                <tr className="theme-text-bold-sm theme-green">
                    <th>ID</th>
                    <th>NAME</th>
                    <th>EMAIL</th>
                    <th>ADMIN</th>
                    <th></th>
                </tr>
            </thead>
            <tbody className="theme-text-grey">
                {users.map((user)=>(
                    <tr key={user._id}>
                        <td>{user._id}</td>
                        <td>{user.name}</td>
                        <td><a href={`mailTo:${user.email}`}>{user.email}</a></td>
                        {/* <td>{user.isAdmin ? <FaCheck style={{color:'green'}}/> : <FaTimes style={{color:'red'}}/>}</td>  */}
                        <td>{user.isAdmin ? 'Yes': 'No'}</td>
                        <td>
                            <LinkContainer to={`/admin/user/${user._id}/edit`}>
                                <Button variant="light" className="btn-sm"><FaEdit/></Button>
                            </LinkContainer>
                            <Button variant="danger" className="btn-sm" onClick={()=>deleteHandler(user._id)}><FaTrash style={{color:"white"}}/></Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </>
    )}
    </>
  )
}

export default UserListScreen