# Generated by Django 4.2.18 on 2025-01-17 02:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('game', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='InGameUsers',
            fields=[
                ('id_user', models.AutoField(primary_key=True, serialize=False)),
            ],
        ),
    ]
