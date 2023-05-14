FROM node:16.20.0-alpine
COPY ./package.*json \
  ./pnpm-lock.yaml ./
COPY . ./

RUN export $(cat .env | xargs)

RUN apk update \
  && apk upgrade

RUN npm cache clean -f \
  && npm i npm -g \
  && npm i pnpm -g \
  && pnpm i \
  && npm run build

RUN rm -rf .env

EXPOSE 3000
CMD npm start