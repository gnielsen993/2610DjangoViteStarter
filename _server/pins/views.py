from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from .models import Pin
import json
# Create your views here.

@login_required
def get_pins(request):
    pins = Pin.objects.filter(user = request.user).values(
        'id', 'title', 'description', 'latitude', 'longitude', 'image', 'created_at', 'updated_at'
    )
    return JsonResponse(list(pins), safe=False)

@login_required
@csrf_exempt
def add_pin(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        pin = Pin.objects.create(
            user=request.user,
            title=data['title'],
            description=data['description'],
            latitude=data['latitude'],
            longitude=data['longitude'],
            image=data.get('image', None)
        )
        return JsonResponse({
            'id': pin.id,
            'title': pin.title,
            'description': pin.description,
            'latitude': pin.latitude,
            'longitude': pin.longitude,
            'image': pin.image.url if pin.image else None,
            'created_at': pin.created_at,
            'updated_at': pin.updated_at
        })
    return JsonResponse({'error': 'Invalid request method'}, status=400)

@login_required
@csrf_exempt
def delete_pin(request, pin_id):
    if request.method == 'DELETE':
        try:
            pin = Pin.objects.get(id=pin_id, user=request.user)
            pin.delete()
            return JsonResponse({'success': True})
        except Pin.DoesNotExist:
            return JsonResponse({'error': 'Pin not found'}, status=404)
    return JsonResponse({'error': 'Invalid request method'}, status=400)
