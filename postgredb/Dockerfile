FROM debian:stable-20220418-slim

#---Setting repos---
RUN apt update --yes \ 
	&& apt upgrade --yes

#---install---
RUN apt install --yes postgresql \
	vim

#---port exposition---
EXPOSE 5432/tcp

COPY pg_hba.conf /etc/postgresql/13/main/pg_hba.conf
COPY setup.sql /tmp/setup.sql

CMD service postgresql start \
	&& psql -U postgres < /tmp/setup.sql \
	&& sh
