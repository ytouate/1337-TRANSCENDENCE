FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

ENTRYPOINT [ "sh" , "script_nest.sh"]

CMD ["npm", "run", "start:dev"]