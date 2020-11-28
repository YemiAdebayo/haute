
from django.urls import path
# from home.views import HomeListView
from .views import ProductSearchView


app_name = 'search'
urlpatterns = [
    path('', ProductSearchView.as_view(), name='list'),
]
