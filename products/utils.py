import os
import random
import string
from django.utils.text import slugify

def random_string_generator(size=10, chars=string.ascii_lowercase + string.digits):
    return ''.join(random.choice(chars) for _ in range(size))


def product_unique_slug_generator(instance, new_slug=None):
    """
        This is assumes the Product Model has a 'name' field (a charField) and creates a slug from the name of the product.
    """
    if new_slug is not None:
        slug = new_slug
    else:
        slug = slugify(instance.name)

    Klass = instance.__class__
    qs_exists = Klass.objects.filter(slug=slug).exists()
    if qs_exists:
        new_slug = "{slug}-{randstr}".format(
                    slug=slug,
                    randstr=random_string_generator(size=5)
                )
        return product_unique_slug_generator(instance, new_slug=new_slug)
    return slug

def get_product_image_ext(imagepath):
    base_name = os.path.basename(imagepath)
    name, ext = os.path.splitext(base_name)
    return ext

def rename_product_image(instance, image_name):
    slug_name = instance.slug
    ext = get_product_image_ext(image_name)
    new_img_name = f'{slug_name}{ext}'
    return f'products/{new_img_name}'