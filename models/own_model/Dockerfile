FROM python:3.10

WORKDIR /app

COPY requirements.txt ./requirements.txt

RUN pip install --no-cache-dir -r requirements.txt

COPY emotion.db ./emotion.db
COPY mlruns ./mlruns

EXPOSE 5000

CMD ["mlflow", "ui", "--host", "0.0.0.0", "--port", "5000", "--backend-store-uri", "sqlite:///emotion.db"]
