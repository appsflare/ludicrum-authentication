FROM node:4.3.0
MAINTAINER Srinath Janakiraman <me@vjsrinath.com>

ENV SERVICE_VERSION=1.0.0
ENV WORK_DIR=/srv/www/ludicrum-authentication
## ENV NODE_ENV

##RUN apt-get install build-essential libavahi-compat-libdnssd-dev
RUN apt-get update \
    && npm install pm2@latest -g

##Creating working directory
RUN mkdir -p ${WORK_DIR};
##Setting working directory
WORKDIR ${WORK_DIR}

COPY ["lib","model","plugins","routes", "views","config.js","*.js","*.json","./"]
RUN npm install
ENTRYPOINT ["pm2"]
CMD ["start", "index.js"]
