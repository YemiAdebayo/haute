from django.contrib.auth import get_user_model
from django.db import models
from django.db.models.signals import post_save
from django.conf import settings
from .tasks import optimize_profile_picture


class Profile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )
    residential_address = models.CharField(
        max_length=200,
        blank=True,
        null=True
    )
    state_of_residence = models.CharField(
        max_length=20,
        blank=True,
        null=True
    )
    LGA_of_residence = models.CharField(
        max_length=20,
        blank=True,
        null=True
    )
    landmark_building = models.TextField(
        max_length=120,
        blank=True,
        null=True
    )
    profile_pic = models.ImageField(
        default='user.png', 
        upload_to='profile-pictures'
    )

    USERNAME_FIELD = 'user'

    def __str__(self):
        return f'{self.user.email}'

    
    def save(self, *args, **kwargs):
        super().save()
        optimize_profile_picture.delay()


def userprofile_receiver(sender, instance, created, *args, **kwargs):
    if created:
        userprofile = Profile.objects.create(user=instance)


post_save.connect(userprofile_receiver, sender=settings.AUTH_USER_MODEL)
