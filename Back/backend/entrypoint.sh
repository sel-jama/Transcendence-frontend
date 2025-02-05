#!/bin/sh
# echo "Database connection info:"
# echo "Host: db"
# echo "Database: $POSTGRES_DB"
# echo "User: $POSTGRES_USER"

# # Wait until PostgreSQL is ready
# while ! pg_isready -h db -p 5432 -U $POSTGRES_USER
# do
#     echo "Waiting for postgres..."
#     sleep 2
# done

echo "Running migrations..."
python manage.py makemigrations  ft_42auth user_service game --noinput
python manage.py migrate --noinput
python manage.py collectstatic --noinput
python manage.py runserver 0.0.0.0:8000

echo "Starting Django server..."

exec "$@"
