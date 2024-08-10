import React from 'react'
import {Navbar,Nav,Container,Badge, NavDropdown} from 'react-bootstrap';
import {FaShoppingCart, FaUser} from 'react-icons/fa';
import {LinkContainer} from "react-router-bootstrap";
import logo1 from "../assets/logo-1.png"
import {useSelector,useDispatch} from "react-redux";
import { useLogoutMutation } from '../slices/userApiSlice';
import {logout} from "../slices/authSlice";
import { useNavigate } from 'react-router-dom';
import { resetCart } from '../slices/cartSlice';


const Header = () => {
    const{cartItems} = useSelector((state)=>state.cart);
    const {userInfo} = useSelector((state)=>state.auth);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [logOutApiCall] = useLogoutMutation();

    const logoutHandler = async()=>{
        try{
        await logOutApiCall().unwrap();
        dispatch(logout());
        // dispatch(clearCartItems());
        dispatch(resetCart());
        navigate("/login");
        }catch(err){
            console.log(err);
        }

    }

  return (
    <header>
        <Navbar variant="dark" expand="md" collapseOnSelect className='theme-green'>
            <Container>
                <LinkContainer to="/">
                <Navbar.Brand className='flex'>
                <img src = {logo1} alt="" style={{height:"50px"}}/>
                <div className='mt-2 '>
                    NextBuy
                </div>
                </Navbar.Brand>
                </LinkContainer>
                <Navbar.Toggle aria-controls='basic-navbar-nav'/>
                <Navbar.Collapse id="basic-navbar-bar">
                    
                    <Nav className='ms-auto'>
                        
                        <LinkContainer to="/cart" className='flex theme-white'>
                            <Nav.Link href="/cart" ><FaShoppingCart className='m-1 '/>
                            <div>Cart</div>
                                {cartItems?.length >0 && (
                                    <Badge  className='ml-1'>
                                       {cartItems.reduce((a,c)=> a+c.qty,0)}
                                    </Badge>)}
                            </Nav.Link>
                        </LinkContainer>
                        
                        {userInfo ? 
                        (
                            <NavDropdown id="username" title={<span className="theme-white">{userInfo.name}</span>}>
                                <LinkContainer to='/profile'>
                                <NavDropdown.Item className='theme-text-grey'>Profile</NavDropdown.Item>
                                </LinkContainer>
                                <NavDropdown.Item className='theme-text-grey' onClick={logoutHandler}>Logout</NavDropdown.Item>
                            </NavDropdown>
                        ) : 
                        ( <LinkContainer to="/login" className='flex theme-white'><Nav.Link href="/login"><FaUser className='m-1'/>Sign In</Nav.Link></LinkContainer>)}
                        {userInfo && userInfo.isAdmin && (
                            <NavDropdown title={<span className="theme-white">Admin</span>} id="adminmenu">
                                <LinkContainer to='/admin/productlist'>
                                <NavDropdown.Item className='theme-text-grey'>Products</NavDropdown.Item>
                                </LinkContainer>
                                <LinkContainer to='/admin/userlist'>
                                <NavDropdown.Item className='theme-text-grey'>Users</NavDropdown.Item>
                                </LinkContainer>
                                <LinkContainer to='/admin/orderlist'>
                                <NavDropdown.Item className='theme-text-grey'>Orders</NavDropdown.Item>
                                </LinkContainer>
                            </NavDropdown>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    </header>
  )
}

export default Header