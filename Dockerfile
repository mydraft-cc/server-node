# to build mydraftcc
FROM alpine:latest as builder
RUN apk add --no-cache nodejs npm git bash
RUN git clone  https://git.mytinydc.com/Mytinydc/mydraftcc-nodejs-server.git \
    && cd mydraftcc-nodejs-server \
    && git submodule update --init
WORKDIR /mydraftcc-nodejs-server
# If you want to patch with "optional"
ARG PATCHOPTIONS
RUN ./patch.sh "${PATCHOPTIONS}"
RUN cd ui && npm install && npm run build

# Final image server and built ui from previous step
FROM alpine:latest as main
RUN apk add --no-cache nodejs npm
COPY --from=builder /mydraftcc-nodejs-server/server /
COPY --from=builder /mydraftcc-nodejs-server/ui/build /public
# install and volumes mounpoint logs data
RUN npm install \
    && mkdir /data /logs

# run with user/group 1000
USER 1000:1000
# exposed port
EXPOSE 4000
# Env Vars
ENV IPADDRESS=0.0.0.0
ENV PORT=4000
# Storage: maximum size of the drawing file
#          (2Mo : 2 * 1024 * 1024) = 2097152
ENV JSONMAXSIZE=2097152


CMD ["/usr/bin/node","/app.js"]
