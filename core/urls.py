from django.urls import path
from django.shortcuts import redirect
from . import views

urlpatterns = [
    path('', views.react_app, name='home'),
    path('ueber-uns/', views.react_app, name='about'),
    path('datenschutz/', views.react_app, name='privacy'),
    path('services/', views.react_app, name='services'),
    path('branchen/', views.react_app, name='branchen'),
    path('industries/', lambda req: redirect('branchen', permanent=True)),
    path('testimonials/', views.react_app, name='testimonials'),
    path('kontakt/', views.react_app, name='kontakt'),
    path('contact/', lambda req: redirect('kontakt', permanent=True)),
    path('impressum/', views.react_app, name='impressum'),
    path('robots.txt', views.robots_txt, name='robots'),
    path('llms.txt', views.llms_txt, name='llms'),
]
