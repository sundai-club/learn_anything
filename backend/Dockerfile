FROM python:3.8-slim

RUN apt-get update && apt-get install -y

WORKDIR .

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["python", "app.py", "--no-browser"]