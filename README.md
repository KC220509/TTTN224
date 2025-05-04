# 🚀 AIoT Monitor

AIoT Monitor là hệ thống giám sát thiết bị thông minh thời gian thực, sử dụng công nghệ IoT kết hợp với trí tuệ nhân tạo (AI). Dự án gồm:

- ⚙️ Backend: PHP (Laravel) xử lý API, lưu trữ dữ liệu và điều khiển thiết bị.
- 🌐 Frontend: ReactJS giao diện người dùng trực quan, hiển thị dashboard giám sát.

---

## 📁 Cấu trúc thư mục

```bash
git clone https://github.com/KC220509/TTTN224.git
cd TTTN224


----Cài đặt backend-laravel
cd backend-laravel

# Cài đặt thư viện PHP
composer install

# Tạo file cấu hình môi trường
cp .env.example .env

# Generate key
php artisan key:generate

# Thiết lập database (chỉnh sửa trong .env)
php artisan migrate


---Cài đặt frontend-react
cd frontend-react

# Cài đặt thư viện React
npm install

# Chạy ứng dụng React
npm run dev




#Khởi động thiết bị ảo
docker run -it --name device3 -p 2226:22 ubuntu

apt update
apt-get install iputils-ping

apt install openssh-server    --> có thể không cần
service ssh start


#Kiểm tra ip
docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}'  tên device