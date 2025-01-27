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
import SearchBox from './SearchBox'

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
        <Navbar bg="dark" variant="dark" expand="md" collapseOnSelect>
            <Container>
                <LinkContainer to="/">
                <Navbar.Brand >
                <img src = {logo1} alt="" style={{height:"50px"}}/>
                NextBuy</Navbar.Brand>
                </LinkContainer>
                <Navbar.Toggle aria-controls='basic-navbar-nav'/>
                <Navbar.Collapse id="basic-navbar-bar">
                    
                    <Nav className='ms-auto'>
                        
                        <LinkContainer to="/cart">
                            <Nav.Link href="/cart"><FaShoppingCart/>Cart 
                                {cartItems?.length >0 && (
                                    <Badge pill bg='success' style={{marginLeft : '5px'}}>
                                        {cartItems.reduce((a,c)=> a+c.qty,0)}
                                    </Badge>)}
                            </Nav.Link>
                        </LinkContainer>
                        
                        {userInfo ? 
                        (
                            <NavDropdown title = {userInfo.name} id="username">
                                <LinkContainer to='/profile'>
                                <NavDropdown.Item>Profile</NavDropdown.Item>
                                </LinkContainer>
                                <NavDropdown.Item onClick={logoutHandler}>Logout</NavDropdown.Item>
                            </NavDropdown>
                        ) : 
                        ( <LinkContainer to="/login"><Nav.Link href="/login"><FaUser/>Sign In</Nav.Link></LinkContainer>)}
                        {userInfo && userInfo.isAdmin && (
                            <NavDropdown title="Admin"id="adminmenu">
                                <LinkContainer to='/admin/productlist'>
                                <NavDropdown.Item>Products</NavDropdown.Item>
                                </LinkContainer>
                                <LinkContainer to='/admin/userlist'>
                                <NavDropdown.Item>Users</NavDropdown.Item>
                                </LinkContainer>
                                <LinkContainer to='/admin/orderlist'>
                                <NavDropdown.Item>Orders</NavDropdown.Item>
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