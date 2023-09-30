FROM registry.fedoraproject.org/fedora:35

RUN dnf install -y rpm-build curl wget xz tar jq

WORKDIR /tmp

ADD install_node.sh /
ADD spec.patch /
RUN chmod +x /install_node.sh && /bin/bash /install_node.sh

VOLUME [ "/build_root" ]
ADD "entrypoint.sh" /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT /entrypoint.sh