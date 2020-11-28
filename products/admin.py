from django.contrib import admin
from .models import Product, ProductExtraImages
from tags.models import Tag

# Register your models here.

class ProductExtraImagesInline(admin.StackedInline):
    model = ProductExtraImages
    can_delete = False
    verbose_name_plural = 'extra-images'

class ProductExtraTagsInline(admin.StackedInline):
    model = Tag.products.through
    can_delete = False
    verbose_name_plural = 'extra-tags'

class ProductAdmin(admin.ModelAdmin):

    inlines = (ProductExtraImagesInline, ProductExtraTagsInline,)

    list_display = (
        'name',
        # 'id',
        'price',
        'available',
        'featured',
        'timestamp',
    )

    list_filter = (
        'featured',
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
            # 'id',
            'description',
        )}),
        ('Product info', {
         'fields': (
             'price',
             'slug',
             'manufacturer',
             'available',
             'featured',
             'image',
         )}),
    )

admin.site.register(Product, ProductAdmin)
