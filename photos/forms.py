from django import forms
from .models import Photo

class PhotoForm(forms.ModelForm):
    class Meta:
        model = Photo
        fields = ('image', 'name', 'description')    # definiujemy formularz, w main będą te 3 pola












