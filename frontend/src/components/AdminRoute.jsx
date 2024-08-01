import {Outlet,Navigate} from "react-router-dom";
import {useSelector} from "react-redux";

const AdminRoute = () => {
    const {userInfo} = useSelector(state => state.auth);
    //console.log(userInfo)
  return userInfo?.isAdmin ? <Outlet/> : <Navigate to ="/login"/>
}

export default AdminRoute