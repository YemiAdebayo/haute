from decimal import Decimal
from django.conf import settings
from django.db import models
from django.dispatch import receiver
from django.db.models.signals import pre_save, m2m_changed

from products.models import Product, product_pre_save_receiver


User = settings.AUTH_USER_MODEL

class CartManager(models.Manager):
    def new_or_get(self, request):
        cart_id = request.session.get("cart_id", None)
        qs = self.get_queryset().filter(id=cart_id)
        if qs.count() == 1:
            #This checks is cart already exits and links an authenticated user to current cart
            new_obj     =  False
            cart_obj    =  qs.first()
            if request.user.is_authenticated() and cart_obj.user is None:
                cart_obj.user = request.user
                cart_obj.save()
        else:
            #This creates a new cart and links it with an authenticated user
            cart_obj = Cart.objects.new(user=request.user)
            new_obj = True
            request.session['cart_id'] = cart_obj.id
        return cart_obj, new_obj

    def new(self, user=None):
        #Replaces Cart.objects.create(*args, **kwargs) method so that we can perform extra logic
        user_obj = None
        if user is not None:
            if user.is_authenticated():
                user_obj = user
        return self.model.objects.create(user=user_obj)

class Cart(models.Model):
    user        = models.ForeignKey(User, null=True, blank=True, on_delete=models.CASCADE)
    products    = models.ManyToManyField(Product, blank=True)
    subtotal    = models.DecimalField(default=0.00, max_digits=100, decimal_places=2)
    total       = models.DecimalField(default=0.00, max_digits=100, decimal_places=2)
    updated     = models.DateTimeField(auto_now=True)
    timestamp   = models.DateTimeField(auto_now_add=True)

    objects = CartManager()

    def __str__(self):
        return str(self.id)

class CartItem(models.Model):
    product     = models.ForeignKey(Product, blank=False, null=False,on_delete=models.CASCADE)
    quantity    = models.PositiveIntegerField(default=1)


@receiver(m2m_changed, sender=Cart.products.through)
def m2m_changed_cart_receiver(sender, instance, action, *args, **kwargs):
    products = instance.products.all()
    total = 0
    for x in products:
        total += x.price
    if instance.subtotal != total:
        instance.subtotal = total
        instance.save()

@receiver(pre_save, sender=Cart)
def cart_pre_save_receiver(sender, instance, *args, **kwargs):
    if instance.subtotal > 0:
        instance.total = Decimal(instance.subtotal) * Decimal(1.08) # 8% tax
    else:
        instance.total = 0.00
