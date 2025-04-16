import axios from 'axios';
import React, { useEffect, useState } from 'react';

interface User {
  user_id: number;
  username: string;
  role_id: number;
}

const Header: React.FC = () => {
  const token = localStorage.getItem("token") || '';
  

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!token) {
          window.location.href = '/?error=usernotfound';
        };

        const roleId = Number(localStorage.getItem("role_id"));
        let urlKey = '';
        switch (roleId) {
          case 1:
            // Role is admin
            urlKey = 'api/admin';
            break;
          case 2:
            // Role is teamlead
            urlKey = 'api/teamlead';
            break;
          default:
            urlKey = 'api';
            break;
        }

        const userId = localStorage.getItem("user_id");
        const response = await axios.get(`http://127.0.0.1:8000/${urlKey}/user${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });

        setUser(response.data.user);
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 403) {
            // Không có quyền → điều hướng về login
            window.location.href = '/?error=unauthorized';
        }else {
          console.error("Lỗi gọi API:", err);
        }
      };
    };

    fetchData();
  }, [token]);

  return (
    <div className="header">
      {user ? (
        <>
          <h1>Xin chào, {user.username}</h1>
        </>
      ) : (
        <h1>Đang tải...</h1>
      )}
    </div>
  );
};

export default Header;
