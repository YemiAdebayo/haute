from django.db import models
from django.db.models.signals import pre_save
from django.urls import reverse
from django.dispatch import receiver
# from .models import Product
from .utils import product_unique_slug_generator

# Create your models here.

class ProductQuerySet(models.query.QuerySet):
    def active(self):
        return self.filter(available=True)
        
    def featured(self):
        return self.filter(featured=True, available=True)

class ProductManager(models.Manager):
    def get_queryset(self):
        return ProductQuerySet(self.model, using=self._db)

    def all(self):
        return self.get_queryset.active()

    def featured(self):
        return self.get_queryset.featured()

    def get_by_id(self, id):
        qs = self.get_queryset.filter(id=id)
        if qs.count == 1:
            return qs.first()
        return None


class Product(models.Model):
    """
        This model adds new product to the database. Admin access only
    """
    name = models.CharField(max_length=150)
    slug = models.SlugField(max_length=150, blank=True)
    description = models.TextField(max_length=500)
    image = models.ImageField(upload_to='products/', null=True, blank=True)
    manufacturer = models.CharField(max_length=300, null=True, blank=True)
    price = models.DecimalField(max_digits=20, decimal_places=2, default=00.00)
    featured = models.BooleanField(default=False)
    available = models.BooleanField(default=True)
    timestamp = models.DateTimeField(auto_now_add=True, verbose_name="Added on",)

    def __str__(self):
        return self.name

    objects = ProductManager

    def get_absolute_url(self):
        return reverse('products:detail',kwargs={"slug" : self.slug})


class ProductExtraImages(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    image = models.ImageField(upload_to='products/', null=True, blank=True)

@receiver(pre_save, sender=Product)
def product_pre_save_receiver(sender, instance, *args, **kwargs):
    if not instance.slug:
        instance.slug = product_unique_slug_generator(instance)
