from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib import admin
from django.contrib.auth import get_user_model
from django.db import models
from django.contrib.auth.models import Group
from .forms import UserAdminCreationForm, UserAdminChangeForm
from profiles.models import Profile


User = get_user_model()


class ProfileInline(admin.StackedInline):
    model = Profile
    can_delete = False
    verbose_name_plural = 'profile'


class UserAdmin(BaseUserAdmin):

    inlines = (ProfileInline,)

    # The forms to add and change user instances
    form = UserAdminChangeForm
    add_form = UserAdminCreationForm

    """
        The fields to be used in displaying the User model. 
        These override the definitions in the BaseUserAdmin 
        that reference specific fields on auth.User.
    """

    list_display = (
        'email',
        'first_name',
        'last_name',
        'phone_number',
        'is_admin',
        'id',
        'timestamp',
    )

    list_filter = (
        'is_admin',
        'is_staff',
        'is_active',
    )

    fieldsets = (
        (None, {'fields': (
            'email',
            'password',
        )}),
        ('Personal info', {
         'fields': (
             'first_name',
             'last_name',
             'phone_number'
         )}),
        ('Permissions', {'fields': (
            'is_admin',
            'is_staff',
            'is_active',
        )}),
    )

    """
        add_fieldsets is not a standard ModelAdmin attribute. UserAdmin 
        overrides get_fieldsets to use this attribute when creating a user.
    """

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': (
                'first_name',
                'last_name',
                'phone_number',
                'email',
                'password1',
                'password2'
            )}
         ),
    )

    search_fields = (
        'email',
        'last_name',
        'phone_number'
    )

    ordering = ('-id',)
    filter_horizontal = ()


admin.site.register(User, UserAdmin)

# Remove Group Model from admin. We're not using it.
admin.site.unregister(Group)
