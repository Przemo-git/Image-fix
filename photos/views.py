import json

from django.core import serializers
from django.shortcuts import render
from .forms import PhotoForm
from django.http import JsonResponse
# Create your views here.
from .models import Photo


def photo_add_view(request):
    form = PhotoForm(request.POST or None, request.FILES or None)
    if request.is_ajax():
        pic_id = json.loads(request.POST.get('id'))
        #json przekształca id z null na None
        action = request.POST.get('action')

        if pic_id is None:
            if form.is_valid():
                # create object in database
                obj = form.save(commit=False)
            else:
                # update
                obj = Photo.objects.get(id=pic_id)

            obj.action = action
            obj.save()
            data = serializers.serialize('json', [obj])
            return JsonResponse({'data': data})

    context = {
        'form': form,
    }
    return render(request, 'photos/main.html', context)







