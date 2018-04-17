FROM centos:7
RUN yum -y groupinstall 'Development Tools' \
    && yum -y install krb5-devel \
    && curl -L https://rpm.nodesource.com/setup_6.x | bash - \
    && curl https://dl.yarnpkg.com/rpm/yarn.repo -o /etc/yum.repos.d/yarn.repo \
    && yum -y install nodejs yarn nmap-ncat
WORKDIR /app
COPY src /app/src
COPY package.json yarn.lock index.js register.js config.example.js .babelrc docker-cmd /app/
RUN yarn
RUN cp config.example.js config.js
CMD ["./docker-cmd"]
