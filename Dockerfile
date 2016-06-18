FROM node:latest
EXPOSE 3000
COPY . /app/
RUN cd /app && npm install
ENV NODE_ENV production
ENV PORT 3000
CMD /app/bin/www