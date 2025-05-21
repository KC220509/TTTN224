FROM ubuntu:latest

# Thiết lập biến môi trường để tránh các câu hỏi tương tác
ENV DEBIAN_FRONTEND=noninteractive

# Cập nhật gói và cài OpenSSH Server + các công cụ dòng lệnh cơ bản
RUN apt-get update && apt-get install -y \
    nano \
    openssh-server \
    sudo \
    coreutils \
    bash \
    curl \
    wget \
    vim \
    iputils-ping \
    net-tools \
    iproute2 \
    procps \
    less \
    man \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Tạo thư mục cần thiết cho SSH
RUN mkdir -p /var/run/sshd

# Tạo user tn224 và đặt mật khẩu là 123123, thêm vào nhóm sudo
RUN useradd -m tn224 && echo "tn224:123123" | chpasswd && adduser tn224 sudo

# Cho phép đăng nhập SSH bằng mật khẩu
RUN sed -i 's/#PasswordAuthentication yes/PasswordAuthentication yes/' /etc/ssh/sshd_config && \
    sed -i 's/PasswordAuthentication no/PasswordAuthentication yes/' /etc/ssh/sshd_config && \
    echo "PermitRootLogin yes" >> /etc/ssh/sshd_config

# Mở port SSH
EXPOSE 22

# Lệnh mặc định khi container khởi động
CMD ["/usr/sbin/sshd", "-D"]
