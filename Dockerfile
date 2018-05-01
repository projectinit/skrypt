from node:9.11
ADD . /code
WORKDIR /code
RUN npm install
ENTRYPOINT [ "node" ]
CMD [ "app.js" ]