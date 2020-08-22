from django import forms
from .models import Profile


class ProfileUpdateFormForAdmin(forms.ModelForm):

    STATE_CHOICES = [
        ('placeholder', 'Select state'),
        ('Abia State', 'Abia State'),
        ('Adamawa State', 'Adamawa State'),
        ('Akwa Ibom State', 'Akwa Ibom State'),
        ('Anambra State', 'Anambra State'),
        ('Bauchi State', 'Bauchi State'),
        ('Bayelsa State', 'Bayelsa State'),
        ('Benue State', 'Benue State'),
        ('Borno State', 'Borno State'),
        ('Cross River State', 'Cross River State'),
        ('Delta State', 'Delta State'),
        ('Ebonyi State', 'Ebonyi State'),
        ('Edo State', 'Edo State'),
        ('Ekiti State', 'Ekiti State'),
        ('Enugu State', 'Enugu State'),
        ('FCT', 'FCT'),
        ('Gombe State', 'Gombe State'),
        ('Imo State', 'Imo State'),
        ('Jigawa State', 'Jigawa State'),
        ('Kaduna State', 'Kaduna State'),
        ('Kano State', 'Kano State'),
        ('Katsina State', 'Katsina State'),
        ('Kebbi State', 'Kebbi State'),
        ('Kogi State', 'Kogi State'),
        ('Kwara State', 'Kwara State'),
        ('Lagos State', 'Lagos State'),
        ('Nasarawa State', 'Nasarawa State'),
        ('Niger State', 'Niger State'),
        ('Ogun State', 'Ogun State'),
        ('Ondo State', 'Ondo State'),
        ('Osun State', 'Osun State'),
        ('Oyo State', 'Oyo State'),
        ('Plateau State', 'Plateau State'),
        ('Rivers State', 'Rivers State'),
        ('Sokoto State', 'Sokoto State'),
        ('Taraba State', 'Taraba State'),
        ('Yobe State', 'Yobe State'),
        ('Zamfara State', 'Zamfara State'),
    ]

    residential_address = forms.CharField(
        max_length=150,
        label='Current home address:',
        widget=forms.TextInput(
            attrs={
                'class': 'text-input error-handler',
                'placeholder': 'Current city address',
                'name': 'residential_address'
            }
        )
    )

    state_of_residence = forms.CharField(
        label='Current State:', widget=forms.Select(
            choices=STATE_CHOICES,
            attrs={
                'class': 'text-input error-handler states_in_naija custom-select',
                'name': 'state_of_residence'
            }),
    )

    landmark_building = forms.CharField(
        max_length=150,
        label='Landmark Building:',
        widget=forms.TextInput(
            attrs={
                'class': 'text-input error-handler ',
                'placeholder': 'Landmark building near you',
                'name': 'landmark_building'
            }
        )
    )

    class Meta:
        model = Profile
        fields = (
            'user',
            'residential_address',
            'state_of_residence',
            'LGA_of_residence',
            'landmark_building',
        )


class ProfileUpdateForm(forms.ModelForm):

    STATE_CHOICES = [
        ('placeholder', 'Select state'),
        ('Abia State', 'Abia State'),
        ('Adamawa State', 'Adamawa State'),
        ('Akwa Ibom State', 'Akwa Ibom State'),
        ('Anambra State', 'Anambra State'),
        ('Bauchi State', 'Bauchi State'),
        ('Bayelsa State', 'Bayelsa State'),
        ('Benue State', 'Benue State'),
        ('Borno State', 'Borno State'),
        ('Cross River State', 'Cross River State'),
        ('Delta State', 'Delta State'),
        ('Ebonyi State', 'Ebonyi State'),
        ('Edo State', 'Edo State'),
        ('Ekiti State', 'Ekiti State'),
        ('Enugu State', 'Enugu State'),
        ('FCT', 'FCT'),
        ('Gombe State', 'Gombe State'),
        ('Imo State', 'Imo State'),
        ('Jigawa State', 'Jigawa State'),
        ('Kaduna State', 'Kaduna State'),
        ('Kano State', 'Kano State'),
        ('Katsina State', 'Katsina State'),
        ('Kebbi State', 'Kebbi State'),
        ('Kogi State', 'Kogi State'),
        ('Kwara State', 'Kwara State'),
        ('Lagos State', 'Lagos State'),
        ('Nasarawa State', 'Nasarawa State'),
        ('Niger State', 'Niger State'),
        ('Ogun State', 'Ogun State'),
        ('Ondo State', 'Ondo State'),
        ('Osun State', 'Osun State'),
        ('Oyo State', 'Oyo State'),
        ('Plateau State', 'Plateau State'),
        ('Rivers State', 'Rivers State'),
        ('Sokoto State', 'Sokoto State'),
        ('Taraba State', 'Taraba State'),
        ('Yobe State', 'Yobe State'),
        ('Zamfara State', 'Zamfara State'), ]

    LGA_CHOICES = [('placeholder', 'Select LGA')]

    residential_address = forms.CharField(
        max_length=150,
        label='Current home address:',
        widget=forms.TextInput(
            attrs={
                'class': 'text-input error-handler',
                'placeholder': 'Current city address',
                'name': 'residential_address'
            }
        )
    )

    state_of_residence = forms.CharField(
        label='Current State:', widget=forms.Select(
            choices=STATE_CHOICES,
            attrs={
                'class': 'text-input error-handler states_in_naija custom-select',
                'name': 'state_of_residence'
            }),
    )

    LGA_of_residence = forms.CharField(
        label='L.G.A of Residence:',
        widget=forms.Select(
            choices=LGA_CHOICES,
            attrs={
                'class': 'text-input error-handler LGA-of-residence custom-select',
                'name': 'LGA_of_residence'
            }
        )
    )

    landmark_building = forms.CharField(
        max_length=150,
        label='Landmark Building:',
        widget=forms.TextInput(
            attrs={
                'class': 'text-input error-handler ',
                'placeholder': 'Landmark building near you',
                'name': 'landmark_building'
            }
        )
    )

    class Meta:
        model = Profile
        fields = (
            'user',
            'residential_address',
            'state_of_residence',
            'LGA_of_residence',
            'landmark_building',
        )

    def clean_residential_address(self):
        residential_address = self.cleaned_data.get(
            "residential_address"
        )
        return residential_address

    def clean_state_of_residence(self):
        state_of_residence = self.cleaned_data.get(
            "state_of_residence"
        )
        return state_of_residence

    def clean_LGA_of_residence(self):
        LGA_of_residence = self.cleaned_data.get(
            "LGA_of_residence"
        )
        return LGA_of_residence

    def clean_landmark_building(self):
        landmark_building = self.cleaned_data.get(
            "landmark_building"
        )
        return landmark_building
