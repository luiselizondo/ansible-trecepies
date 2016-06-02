FROM ubuntu:14.04

MAINTAINER Luis Elizondo <lelizondo@gmail.com>

ENV DEBIAN_FRONTEND noninteractive

RUN apt-get update \
    apt-get install -y wget ansible git \
    mkdir -p /opt/bin \
    wget -P /opt/bin https://raw.githubusercontent.com/ansible/ansible/devel/contrib/inventory/digital_ocean.py
