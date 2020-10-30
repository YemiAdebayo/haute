from __future__ import absolute_import, unicode_literals
import random
from celery.decorators import task

""""
    We define all asynchronous tasks here for Celery to autodetect and handle
"""

@task(name="optimize_profile")
def optimize_profile_picture(self):
    print("Celery just handled a task")



@task(name="sum_two_numbers")
def add(x, y):
    return x + y

@task(name="multiply_two_numbers")
def mul(x, y):
    total = x * (y * random.randint(3, 100))
    return total

@task(name="sum_list_numbers")
def xsum(numbers):
    return sum(numbers)