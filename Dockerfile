FROM ubuntu:14.04

MAINTAINER Luis Elizondo <lelizondo@gmail.com>

ENV DEBIAN_FRONTEND noninteractive

RUN apt-get update
RUN apt-get dist-upgrade -y && \
    apt-get install -y software-properties-common && \
    apt-add-repository ppa:ansible/ansible && \
    apt-get update && \
    apt-get -y install ansible openssh-server git curl python python-pip openjdk-7-jdk && \
    curl -L https://github.com/digitalocean/doctl/releases/download/v1.1.0/doctl-1.1.0-linux-amd64.tar.gz | tar xz && \
    mv ./doctl /usr/local/bin && \
    pip install awscli && \
    apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* && \
    apt-get autoremove -y

RUN ( echo ubuntu ; echo ubuntu ) | passwd root
RUN useradd -m -d /home/jenkins -s /bin/sh jenkins && \
    echo "jenkins:jenkins" | chpasswd
# not very useful until it can run sudo commands
# RUN ( echo ubuntu ; echo ubuntu ) | passwd jenkins

RUN sed -i 's/PermitRootLogin .*/PermitRootLogin yes/g' /etc/ssh/sshd_config
RUN sed -i 's/#PasswordAuthentication .*/PasswordAuthentication yes/g' /etc/ssh/sshd_config
RUN sed -i 's/UsePAM .*/UsePAM no/g' /etc/ssh/sshd_config
RUN sed -i 's|session    required     pam_loginuid.so|session    optional     pam_loginuid.so|g' /etc/pam.d/sshd


RUN mkdir -p /root/.ssh && \
    touch /root/.ssh/config && \
    echo "Host *" >> /root/.ssh/config && \
    echo "StrictHostKeyChecking no" >> /root/.ssh/config && \
    echo "UserKnownHostsFile=/dev/null" >> /root/.ssh/config

COPY ansible/ansible.cfg /etc/ansible/ansible.cfg
COPY ansible /opt/ansible
COPY run-ansible /opt/run-ansible
COPY providers /opt/providers
COPY dokku /opt/dokku
COPY scripts /opt
EXPOSE 22
ENTRYPOINT ["/opt/start-sshd"]
