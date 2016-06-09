FROM ubuntu:14.04

MAINTAINER Luis Elizondo <lelizondo@gmail.com>

ENV DEBIAN_FRONTEND noninteractive

RUN apt-get update
RUN apt-get dist-upgrade -y && \
    apt-get install -y software-properties-common && \
    apt-add-repository ppa:ansible/ansible && \
    apt-get update && \
    apt-get -y install ansible openssh-server git curl python && \
    curl -L https://github.com/digitalocean/doctl/releases/download/v1.1.0/doctl-1.1.0-linux-amd64.tar.gz  | tar xz && \
    mv ./doctl /usr/local/bin && \
    apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* && \
    apt-get autoremove -y

RUN ( echo ubuntu ; echo ubuntu ) | passwd root
RUN sed -i 's/PermitRootLogin .*/PermitRootLogin yes/g' /etc/ssh/sshd_config
RUN sed -i 's/#PasswordAuthentication .*/PasswordAuthentication yes/g' /etc/ssh/sshd_config
RUN sed -i 's/UsePAM .*/UsePAM no/g' /etc/ssh/sshd_config

COPY ssh-keys/automation-key.pub /root/.ssh/authorized_keys

COPY ansible /opt/ansible
COPY run-ansible /opt/run-ansible
COPY providers /opt/providers
COPY scripts/start-sshd /opt/start-sshd
EXPOSE 22
CMD /opt/start-sshd
