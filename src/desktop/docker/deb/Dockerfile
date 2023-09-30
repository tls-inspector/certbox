FROM docker.io/library/ubuntu:20.04

RUN apt-get update && \
    apt-get install -y wget curl tar xz-utils fakeroot dpkg jq

WORKDIR /tmp

ADD install_node.sh /
RUN chmod +x /install_node.sh && /bin/bash /install_node.sh

VOLUME [ "/build_root" ]
ADD "entrypoint.sh" /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT /entrypoint.sh