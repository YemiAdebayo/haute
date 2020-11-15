from django.contrib import admin
from .models import Product, ProductExtraImages

# Register your models here.

class ProductExtraImagesInline(admin.StackedInline):
    model = ProductExtraImages
    can_delete = False
    verbose_name_plural = 'extra-images'

class ProductAdmin(admin.ModelAdmin):

    inlines = (ProductExtraImagesInline,)

    list_display = (
        'name',
        'id',
        'price',
        'available',
        'timestamp',
    )

    list_filter = (
        'available',
    )

    search_fields = (
        'name',
        'slug',
        'manufacturer'
    )

    fieldsets = (
        (None, {'fields': (
            'name',
            'id',
        )}),
        ('Product info', {
         'fields': (
             'price',
             'slug',
             'manufacturer',
             'available',
         )}),
    )


admin.site.register(Product, ProductAdmin)
