from django.db import models

# Create your models here.


class ProductManager():
    pass


class Product(models.Model):
    'The creates a Product model'
    name = models.CharField(max_length=150)
    slug = models.SlugField(max_length=150, default='someslug')
    description = models.TextField(max_length=500)
    image = models.ImageField(upload_to='media/product_photo', blank=True)
    manufacturer = models.CharField(max_length=300, blank=True)
    price = models.DecimalField(max_digits=20, decimal_places=2, default=00.00)
    featured = models.BooleanField(default=False)
    available = models.BooleanField(default=True)

    def __str__(self):
        return self.name
    objects = ProductManager
