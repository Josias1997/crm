FROM node:current-slim

# Configure the main working directory inside the docker image. 
# This is the base directory used in any further RUN, COPY, and ENTRYPOINT 
# commands.
WORKDIR /crm/client

# Copy the package.json and install 
# the dependencies. This is a separate step so the dependencies 
# will be cached unless changes to one of those two files 
# are made.
COPY package.json /crm/client
RUN npm install

COPY . /crm/client

EXPOSE 3000
CMD ["npm", "start"]