from django.urls import path
from . import views

urlpatterns = [
    path('pins/', views.get_pins, name='get_pins'),
    path('pins/add/', views.add_pin, name='add_pin'),
    path('pins/<int:pin_id>/delete/', views.delete_pin, name='delete_pin'),
    path('pins/stats/', views.stats, name='stats'),
    path('pins/public/', views.get_public_pins, name='get_public_pins'),
    path('pins/<int:pin_id>/update/', views.update_pin, name='update_pin'),
    path('pins/<int:pin_id>/copy/', views.copy_pin, name='copy_pin'),
]
