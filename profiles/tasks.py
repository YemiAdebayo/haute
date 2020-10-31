from __future__ import absolute_import, unicode_literals
import random
from haute.celery import app
from PIL import Image

""""
    We define all asynchronous tasks here for Celery to autodetect and handle
"""

@app.task(name="optimize_profile")
def optimize_profile_picture(self):
    #Open the profile image with the Image method from Pillow
    img = Image.open(self.profile_pic.path)

    #Check that image is large and resize accordingly
    if img.height > 200 or img.width > 200:
        output_size = (200, 200)
        img.thumbnail(output_size)
        img.save(self.profile_pic.path)
    print("Profile picture resized succesfully!")



@app.task(name="sum_two_numbers")
def add(x, y):
    print(x + y)

@app.task(name="multiply_two_numbers")
def mul(x, y):
    total = x * (y * random.randint(3, 100))
    return total

@app.task(name="sum_list_numbers")
def xsum(numbers):
    return sum(numbers)