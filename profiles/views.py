from django.shortcuts import render
from django.views.generic import (ListView,)

# Create your views here.


class ProductListView(ListView):
    template_name = 'products-list.html'
