# Generated by Django 3.0.5 on 2020-04-30 21:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0009_auto_20200424_1727'),
    ]

    operations = [
        migrations.AddField(
            model_name='client',
            name='card_info',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='client',
            name='password',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AlterField(
            model_name='client',
            name='token',
            field=models.CharField(default='FIMVg5-MWvPlQo1k1szCRPzOgMTUAEJCkOIb5oP9mfA', max_length=255),
        ),
    ]
