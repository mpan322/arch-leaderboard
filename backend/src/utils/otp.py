from string import digits
from random import choices

LENGTH = 5


def generate_otp():
    return "".join(choices(digits, None, k=LENGTH))
