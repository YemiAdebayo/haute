from django.conf import settings
from django.contrib import admin
from django.conf.urls import include, url
from django.conf.urls.static import static
from django.urls import path
from django.contrib.auth import views as auth_views
from django.views.generic import TemplateView
from .views import (SignUpView, ajax_update_login_status,
                    sign_up_successful_view, ajax_login,
                    ajax_logout,
                    AjaxSignUpView
                    )

urlpatterns = [
    url(r'sign-up/$', SignUpView.as_view(), name="sign-up"),
    url(r'^sign-in/$', auth_views.LoginView.as_view(template_name='accounts/sign-in.html'), name="sign-in"),

    url(r'^sign-out/$', auth_views.LogoutView.as_view(
        template_name='accounts/sign-out.html'), name="sign-out"),

    url(r'^password-reset/$', auth_views.PasswordResetView.as_view(
        template_name='accounts/password-reset.html'), name="password-reset"),

    path('password_reset_confirm/<uidb64>/<token>/',
         auth_views.PasswordResetConfirmView.as_view(
             template_name='accounts/password-reset-confirm.html'),
         name="password_reset_confirm"),

    url(r'^password-reset/done/$', auth_views.PasswordResetDoneView.as_view(
        template_name='accounts/password-reset-done.html'), name="password_reset_done"),

    url(r'^password_reset_complete/$', auth_views.PasswordResetCompleteView.as_view(
        template_name='accounts/password-reset-complete.html'), name="password_reset_complete"),

    # url(r'sign-up-successful/$', sign_up_successful_view, name="sign-up-successful"),
    url(r'login-with-ajax/$', ajax_login, name="login-with-ajax"),
    url(r'logout-with-ajax/$', ajax_logout, name="logout-with-ajax"),
    url(r'signup-with-ajax/$', AjaxSignUpView.as_view(), name="signup-with-ajax"),
    url(r'update-login-status-with-ajax/$', ajax_update_login_status,
        name="update-login-status-with-ajax"),
    # url(r'dashboard/$', dashboard_view, name="dashboard"),
    # # url(r'profile/$', profile_update_view, name="profile"),
]
