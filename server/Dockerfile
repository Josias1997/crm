FROM python:3.8-alpine

WORKDIR /crm/server
COPY requirements.txt /crm/server
RUN apk add --no-cache --virtual .build-deps mariadb-dev mariadb-client python3-dev build-base gcc jpeg-dev zlib-dev musl-dev
RUN pip install --no-cache-dir mysqlclient
RUN pip install --no-cache-dir django
RUN pip install --no-cache-dir Pillow
RUN pip install -r requirements.txt

EXPOSE 8000
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]