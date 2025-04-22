
import './loginStyle.css'

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import emailjs from "emailjs-com";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons';
import { useLocation } from 'react-router-dom';
import { faEnvelope, faLock, faLockOpen } from '@fortawesome/free-solid-svg-icons';

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
            localStorage.setItem('role_id', response.data.user.role_ID);
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

    setTimeout(() => {
      setError('');
    }
    , 3000);
  }, [location]);
  

  const [showResetForm, setShowResetForm] = useState(false);

  const [successReset, setSuccessReset] = useState('');
  const [emailReset, setEmailReset] = useState('');

  
  
  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try{

      const response = await axios.post('http://127.0.0.1:8000/api/reset-pass', {
        email: emailReset,
      })
        
      if(response.data.success){
        emailjs.send(
            'aiotmonitor_4fitty8', // service_id
            'aiotmonitor_zw0kcae', // template_id
            {
                email: response.data.email,
                new_password: response.data.new_password,
            },
            'YrnmdIXlr9p5s_B_x' 
        ).then(() => {
          setSuccessReset(`Mật khẩu đã được làm mới. Hãy kiểm tra email để lấy mật khẩu mới.`);
      
          // Chuyển hướng về trang đăng nhập
          setTimeout(() => {
            setShowResetForm(false); 
            setSuccessReset('');
          }, 5000); 
        });
      }
    }
    catch (error) { 
      console.error("Error resetting password:", error);
    }
  };

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
            <div className="forgot-pass-link">
              <a onClick={() => setShowResetForm(true)}>Quên mật khẩu?</a>
            </div>
            <button type='submit' className='login-btn'>Đăng Nhập</button>
          </form>
          {error && <p style={{color: 'red',textAlign: 'center'}}>{error}</p>}
        </div>

        {showResetForm && (
          <div className='forgot-pass-container flex-col'>
            <form onSubmit={handleResetPassword} method="post" className='form-reset-pass flex-col'>
              <div className='form-title'>
                <h1>Yêu cầu cấp lại mật khẩu</h1>
              </div>
              <input className='ip-email-reset' onChange={(e) => setEmailReset(e.target.value)} type="email" name="email" id="email" placeholder='Nhập email của bạn' required />
              <div className='btn-box flex-row'>
                <button onClick={() => setShowResetForm(false)} className='close-form-btn'>Đóng</button>
                <button type="submit" className='reset-pass-btn'>Gửi</button>
              </div>
                
              <span className="success-reset" style={{color: 'green', fontWeight: 'bold', textAlign: 'center'}}>{successReset}</span>
            </form>
          </div>
        )}
      </div>
    </>
    
  );
}

export default LoginPage;