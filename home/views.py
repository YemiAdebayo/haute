from django.shortcuts import render
from django.views.generic import (
    ListView,
    DetailView,
)

# Create your views here.


class HomeListView(ListView):
    template_name = 'index.html'

    def get_queryset(self):
        pass
