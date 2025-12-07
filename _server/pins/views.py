from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from .models import Pin
import json
# Create your views here.

@login_required
def get_pins(request):
    pins = Pin.objects.filter(user = request.user)
    pin_data = []
    for pin in pins:
        pin_data.append({
            'id': pin.id,
            'title': pin.title,
            'description': pin.description,
            'latitude': pin.latitude,
            'longitude': pin.longitude,
            'image':  pin.image.url if pin.image else None,
            'created_at': pin.created_at.isoformat(),
            "status": pin.status,
            "is_public": pin.is_public,
        })
    return JsonResponse(list(pins), safe=False)

@login_required
@csrf_exempt
def add_pin(request):
    if request.method == 'POST':
     
        if request.content_type and 'multipart/form-data' in request.content_type:

            image = request.FILES.get('image') if 'image' in request.FILES else None
            pin = Pin.objects.create(
                user=request.user,
                title=request.POST.get('title'),
                description=request.POST.get('description', ''),
                latitude=float(request.POST.get('latitude')),
                longitude=float(request.POST.get('longitude')),
                image=image,
                is_public=request.POST.get('is_public', 'true').lower() == 'true',
                status=request.POST.get('status', 'wishlisted'),
            )
        else:
            data = json.loads(request.body)
            pin = Pin.objects.create(
                user=request.user,
                title=data.get('title'),
                description=data.get('description'),
                latitude=data.get('latitude'),
                longitude=data.get('longitude'),
                is_public=data.get('is_public', True),
                status=data.get('status', 'wishlisted'),
            )
        
        return JsonResponse({
            'id': pin.id,
            'title': pin.title,
            'description': pin.description,
            'latitude': pin.latitude,
            'longitude': pin.longitude,
            'image': pin.image.url if pin.image else None,
            'created_at': pin.created_at.isoformat(),
            "status": pin.status,
            "is_public": pin.is_public,
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
