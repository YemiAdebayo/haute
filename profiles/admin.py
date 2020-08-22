# from django.contrib import admin
# from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
# from .models import Profile
# from .forms import ProfileUpdateFormForAdmin


# class ProfileUpdateAdmin(BaseUserAdmin):

#     form = ProfileUpdateFormForAdmin

#     list_display = (
#         'user',
#         'id',
#         'state_of_residence',
#     )

#     list_filter = (
#         'user__is_active',
#     )

#     fieldsets = (
#         ('User Information', {
#          'fields': (
#              'user',
#          )}
#          ),
#         ('Contact Address', {
#          'fields': (
#              'residential_address',
#              'LGA_of_residence',
#              'state_of_residence',
#              'landmark_building',
#          )}
#          ),
#     )

#     add_fieldsets = (
#         ('User Information', {
#          'fields': (
#              'user',
#          )}
#          ),
#         ('Contact Address', {
#          'fields': (
#              'residential_address',
#              'LGA_of_residence',
#              'state_of_residence',
#              'landmark_building',
#          )}
#          ),
#     )

#     # Please note that a ForeignKey such as "user" or ManyToManyKey can not be added to
#     # search_fields as shown in the next line of code. Doing so throws an exception.
#     # In order to make it work, "user" has to be written as "user__" followed by the field name
#     # you wish to access.
#     search_fields = (
#         'user__email',
#         'user__phone_number',
#     )
#     ordering = ('-id',)
#     filter_horizontal = ()


# # Register your models here.
# admin.site.register(Profile, ProfileUpdateAdmin)
