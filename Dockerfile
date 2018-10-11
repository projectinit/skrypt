# Each line of this Dockerfile creates a layer which will be cached
# The first build will work through each line and perform the task defined
# Every subsequent build will compare the image layer with the cache and will use the cache if the layer hasn't changed

# We'll use this image because it's lightweight and has almost everything we need
FROM mhart/alpine-node:6.14.3

# Install build-essential equivalent and python
RUN apk update && apk add dpkg-dev && apk add g++ && apk add gcc && apk add libc-dev && apk add make && apk add python

# Add everything from our local project directory to our container in the `/skrypt` directory
RUN mkdir /skrypt

# Make the `/skrypt` directory inside the container the work directory
WORKDIR /skrypt

# Now copy everything from host project directory root into `/skrypt` inside the app container
COPY . /skrypt

# Run `npm install` to install all of the dependencies in `package.json`
RUN npm install -g nodemon && npm install && npm rebuild bcrypt --build-from-source=bcrypt 

# Expose port `3000` so we can connect through that port
EXPOSE 3000

# Once everything is set the command `npm start` is run inside the app container
CMD ["npm", "start"]
