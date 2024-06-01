
from django.shortcuts import render

def cart_home(request):
    request.session['cart_id'] = 123
    request.session['user'] = request.user.username
    return render(request, "carts/home.html", {} )