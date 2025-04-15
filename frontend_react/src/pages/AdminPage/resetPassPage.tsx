import axios from "axios";
import emailjs from "emailjs-com";

import './styles/resetPass.css';
import { useState } from "react";

const ResetPass= () => {
    const [success, setSuccess] = useState('');

    const handleResetPassword = async () => {
        try{

            const response = await axios.post('http://127.0.0.1:8000/api/admin/reset-pass', {
                email: localStorage.getItem('email'),

            },{
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            }
        )
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
                    setSuccess(`Mật khẩu đã được thay đổi. Hãy kiểm tra email để lấy mật khẩu mới.
                                Hệ thống sẽ tự động đăng xuất.`);
                    // Xóa toke đăng nhập
                    localStorage.removeItem('token');
                
                    // Chuyển hướng về trang đăng nhập
                    setTimeout(() => {
                        setSuccess('');
                        window.location.href = '/'; 
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
            <div className="modal-reset flex-col">
                <span className="note-reset">Bạn muốn đặt lại mật khẩu mới vui lòng click chọn "Xác nhận" để làm mới mật khẩu</span>
                <button onClick={handleResetPassword} className="btn-reset-pass">Xác nhận</button>
                <span className="success-reset" style={{color: 'green', fontWeight: 'bold'}}>{success}</span>
            </div>
        </>
    );
}

export default ResetPass;