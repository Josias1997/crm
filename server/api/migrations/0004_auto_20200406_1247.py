# Generated by Django 2.2 on 2020-04-06 12:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_auto_20200406_1128'),
    ]

    operations = [
        migrations.AlterField(
            model_name='client',
            name='date_reglement',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]
