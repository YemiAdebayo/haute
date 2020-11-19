from django.views.generic.list import ListView
from django.views.generic.detail import DetailView
from django.shortcuts import render
from .models import Product

# Create your views here.

class ProductListView(ListView):
    queryset = Product.objects.all()
    template_name = "products/products-list.html"

    def get_context_data(self, *args, **kwargs):
        context = super(ProductListView, self).get_context_data(*args, **kwargs)
        print(context)
        return context

class ProductDetailView(DetailView):
    model = Product
    template_name = "products/products-detail.html"

