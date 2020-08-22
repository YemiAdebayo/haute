from django.db import models
# Create your models here.
from django.contrib.auth.models import (
    BaseUserManager, AbstractBaseUser
)
from django.db import models
from datetime import datetime


class UserManager(BaseUserManager):

    def create_user(
        self, email,
        first_name,
        last_name,
        phone_number,
        is_active=True,
        is_staff=False,
        is_admin=False,
        password=None
    ):
        """
            Creates and saves a User with the given firstname, 
            lastname, phone number, email and password.
        """
        if not email:
            raise ValueError('You must provide an email address')
        if not first_name:
            raise ValueError('You must provide a first name')
        if not last_name:
            raise ValueError('You must provide a last name')
        if not phone_number:
            raise ValueError('You must provide a contact number')

        user = self.model(
            email=self.normalize_email(email),
            first_name=first_name,
            last_name=last_name,
            phone_number=phone_number,
        )

        user.set_password(password)
        user.is_active = is_active
        user.is_staff = is_staff
        user.is_admin = is_admin
        user.save(using=self._db)
        return user

    def create_staffuser(
        self,
        email,
        first_name,
        last_name,
        phone_number,
        is_active=True,
        is_staff=True,
        is_admin=False,
        password=None
    ):
        """
            Creates and saves a staff user with the given 
            firstname, lastname, phone number,  email and password.
        """
        user = self.create_user(email,
                                first_name,
                                last_name,
                                phone_number,
                                password=password,
                                )
        user.is_staff = is_staff
        user.is_active = is_active
        user.is_admin = is_admin
        user.save(using=self._db)
        return user

    def create_superuser(
        self,
        email,
        first_name,
        last_name,
        phone_number,
        is_active=True,
        is_staff=True,
        is_admin=True,
        password=None
    ):
        """
        Creates and saves a superuser with the given firstname,
        lastname, phone number,  email and password.
        """
        user = self.create_user(
            email,
            first_name,
            last_name,
            phone_number,
            password=password,
        )
        user.is_staff = is_staff
        user.is_active = is_active
        user.is_admin = is_admin
        user.save(using=self._db)
        return user


class User(AbstractBaseUser):
    """
        This User model overides django's default user so as to be able to add
        properties (and methods?) not provided by the default User moder
    """

    email = models.EmailField(
        verbose_name='email address',
        max_length=255,
        unique=True,
        default=''
    )

    first_name = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )

    last_name = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )

    phone_number = models.CharField(
        max_length=18,
        blank=True,
        null=True
    )

    timestamp = models.DateTimeField(
        auto_now_add=True,

        verbose_name="Joined on",
    )

    # ensures that user is not a staff by default
    is_staff = models.BooleanField(default=False)

    # ensures that user is not a superuser by default
    is_admin = models.BooleanField(default=False)

    # all user accounts are active by default
    is_active = models.BooleanField(default=True)

    """
        Notice the absence of a "Password field", that's built-in 
        and available by default. So we do not need to state it here
    """

    objects = UserManager()
    USERNAME_FIELD = 'email'

    # Email & Password are required by default.
    REQUIRED_FIELDS = ['first_name', 'last_name', 'phone_number']

    def get_first_name(self):
        # The user is identified by first name
        return self.first_name

    def get_last_name(self):
        # The user is identified by last name
        return self.last_name

    def get_phone_number(self):
        # The user is identified by phone number
        return self.phone_number

    def __str__(self):
        return self.email

    def has_perm(self, perm, obj=None):
        """
            Grants specific (minimal) permission to all
            users by default.
        """
        return True

    def has_module_perms(self, app_label):
        "Does the user have permissions to view the app `app_label`?"
        # Simplest possible answer: Yes, always
        return True

    @property
    def staff(self):
        "Is the user a member of staff?"
        return self.is_staff

    @property
    def admin(self):
        "Is the user a admin member?"
        return self.is_admin

    @property
    def active(self):
        "Is the user account still active?"
        return self.is_active

    """
        Not to self: fields in a model (e.g, is_active) can not have the same name 
        as properties on the same model (e.g @propertyis_active). If they do, the property will over-write 
        the field at the time of migration. So what django sees is a property name is_active, 
        and not a filed. I had a headache dealing with this.
    """
