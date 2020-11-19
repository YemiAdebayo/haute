from django.shortcuts import render
from django.views.generic.list import ListView
from products.models import Product

from products.views import ProductListView

# Create your views here.


class HomeListView(ProductListView):
    template_name = "index.html"

    # def get_queryset(self):
    #     pass
