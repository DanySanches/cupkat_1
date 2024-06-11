from decimal import Decimal
from django.conf import settings
from django.db import models
from django.db.models.signals import pre_save, post_save, m2m_changed
from django.dispatch import receiver
from products.models import Product

User = settings.AUTH_USER_MODEL

class CartItem(models.Model):
    cart = models.ForeignKey('Cart', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    line_total = models.DecimalField(default=0.00, max_digits=100, decimal_places=2)
    description = models.TextField(blank=True, null=True)  # Campo de descrição

    def __str__(self):
        return f"{self.quantity} x {self.product.title}"

    def save(self, *args, **kwargs):
        self.line_total = self.product.price * self.quantity
        if not self.description:
            self.description = self.product.description  # Se não houver descrição, use a descrição do produto
        super().save(*args, **kwargs)

class CartManager(models.Manager):
    def new_or_get(self, request):
        cart_id = request.session.get("cart_id", None)
        qs = self.get_queryset().filter(id=cart_id)
        if qs.count() == 1:
            new_obj = False
            cart_obj = qs.first()
            if request.user.is_authenticated and cart_obj.user is None:
                cart_obj.user = request.user
                cart_obj.save()
        else:
            cart_obj = Cart.objects.new(user=request.user)
            new_obj = True
            request.session['cart_id'] = cart_obj.id
        return cart_obj, new_obj

    def new(self, user=None):
        user_obj = None
        if user is not None:
            if user.is_authenticated:
                user_obj = user
        return self.model.objects.create(user=user_obj)

class Cart(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    subtotal = models.DecimalField(default=0.00, max_digits=100, decimal_places=2)
    total = models.DecimalField(default=0.00, max_digits=100, decimal_places=2)
    updated = models.DateTimeField(auto_now=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    objects = CartManager()

    def __str__(self):
        return str(self.id)

    @property
    def items(self):
        return self.cartitem_set.all()

    def update_subtotal(self):
        subtotal = sum([item.line_total for item in self.items])
        self.subtotal = subtotal
        self.save()

# Remova a função m2m_changed_cart_receiver, pois não usamos mais a relação ManyToMany

def pre_save_cart_receiver(sender, instance, *args, **kwargs):
    if instance.subtotal > 0:
        instance.total = Decimal(instance.subtotal) * Decimal(1.80)  # 80% de taxa
    else:
        instance.total = 0.00

pre_save.connect(pre_save_cart_receiver, sender=Cart)

@receiver(post_save, sender=CartItem)
def update_cart_subtotal(sender, instance, **kwargs):
    instance.cart.update_subtotal()
