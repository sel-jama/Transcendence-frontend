
FROM python:3.9-slim


RUN apt-get update && apt-get install -y --no-install-recommends \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/* \
    && pip install --upgrade pip


WORKDIR /app


COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt


COPY entrypoint.sh .
RUN chmod +x entrypoint.sh

# Copy rest of the code
COPY . .


ENTRYPOINT ["sh", "entrypoint.sh"]
# CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
