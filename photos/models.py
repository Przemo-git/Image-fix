from io import BytesIO

import numpy as np
from PIL import Image
from django.core.files.base import ContentFile
from django.db import models

# Create your models here.
from photos.utils import get_filtered_image


ACTION_CHOICES = (
    ('NO_FILTER', 'no filter'),
    ('COLORIZED', 'colorized'),
    ('GRAYSCALE', 'grayscale'),
    ('BLURRED', 'blurred'),
    ('BINARY', 'binary'),
    ('INVERT', 'invert'),
)

class Photo(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    image = models.ImageField(upload_to='images')
    action = models.CharField(max_length=50, choices=ACTION_CHOICES, null=True)
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.name)

    def save(self, *args, **kwargs):
        # open image
        pil_img = Image.open(self.image)

        # convert image to array and do some processing
        cv_img = np.array(pil_img)
        img = get_filtered_image(cv_img, self.action)

        # convert back to pil image
        im_pil = Image.fromarray(img)

        # save
        buffer = BytesIO()
        im_pil.save(buffer, format='png')
        image_png = buffer.getvalue()

        self.image.save(str(self.image), ContentFile(image_png), save=False)
        # save=False bo nie chcemy tutaj tylko niżej

        super().save(*args, **kwargs)

# ACTION_CHOICES = (
#         ('NO_FILTER', 'no filter'),
#         ('COLORIZED', 'colorized'),
#         ('GRAYSCALE', 'grayscale'),
#         ('BLURRED', 'blurred'),
#         ('BINARY', 'binary'),
#         ('INVERT', 'invert'),
#
# )
#
# class Photo(models.Model):
#     name = models.CharField(max_length=100)
#     description = models.TextField()
#     image = models.ImageField(upload_to='images')


