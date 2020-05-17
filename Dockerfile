FROM node:alpine

# Create app directory
WORKDIR /usr/src/app

# COPY package.json .
# For npm@5 or later, copy package-lock.json as well
COPY package.json package-lock.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

EXPOSE 3000

# Start Node Dev server
CMD ["npm", "run", "start.dev"]

# With node_modules
#CMD ["/bin/sh", "-c", "mkdir -p /usr/src/tmpapp && cp -R /usr/src/app/node_modules /usr/src/tmpapp && npm start"]
