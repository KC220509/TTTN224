
import axios from "axios";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { faLock, faLockOpen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import './styles/updatePass.css';

const UpdatePass = () => {
    const location = useLocation();
    const title = location.state?.title || '';

    const [showOldPass, setShowOldPass] = useState(false);
    const navigate = useNavigate();
    const [showNewPass, setShowNewPass] = useState(false);
    const [showNewPassConfirm, setShowNewPassConfirm] = useState(false);

    const [oldPassword, setOldPass] = useState('');
    const [newPassword, setNewPass] = useState('');
    const [newPasswordConfirm, setNewPassConfirm] = useState('');

    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const hadleUpdatePass = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        try{

            const response = await axios.patch('http://127.0.0.1:8000/api/admin/update-profile-pass', {
                old_password: oldPassword,
                new_password: newPassword,
                new_password_confirmation: newPasswordConfirm
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
            });

            if(response.data.success){
                setError('');
                setSuccess(`Cập nhật mật khẩu thành công. Đăng nhập lại sau 3 giây.`);
                // Xóa toke đăng nhập
                localStorage.removeItem('token');
            
                // Chuyển hướng về trang đăng nhập
                setTimeout(() => {
                    setSuccess('');
                    navigate('/');
                }, 3000); 
            }

        }
        catch (err: unknown){
            setSuccess('');
            setTimeout(() => {
                if (axios.isAxiosError(err) && err.response?.data?.error) {
                    setError(err.response.data.error);
                } else {
                    if (axios.isAxiosError(err) && err.response?.data?.errors?.new_password) {
                        setError(err.response.data.errors.new_password[0]);
                    } else {
                        setError('Đã xảy ra lỗi không xác định !');
                    }
                }
            }, 2000); 
        }
    }
    
    return (
        <>
            <div className="head-contnent flex-row">
                <h1 className="title-nav">{title}</h1>
                {error && <p style={{color: 'red',textAlign: 'right', fontWeight: 'bold'}}>{error}</p>}
                {success && <p style={{color: 'green',textAlign: 'right', fontWeight: 'bold'}}>{success}</p>}
            </div>
            <form method='POST' onSubmit={hadleUpdatePass} className='update-form flex-col'>
                <div className='ip-box flex-row'>
                    <label htmlFor='old_password'>
                        <FontAwesomeIcon icon={!showOldPass ? faLock : faLockOpen} className='icon lock-icon ip-icon' />  
                    
                    </label>
                    <input  onChange={(e)=>setOldPass(e.target.value)} className='ip-info' type={showOldPass ? 'text' : 'password'} id='old_password' name='old_password' placeholder='Nhập mật khẩu hiện tại' required />
                    <FontAwesomeIcon icon={showOldPass ? faEyeSlash : faEye} className='icon eye-icon' onClick={() => setShowOldPass(!showOldPass)} />
                </div>
                <div className='ip-box flex-row'>
                    <label htmlFor='new_password'>
                        <FontAwesomeIcon icon={!showNewPass ? faLock : faLockOpen} className='icon lock-icon ip-icon' />  
                    
                    </label>
                    <input  onChange={(e)=>setNewPass(e.target.value)} className='ip-info' type={showNewPass ? 'text' : 'password'} id='new_password' name='new_password' placeholder='Nhập mật khẩu mới' required />
                    <FontAwesomeIcon icon={showNewPass ? faEyeSlash : faEye} className='icon eye-icon' onClick={() => setShowNewPass(!showNewPass)} />
                </div>
                <div className='ip-box flex-row'>
                    <label htmlFor='new_password_confirm'>
                        <FontAwesomeIcon icon={!showNewPassConfirm ? faLock : faLockOpen} className='icon lock-icon ip-icon' />  
                    
                    </label>
                    <input onChange={(e)=>setNewPassConfirm(e.target.value)} className='ip-info' type={showNewPassConfirm ? 'text' : 'password'} id='new_password_confirm' name='new_password_confirm' placeholder='Nhập lại mật khẩu mới' required />
                    <FontAwesomeIcon icon={showNewPassConfirm ? faEyeSlash : faEye} className='icon eye-icon' onClick={() => setShowNewPassConfirm(!showNewPassConfirm)} />
                </div>
            
                <button type='submit' className='update-pass-btn'>Cập nhật mật khẩu</button>
          </form>
          
        </>
    );
};

export default UpdatePass;