from django import forms
from .models import Address


class AddressForm(forms.ModelForm):
    class Meta:
        model = Address
        fields = [
            "postal_code",
            "address_line_1",
            "address_line_2",
            "city",
            "country",
            "state",
        ]
        labels = {
            "postal_code": "CEP",
            "address_line_1": "Endereço",
            "address_line_2": "Complemento",
            "city": "Cidade",
            "country": "País",
            "state": "Estado",
        }
        widgets = {
            "postal_code": forms.TextInput(
                attrs={"class": "form-control", "id": "cep"}
            ),
            "address_line_1": forms.TextInput(
                attrs={"class": "form-control", "id": "address_line_1"}
            ),
            "address_line_2": forms.TextInput(
                attrs={"class": "form-control", "id": "address_line_2"}
            ),
            "city": forms.TextInput(attrs={"class": "form-control", "id": "city"}),
            "country": forms.TextInput(
                attrs={"class": "form-control", "id": "country"}
            ),
            "state": forms.TextInput(attrs={"class": "form-control", "id": "state"}),
        }
