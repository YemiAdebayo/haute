from django.db import models

# Create your models here.

class Product(models.Model):
    name = models.CharField(max_length=300)
    slug = models.SlugField(max_length=150)
    description = models.TextField()
    image = models.ImageField(upload_to='media/product_photo', blank=True)
    manufacturer = models.CharField(max_length=300, blank=True)
    price = models.DecimalField(max_digits=6, decimal_places=2)
