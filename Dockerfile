from node:9.11
ADD . /code
WORKDIR /code
RUN npm install
RUN npm install -g nodemon
CMD [ "node", "app.js" ]