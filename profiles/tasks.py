from __future__ import absolute_import, unicode_literals
import random
from haute.celery import app
from PIL import Image

""""
    We define all asynchronous tasks here for Celery to autodetect and handle
"""


@app.task(name="optimize_profile")
def optimize_profile_picture(self):
    # Open the profile image with the Image method from Pillow
    img = Image.open(self.profile_pic.path)

    # Check that image is large and resize accordingly
    if img.height > 300 or img.width > 300:
        output_size = (300, 300)
        img.thumbnail(output_size)
        img.save(self.profile_pic.path)
    print("Profile picture resized succesfully!")


@app.task(name="sum_two_numbers")
def add(x, y):
    return x + y
