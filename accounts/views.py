from django.http import request
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import get_user_model, authenticate, login
from django.views.generic import CreateView, FormView
from django.http import JsonResponse, HttpResponseNotFound
from django.contrib.auth.decorators import login_required
from django.http import HttpResponseForbidden
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.conf import settings
from django.views.decorators.csrf import ensure_csrf_cookie
# from templated_email import send_templated_mail
from django.core.exceptions import RequestAborted

from .forms import RegistrationForm

User = get_user_model()
class SignUpView(CreateView):
    form_class = RegistrationForm
    template_name = 'accounts/sign-up.html'
    success_url = 'sign-up-successful/'

    def form_valid(self, form):
        first_name = form.instance.first_name
        last_name = form.instance.last_name
        phone_number = form.instance.phone_number
        email = form.instance.email

        # send_templated_mail(
        #     template_name='welcome',
        #     from_email=settings.DEFAULT_FROM_EMAIL,
        #     recipient_list=[email],
        #     context={
        #         'username': 'Haute Couture',
        #         'first_name': first_name,
        #     },
        # )

        # send_templated_mail(
        #     template_name='signup_notification',
        #     from_email=settings.DEFAULT_FROM_EMAIL,
        #     recipient_list=['yemi.adebayo@brilliant.ng'],
        #     context={
        #         'username': 'Brilliant Nigeria',
        #         'first_name': first_name,
        #         'last_name': last_name,
        #         'phone_number': phone_number,
        #         'email': email,
        #     },
        # )
        return super(SignUpView, self).form_valid(form)


def sign_up_successful_view(request):
    return render(request, "accounts/sign-up-successful.html")


def ajax_login(request):
    if request.method == 'POST':
        # Check if the request is ajax
        if request.is_ajax():
            username = request.POST['username']
            password = request.POST['password']
            user = authenticate(request, username=username, password=password)
            if user is not None:
                try:
                    login(request, user)
                    data = {
                        'message': f'<hr><div class="d-flex flex-column justify-content-center align-items-center" style="min-height: 240px;"><h5 class="p-2 mx-2 my-0 h5-font-style text-center" style="font-size: 3em;"><span class="px-2 text-success"><i class="fas fa-user-check"></i></span></h5><h5 class="p-2 m-1 h5-font-style text-center text-blue" style="font-size: .9em;">Welcome back <strong class="text-success">{user.first_name}</strong>! You have successfully logged in. Please close this window to continue browsing.</h5></div><div class="modal-footer"><button type="button" class="btn btn-secondary rounded-lg" data-dismiss="modal">Close</button></div>',
                        'redirect-url': '/', 'status':200
                       }
                    return JsonResponse(data, status=200)
                except RequestAborted:
                    data = {
                        'message': f'<hr><div class="d-flex flex-column justify-content-center align-items-center" style="min-height: 240px;"><h5 class="p-2 mx-2 my-0 h5-font-style text-center" style="font-size: 3em;"><span class="px-2 text-success"><i class="fas fa-user-check"></i></span></h5><h5 class="p-2 m-1 h5-font-style text-center text-blue" style="font-size: .9em;">Request timeout! Try again in few minutes</h5></div><div class="modal-footer"><button type="button" class="btn btn-secondary rounded-lg" data-dismiss="modal">Close</button></div>',
                        'redirect-url': '/', 'status':408
                       }
                    return JsonResponse(data, status=408)
            else:
                data = {'message': 'Username or password is incorrect!', "status": 401}
                return JsonResponse(data, status=401)

        else:
            print('Hard to tell if Request is Ajax!')
            return HttpResponseNotFound("Oops! We can't find this page!!")

    else:
        return render(request, 'index.html')

@ensure_csrf_cookie
def ajax_update_login_status(request):
    return render(request, "accounts/ajax-update-login-status.html")

def ajax_logout(request):
    if request.method == 'GET':
        #Check if the request is ajax
        if request.is_ajax():
            print('Request is Ajax!')
            logout(request)
            data = {
                        'message': f'<hr><div class="d-flex flex-column justify-content-center align-items-center" style="min-height: 240px;"><h5 class="p-2 mx-2 my-0 h5-font-style text-center" style="font-size: 3em;"><span class="px-2 text-success"><i class="fas fa-user-check"></i></span></h5><h5 class="p-2 m-1 h5-font-style text-center text-blue" style="font-size: .9em;">You have successfully logged out. Please close this window to continue browsing.</h5></div><div class="modal-footer"><button type="button" class="btn btn-secondary rounded-lg" data-dismiss="modal">Close</button></div>',
                        'redirect-url': '/', "status": 200,
                       }
            return JsonResponse(data, status=200)

        else:
            print('Hard to tell if Request is Ajax!')
    else:
        return render(request, 'home')
