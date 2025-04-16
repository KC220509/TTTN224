import axios from "axios";
import { useEffect, useState } from "react";

import './styles/userManager.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faKey, faLock, faLockOpen, faMagnifyingGlass, faUnlockKeyhole, faUser, faUserLock, faUserPlus, faUserXmark, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useLocation } from "react-router-dom";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";

const UserManagers = () => {
    const location = useLocation();
    const title = location.state?.title || '';
    // const [success, setSuccess] = useState('');
    // const [error, setError] = useState('');

    interface User {
        user_id: number;
        username: string;
        email: string;
        roleName: string;
        gender: boolean;
        status_acc: boolean;
    }

    interface Role {
        role_id: number;
        role_name: string;
    }

    const [users, setUsers] = useState<User[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);

    const [successMessage, setSuccessMessage] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');

    
    const fetchUsers = async () => {
        try {
            const res = await axios.get("http://127.0.0.1:8000/api/admin/list-user", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                }
            });

            if (res.data.users) {
                setUsers(res.data.users);
                setRoles(res.data.roleList);
                // console.log("Danh sách người dùng:", res.data.users);
            } else {
                console.warn("res.data.users không tồn tại hoặc không phải là mảng:", res.data);
                setUsers([]);
                setRoles([]);
            }
        } catch (err) {
            console.error("Lỗi khi lấy danh sách người dùng:", err);
        }
    };

    useEffect(() => {
        fetchUsers();
    },[]);


    //modal add user
      
    const [showModal, setShowModal] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [username, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [roleID, setRoleID] = useState(0);

    const handleCreateUser = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try{
            const resAddUser = await axios.post('http://127.0.0.1:8000/api/admin/create-user', {
                username: username,
                email: email,
                password: password,
                role_ID: roleID,
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                }
            })

            if(resAddUser.data.success){
                setErrorMessage('');
                setShowModal(false);
                setUserName('');
                setEmail('');
                setPassword('');
                setRoleID(0);
                setShowPassword(false);
                fetchUsers();
                (e.target as HTMLFormElement).reset(); // Reset form
                setSuccessMessage('Tạo người dùng thành công !');
                setTimeout(() => {
                    setSuccessMessage('');
                }
                , 2000);
            }
            else{
                setSuccessMessage('');
                setErrorMessage('Tạo người dùng mới không thành công !');
                setTimeout(() => {
                    setErrorMessage('');
                }, 2000);
            }
        }catch(err){
            setSuccessMessage('');
            setTimeout(() => {
                if (axios.isAxiosError(err) && err.response?.data?.errors?.email) {
                    setErrorMessage(err.response.data.errors.email[0]);
                } else {
                    setErrorMessage('Đã xảy ra lỗi không xác định !');
                }
            }, 2000); 
        }
    }
    

    return(
        <>
            <div className="head-contnent flex-row">
                <h1 className="title-nav">{title}</h1>
                {errorMessage && <p style={{color: 'red',textAlign: 'right', fontWeight: 'bold'}}>{errorMessage}</p>}
                {successMessage && <p style={{color: 'green',textAlign: 'right', fontWeight: 'bold'}}>{successMessage}</p>}
            </div>
            <div className="box-function flex-row">
                <a className="btn-open-modal-add flex-row" onClick={() => setShowModal(!showModal)}>
                    <FontAwesomeIcon icon={faUserPlus} />
                    <span>Add User</span>
                </a>
                <form method="POST" className="search-box flex-row">
                    <input type="text" placeholder="Tìm kiếm người dùng" className="search-input" />
                    <button className="btn-search">
                        <FontAwesomeIcon icon={faMagnifyingGlass} />
                    </button>
                </form>
            </div>
            <div className="user-manager-container flex-col">

                <div className="manager-table table-head flex-row">
                    <div className="user-box" style={{ textAlign: 'left' }}>Thông tin người dùng</div>
                    <div className="user-role">Quyền truy cập</div>
                    <div className="user-gender">Giới tính</div>
                    <div className="user-status">Trạng thái</div>
                    <div className="admin-lock-user">Khóa tài khoản</div>
                    <div className="admin-reset-pass">Cập nhật</div>
                    <div className="admin-delete">Xóa tài khoản</div>
                </div>
                {users.map((user) => (
                    <div key={user.user_id} className="manager-table table-content flex-row">
                        
                        <div className="user-box flex-row">
                            <div className="user-info flex-col">
                                <div className="info-name">{user.username}</div>
                                <div className="info-email">{user.email}</div>
                            </div>
                        </div>
                        
                        <div className="user-role">{user.roleName}</div>
                        <div className="user-gender">{user.gender ? 'Nam' : 'Nữ'}</div>
                        <div className="user-status" style={{ fontWeight: 'bold', color: user.status_acc ? '#00ed3e' : '#ff1500' }}>
                            {user.status_acc ? 'Hoạt động' : 'Bị khóa'}
                        </div>
                        <div className="admin-lock-user">
                            <FontAwesomeIcon title={user.status_acc ? 'Khóa tài khoản' : 'Mở khóa tài khoản'} icon={user.status_acc ? faUserLock : faUnlockKeyhole} className="icon-fa"  style={{color: '#acac88'}}/>
                        </div>
                        <div className="admin-reset-pass">
                            <FontAwesomeIcon title="Làm mới mật khẩu" icon={faKey} className="icon-fa" style={{color: '#1683ff'}}/>
                        </div>
                        <div className="admin-delete">
                            <FontAwesomeIcon  title="Xóa tài khoản" icon={faUserXmark} className="icon-fa" style={{color: '#ff1100'}} />    
                        </div>
                    </div>
                ))}
                
            </div>

            <div className={`modal-container-addUser ${!showModal ? 'modal-active' : ''}`}>

                <form onSubmit={handleCreateUser} className="form-add-user flex-col" method="post" autoComplete="off">
                    <FontAwesomeIcon onClick={() => setShowModal(!showModal)} icon={faXmark} className="icon btn-close-modal" />
                    <h1 className="form-title">Tạo người dùng mới</h1>
                    <div className="form-input flex-row">
                        <label htmlFor="username">
                            <FontAwesomeIcon icon={faUser} className="icon"/>
                        </label>
                        <input onChange={(e) => setUserName(e.target.value)} type="text" id="username" name="username" placeholder="Tên tài khoản" className="ip-info" required autoComplete="off"/>
                    </div>
                    <div className="form-input flex-row">
                        <label htmlFor="email">
                            <FontAwesomeIcon icon={faEnvelope} className="icon" />
                        </label>
                        <input onChange={(e) => setEmail(e.target.value)} type="text" id="email" name="email" placeholder="Email của người dùng mới" className="ip-info" required autoComplete="off" />
                    </div>
                    <div className="form-input flex-row">
                        <label htmlFor="password">
                            <FontAwesomeIcon icon={!showPassword ? faLock : faLockOpen} className='icon lock-icon ip-icon' />  
                        </label>
                        <input onChange={(e) => setPassword(e.target.value)} type={showPassword ? 'text' : 'password'} id="password" name="password" placeholder="Nhập mật khẩu người dùng" className="ip-info" required autoComplete="new-password"/>
                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className='eye-icon' onClick={() => setShowPassword(!showPassword)} />
                    </div>
                    <div className="form-input flex-row">
                        <label htmlFor="role">

                        </label>
                        <select onChange={(e) => setRoleID(parseInt(e.target.value))} name="role" id="role" className="ip-info" style={{cursor: 'pointer'}} required>
                            <option value="">--- Chọn quyền truy cập ---</option>
                            {roles.map((role) => (
                                <option key={role.role_id} value={role.role_id}>{role.role_name}</option>
                            ))}
                        </select>
                    </div>
                    <button type="submit" className="btn-create-user">Thêm mới</button>
                </form>
            </div>
        </>

    );
}

export default UserManagers;