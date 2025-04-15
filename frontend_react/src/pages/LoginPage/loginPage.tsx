
import './loginStyle.css'

import React, { useEffect, useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons';
import { Link, useLocation } from 'react-router-dom';
import { faEnvelope, faLock, faLockOpen } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
        
        const response = await axios.post('http://127.0.0.1:8000/api/login', {
            email: email,
            password: password
          }
        );

        if (response.data.token) {
            // Lưu token vào localStorage
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('email', response.data.user.email);
            localStorage.setItem('user_id', response.data.user.user_id); 
            localStorage.setItem('username', response.data.user.username); 
            switch (response.data.user.role_ID) {
              case 1:
                window.location.href = '/admin-page'; // Chuyển hướng đến trang admin
                break;
              case 2:
                window.location.href = '/teamlead-page'; // Chuyển hướng đến trang teamlead
                break;
              case 3:
                window.location.href = '/operator-page'; // Chuyển hướng đến trang operator
                break;
              case 4:
                window.location.href = '/supervisor-page'; // Chuyển hướng đến trang supervisor
                break;
              default:
                setError('Không có quyền truy cập vào trang này.');
                break;
            }
        }
    } catch {
        setError('Đăng nhập không thành công. Vui lòng kiểm tra lại thông tin tài khoản.');
        setTimeout(() => {
            setError('');
        }
        , 3000); // Xóa thông báo sau 3 giây
    }
  }
  const location = useLocation();
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const errorParam = params.get('error');

    if (errorParam === 'usernotfound') {
      setError('Vui lòng đăng nhập.');           
      
    }else if (errorParam === 'unauthorized') {
      setError('Bạn không có quyền truy cập trang này.');
    }
  }, [location]);
  
  


  return (
    <>
      <div id='auth-container' className='auth-container'>
        <div className='auth-content flex-col'>
          <div className='form-title'>
            <h1>Aiot Monitor</h1>
          </div>
          
          <form method='POST' onSubmit={handleLogin} className='login-form flex-col'>
            <div className='ip-box flex-row'>
              <label htmlFor='email'>
              <FontAwesomeIcon icon={faEnvelope} className='icon lock-icon ip-icon' />
              </label>
              <input onChange={(e)=>setEmail(e.target.value)} className='ip-info' type='email' id='email' name='email' placeholder='Email address' required />
            </div>
              
            <div className='ip-box flex-row'>
              <label htmlFor='password'>
                <FontAwesomeIcon icon={!showPassword ? faLock : faLockOpen} className='icon lock-icon ip-icon' />  
             
              </label>
              <input  onChange={(e)=>setPassword(e.target.value)} className='ip-info' type={showPassword ? 'text' : 'password'} id='password' name='password' placeholder='Password' required />
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className='icon eye-icon' onClick={() => setShowPassword(!showPassword)} />
            </div>
            <div className="forgot-pass">
              <Link to='/login'>Forgot password?</Link>
            </div>
            <button type='submit' className='login-btn'>Log In</button>
          </form>
          {error && <p style={{color: 'red',textAlign: 'center'}}>{error}</p>}
        </div>
      </div>
    </>
    
  );
}

export default LoginPage;