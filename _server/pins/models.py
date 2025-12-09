from django.db import models
from django.contrib.auth.models import User

class Pin(models.Model):
    STATUS_CHOICES = [
        ('wishlisted', 'Wishlisted'),
        ('visited', 'Visited'),
        ('favorite', 'Favorite'),
    ]

    Category_CHOICES = [
        ('restaurant', 'Restaurant'),
        ('museum', 'Museum'),
        ('park', 'Park'),
        ('hotel', 'Hotel'),
        ('other', 'Other'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    description = models.TextField()
    latitude = models.FloatField()
    longitude = models.FloatField()
    image = models.ImageField(upload_to='pin_images/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_public = models.BooleanField(default=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='wishlisted')
    category = models.CharField(max_length=20, choices=Category_CHOICES, default='other')

    def __str__(self):
        return f"{self.title} - {self.user.username}"
    
    class Meta:
        ordering = ['-created_at']
        