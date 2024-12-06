import React from 'react';
import Search from './Search.js';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Dropdown, Image} from "react-bootstrap";//DropdownButton,
import { logout } from '../../actions/userActions.js';


export default function Header() {

  const {isAuthenticated, user} = useSelector(state => state.authState);
  const {items:cartItems} = useSelector(state => state.cartState);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = () => {
    dispatch(logout);
  }

  return (
    <nav className="navbar row">
      <div className="col-12 col-md-3">
        <div className="navbar-brand">
          <Link to="/">
          <img width="150px" alt="JSRcart Logo" src="/images/logo.png" />
          </Link>
        </div>
      </div>

      <div className="col-12 col-md-6 mt-2 mt-md-0">
        <Search/>
      </div>

      <div className="col-12 col-md-3 mt-4 mt-md-0 text-center">
        {isAuthenticated && user? 
          (
            <Dropdown className='d-inline'>
              <Dropdown.Toggle variant="default text-white pr-5" id="dropdown-basic">
                <figure className='avatar avatar-nav'>
                  <Image width="50px" src={user.avatar??"./images/default_avatar.png"}/>
                </figure>
                <span>{user.name}</span>
              </Dropdown.Toggle>
              <Dropdown.Menu>
              {user.role === "admin" && <Dropdown.Item onClick={() => {navigate("/admin/dashboard")}} className='text-danger'>Dashboard</Dropdown.Item>}
                <Dropdown.Item onClick={() => {navigate("/myprofile")}} className='text-danger'>Profile</Dropdown.Item>
                <Dropdown.Item onClick={() => {navigate("/orders")}} className='text-danger'>Orders</Dropdown.Item>
                <Dropdown.Item onClick={logoutHandler} className='text-danger'> Logout</Dropdown.Item>
                 
              </Dropdown.Menu>
            </Dropdown>
          )
        
        :
        <Link to="/login" className="btn" id="login_btn">
          Login
        </Link>
        }

        <Link to="/cart">
        <span id="cart" className="ml-3">
          Cart
        </span>
        
        </Link>
        <span className="ml-1" id="cart_count">
          {cartItems.length}
        </span>
      </div>
    </nav>
  );
}
