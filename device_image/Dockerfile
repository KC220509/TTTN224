FROM ubuntu:latest

ENV DEBIAN_FRONTEND=noninteractive

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
    cmake \
    g++ \
    git \
    libjson-c-dev \
    libwebsockets-dev \
    libuv1-dev \
    make \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# SSH setup
RUN mkdir -p /var/run/sshd && \
    useradd -m tn224 && echo "tn224:123123" | chpasswd && adduser tn224 sudo

RUN sed -i 's/#PasswordAuthentication yes/PasswordAuthentication yes/' /etc/ssh/sshd_config && \
    sed -i 's/PasswordAuthentication no/PasswordAuthentication yes/' /etc/ssh/sshd_config && \
    echo "PermitRootLogin yes" >> /etc/ssh/sshd_config

    

# Expose ports
EXPOSE 22

# Start the SSH server 
CMD ["/usr/sbin/sshd", "-D"]