# from django.db.models import query
from django.http import JsonResponse
from django.views.generic.list import ListView
# from django.shortcuts import render
from products.models import Product

# Create your views here.

class JsonableResponseMixin:
    """
    Mixin to add JSON support to a form.
    Must be used with an object-based FormView (e.g. CreateView)
    """
    def form_invalid(self, form):
        response = super().form_invalid(form)
        if self.request.accepts('text/html'):
            return response
        else:
            return JsonResponse(form.errors, status=400)

    def form_valid(self, form):
        # We make sure to call the parent's form_valid() method because
        # it might do some processing (in the case of CreateView, it will
        # call form.save() for example).
        response = super().form_valid(form)
        if self.request.accepts('text/html'):
            return response
        else:
            data = {
                'pk': self.object.pk,
            }
            return JsonResponse(data)

class ProductSearchView(ListView):
    queryset = Product.objects.all()
    template_name = "search/search.html"

    def get_context_data(self, *args, **kwargs):
        context = super(ProductSearchView, self).get_context_data(
            *args, **kwargs)

        query = self.request.GET.get("q")
        context["query"] = query
        return context

    def get_queryset(self, *args, **kwargs):
         request = self.request
         query = request.GET.get("q", None)
         if query is not None:
             return Product.objects.search(query)
         return Product.objects.featured()

