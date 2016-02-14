FROM node:4.3.0
MAINTAINER Srinath Janakiraman <me@vjsrinath.com>

ENV SERVICE_VERSION_MAJOR=1.0
ENV SERVICE_VERSION_MINOR=1.0.0
ENV WORK_DIR=/srv/www/ludicrum-authentication
## ENV NODE_ENV

##RUN apt-get install build-essential libavahi-compat-libdnssd-dev
RUN apt-get update \
    && npm install pm2@latest -g

##Creating working directory
RUN mkdir -p ${WORK_DIR};
##Setting working directory
WORKDIR ${WORK_DIR}

ONBUILD COPY package.json ./
ONBUILD RUN npm install
ONBUILD COPY . ./

RUN npm install
ENTRYPOINT ["pm2"]
CMD ["start", "index.js"]
