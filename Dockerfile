FROM ubuntu:14.04

MAINTAINER Luis Elizondo <lelizondo@gmail.com>

ENV DEBIAN_FRONTEND noninteractive
ENV DOCKER_BUCKET get.docker.com
ENV DOCKER_VERSION 1.12.0
ENV DOCKER_SHA256 3dd07f65ea4a7b4c8829f311ab0213bca9ac551b5b24706f3e79a97e22097f8b

RUN apt-get update --fix-missing
RUN apt-get dist-upgrade -y \
    && apt-get install -y software-properties-common \
    && apt-add-repository ppa:ansible/ansible \
    && apt-get update \
    && apt-get -y install ansible openssh-server git curl python python-pip openjdk-7-jdk iptables ca-certificates lxc \
    && curl -L https://github.com/digitalocean/doctl/releases/download/v1.1.0/doctl-1.1.0-linux-amd64.tar.gz | tar xz \
    && mv ./doctl /usr/local/bin \
    && pip install awscli \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* \
    && apt-get autoremove -y \
    && curl -fSL "https://${DOCKER_BUCKET}/builds/Linux/x86_64/docker-${DOCKER_VERSION}.tgz" -o docker.tgz \
	&& echo "${DOCKER_SHA256} *docker.tgz" | sha256sum -c - \
	&& tar -xzvf docker.tgz \
	&& mv docker/* /usr/local/bin/ \
	&& rmdir docker \
	&& rm docker.tgz \
	&& docker -v

RUN ( echo ubuntu ; echo ubuntu ) | passwd root \
    && useradd -m -d /home/jenkins -s /bin/sh jenkins \
    && echo "jenkins:jenkins" | chpasswd \
    && unset DEBIAN_FRONTEND

# not very useful until it can run sudo commands
# RUN ( echo ubuntu ; echo ubuntu ) | passwd jenkins

RUN curl -o /usr/local/bin/ecs-cli https://s3.amazonaws.com/amazon-ecs-cli/ecs-cli-linux-amd64-latest \
    && chmod +x /usr/local/bin/ecs-cli

RUN sed -i 's/PermitRootLogin .*/PermitRootLogin yes/g' /etc/ssh/sshd_config \
    && sed -i 's/#PasswordAuthentication .*/PasswordAuthentication yes/g' /etc/ssh/sshd_config \
    && sed -i 's/UsePAM .*/UsePAM no/g' /etc/ssh/sshd_config \
    && sed -i 's|session    required     pam_loginuid.so|session    optional     pam_loginuid.so|g' /etc/pam.d/sshd \
    && git clone https://github.com/sstephenson/bats.git \
    && cd bats \
    && ./install.sh /usr/local \
    && mkdir -p /root/.ssh \
    && touch /root/.ssh/config \
    && echo "Host *" >> /root/.ssh/config \
    && echo "StrictHostKeyChecking no" >> /root/.ssh/config \
    && echo "UserKnownHostsFile=/dev/null" >> /root/.ssh/config \
    && mkdir -p /root/.aws

VOLUME /keys

COPY files/aws-config-file /root/.aws/config
COPY ansible/ansible.cfg /etc/ansible/ansible.cfg
COPY ansible /opt/ansible
COPY run-ansible /opt/run-ansible
COPY providers /opt/providers
COPY dokku /opt/dokku
COPY scripts /opt
COPY scripts/docker-wrapper /usr/local/bin/
EXPOSE 22
CMD ["/opt/start-sshd"]
