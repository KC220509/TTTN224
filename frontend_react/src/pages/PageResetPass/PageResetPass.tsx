
import './PageResetPass.css'

import { useState } from 'react';
import axios from 'axios';


function PageResetPass() {

  const [successReset, setSuccessReset] = useState('');

  
  
  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    try{

      const response = await axios.post('http://127.0.0.1:8000/api/reset-pass-admin')
        
      if(response.data.success){
        setSuccessReset('Mật khẩu đã được đặt lại thành công');
    
        // Chuyển hướng về trang đăng nhập

        setTimeout(() => {
          window.location.href = '/';
        }, 5000); // Chuyển hướng sau 5 giây
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
          <div className='forgot-pass-container flex-col'>
            <form onSubmit={handleReset} method="post" className='form-reset-pass flex-col'>
              <div className='form-title'>
                <h1>Yêu cầu đặt lại mật khẩu hệ thống</h1>
              </div>
              
              <div className='btn-box flex-row'>
                <button type="submit" className='reset-pass-btn'>Gửi</button>
              </div>
                
              <span className="success-reset" style={{color: 'green', fontWeight: 'bold', textAlign: 'center'}}>{successReset}</span>
            </form>
          </div>
        </div>
          
      </div>
    </>
    
  );
}

export default PageResetPass;