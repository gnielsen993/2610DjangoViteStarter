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
            'sections': pin.sections,
            'latitude': pin.latitude,
            'longitude': pin.longitude,
            'image':  pin.image.url if pin.image else None,
            'created_at': pin.created_at.isoformat(),
            "status": pin.status,
            "is_public": pin.is_public,
            "category": pin.category,
        })
    return JsonResponse(pin_data, safe=False)

@login_required
@csrf_exempt
def add_pin(request):
    if request.method == 'POST':
     
        if request.content_type and 'multipart/form-data' in request.content_type:

            image = request.FILES.get('image') if 'image' in request.FILES else None
            sections = json.loads(request.POST.get('sections', '[]'))
            pin = Pin.objects.create(
                user=request.user,
                title=request.POST.get('title'),
                sections = sections,
                latitude=float(request.POST.get('latitude')),
                longitude=float(request.POST.get('longitude')),
                image= image,
                is_public=request.POST.get('is_public', 'true').lower() == 'true',
                status=request.POST.get('status', 'wishlisted'),
                category=request.POST.get('category', 'other'),
            )
        else:
            data = json.loads(request.body)
            pin = Pin.objects.create(
                user=request.user,
                title=data.get('title'),
                sections=data.get('sections', []),
                latitude=data.get('latitude'),
                longitude=data.get('longitude'),
                is_public=data.get('is_public', True),
                status=data.get('status', 'wishlisted'),
                category=data.get('category', 'other'),
            )
        
        return JsonResponse({
            'id': pin.id,
            'title': pin.title,
            'sections': pin.sections,
            'latitude': pin.latitude,
            'longitude': pin.longitude,
            'image': pin.image.url if pin.image else None,
            'created_at': pin.created_at.isoformat(),
            "status": pin.status,
            "is_public": pin.is_public,
            "category": pin.category,
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


@login_required
def stats(request):
    pins = Pin.objects.filter(user=request.user)
    total_pins = pins.count()
    wishlisted_pins = pins.filter(status='wishlisted').count()
    visited_pins = pins.filter(status='visited').count()
    favorite_pins = pins.filter(status='favorite').count()

    trip_pins = pins.filter(category='trip').count()
    hotel_pins = pins.filter(category='hotel').count()
    restaurant_pins = pins.filter(category='restaurant').count()
    attraction_pins = pins.filter(category='attraction').count()
    other_pins = pins.filter(category='other').count()

    data = {
        'total_pins': total_pins,
        'wishlisted_pins': wishlisted_pins,
        'visited_pins': visited_pins,
        'favorite_pins': favorite_pins,
        'trip_pins': trip_pins,
        'hotel_pins': hotel_pins,
        'restaurant_pins': restaurant_pins,
        'attraction_pins': attraction_pins,
        'other_pins': other_pins,
    }
    return JsonResponse(data)

def get_public_pins(request):
    pins = Pin.objects.filter(is_public=True)
    pin_data = []
    for pin in pins:
        pin_data.append({
            'id': pin.id,
            'title': pin.title,
            'sections': pin.sections,
            'latitude': pin.latitude,
            'longitude': pin.longitude,
            'image':  pin.image.url if pin.image else None,
            'created_at': pin.created_at.isoformat(),
            "status": pin.status,
            "is_public": pin.is_public,
            "category": pin.category,
        })
    return JsonResponse(pin_data, safe=False)

@login_required
@csrf_exempt
def update_pin(request, pin_id):
    if request.method == 'PUT':
        try:
            pin = Pin.objects.get(id=pin_id, user=request.user)
            
            if request.content_type and 'multipart/form-data' in request.content_type:
                pin.title = request.POST.get('title', pin.title)
                sections_data = request.POST.get('sections')
                if sections_data:
                    pin.sections = json.loads(sections_data)
                pin.status = request.POST.get('status', pin.status)
                pin.category = request.POST.get('category', pin.category)
                pin.is_public = request.POST.get('is_public', 'true').lower() == 'true'
                
                if 'image' in request.FILES:
                    pin.image = request.FILES['image']
            else:
                data = json.loads(request.body)
                pin.title = data.get('title', pin.title)
                pin.sections = data.get('sections', pin.sections)
                pin.status = data.get('status', pin.status)
                pin.category = data.get('category', pin.category)
                pin.is_public = data.get('is_public', pin.is_public)
            
            pin.save()

            return JsonResponse({
                'id': pin.id,
                'title': pin.title,
                'sections': pin.sections,
                'latitude': pin.latitude,
                'longitude': pin.longitude,
                'image': pin.image.url if pin.image else None,
                'created_at': pin.created_at.isoformat(),
                "status": pin.status,
                "is_public": pin.is_public,
                "category": pin.category,
            })
        except Pin.DoesNotExist:
            return JsonResponse({'error': 'Pin not found'}, status=404)
    return JsonResponse({'error': 'Invalid request method'}, status=400)