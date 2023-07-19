FROM node:14

WORKDIR /app

COPY package*.json ./

RUN npm i

COPY . ./

RUN npx prisma generate

RUN chmod +x scipt_nest.sh

ENTRYPOINT [ "sh", "scipt_nest.sh" ]

CMD ["npm", "run", "start:dev"]