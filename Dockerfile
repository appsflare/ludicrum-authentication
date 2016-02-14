FROM ubuntu:14.04
MAINTAINER Srinath Janakiraman <me@vjsrinath.com>

ENV NODE_VERSION=${NODE_VERSION:-4.3.0}
ENV PACKAGE_URL=https://github.com/appsflare/ludicrum-authentication/archive/master.zip
ENV APP_DIR_NAME=ludicrum-authentication-master
ENV WORK_DIR=/srv/www/
## ENV NODE_ENV

RUN echo "Node version ${NODE_VERSION}"

RUN curl "https://deb.nodesource.com/node_4.x/pool/main/n/nodejs/nodejs_$NODE_VERSION-1nodesource1~trusty1_amd64.deb" > node.deb \
 && dpkg -i node.deb \
 && rm node.deb;

##RUN apt-get install build-essential libavahi-compat-libdnssd-dev
RUN apt-get update \
    && apt-get install curl -y --force-yes \
    && apt-get install wget -y --force-yes \
    && apt-get install unzip -y --force-yes;

##RUN npm install -g node-gyp\
## && npm cache clear\
## && node-gyp configure || echo ""

##RUN apt-get update \
## && apt-get upgrade -y --force-yes \
## && rm -rf /var/lib/apt/lists/*;


##RUN apt-get install git \
## && npm install -g forever

RUN npm install pm2@latest -g
#CMD ["srv"]

##Creating working directory
RUN mkdir -p ${WORK_DIR};
##Setting working directory
WORKDIR ${WORK_DIR}


##Setting the work repo to app
##WORKDIR ${APP_DIR_NAME}
##RUN npm install;

##Starting the package configuration

RUN wget -qO- -O tmp.zip $PACKAGE_URL \
    && unzip tmp.zip \
    && rm tmp.zip \
    && cd $APP_DIR_NAME \
    && npm install

WORKDIR ${APP_DIR_NAME}

CMD ["pm2", "start", "index.js"]
