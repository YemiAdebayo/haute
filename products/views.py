from django.views import ListView, DetailView
from django.shortcuts import render
from .models import Product

# Create your views here.


class ProductListView(ListView):
    model = Product
    queryset = Product.objects.all()
    template_name = "products/products-list.html"


class ProductDetailView(DetailView):
    model = Product
    template_name = "products/products-detail.html"
