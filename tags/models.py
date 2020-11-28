from django.db import models
from products.models import Product
from django.db.models.signals import pre_save
from django.dispatch import receiver
from products.utils import product_unique_slug_generator

# Create your models here.

class Tag(models.Model):
    name        =   models.CharField(max_length=120, blank=True, null=True)
    slug        =   models.SlugField(blank=True, null=True)
    active      =   models.BooleanField(default=True)
    timestamp   =   models.DateTimeField(auto_now_add=True)
    products    =   models.ManyToManyField(Product, blank=True)

    def __str__(self):
        return self.name


@receiver(pre_save, sender=Tag)
def tag_pre_save_receiver(sender, instance, *args, **kwargs):
    if not instance.slug:
        instance.slug = product_unique_slug_generator(instance)
