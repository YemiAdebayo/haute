# Generated by Django 3.1.2 on 2020-11-16 09:14

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Product',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=150)),
                ('slug', models.SlugField(default='someslug', max_length=150)),
                ('description', models.TextField(max_length=500)),
                ('image', models.ImageField(blank=True, null=True, upload_to='products/')),
                ('manufacturer', models.CharField(blank=True, max_length=300, null=True)),
                ('price', models.DecimalField(decimal_places=2, default=0.0, max_digits=20)),
                ('featured', models.BooleanField(default=False)),
                ('available', models.BooleanField(default=True)),
                ('timestamp', models.DateTimeField(auto_now_add=True, verbose_name='Added on')),
            ],
        ),
        migrations.CreateModel(
            name='ProductExtraImages',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(blank=True, null=True, upload_to='products/')),
                ('product', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='products.product')),
            ],
        ),
    ]
