
from django.contrib import admin
from django.urls import include, path
from .views import ProductDetailView, ProductListView


app_name = 'products'
urlpatterns = [
    path('', ProductListView.as_view(), name='all-products'),
    path('<slug:slug>/', ProductDetailView.as_view(), name='detail')
]