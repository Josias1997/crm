from rest_framework.decorators import api_view
from rest_framework.response import Response
import stripe

DAYS = {
    'H': 7,
    'M': 30,
    'T': 90,
    'S': 180,
    'A': 365
}

INTERVALS = {
    'H': 'week',
    'M': 'month',
    'T': 'month',
    'S': 'month',
    'A': 'year'
}

INTERVALS_COUNT = {
    'H': 1,
    'M': 1,
    'T': 3,
    'S': 6,
    'A': 1
}

@api_view(['POST'])
def add_product(request):
    name = request.data['name']
    price = int(request.data['price']) * 100
    recurrence = request.data['recurrence']
    product_type = request.data['type']
    description = request.data['description']
    product = stripe.Product.create(
    	name=name,
    	type=product_type,
    	description=description
    )
    plan = stripe.Plan.create(
        amount=price,
        currency='eur',
        interval=INTERVALS[recurrence],
        interval_count=INTERVALS_COUNT[recurrence],
        product=product.id
    )
    return Response(product)



@api_view(['PUT'])
def update_product(request, pk):
    name = request.data['name']
    description = request.data['description']
    product = stripe.Product.modify(
    	pk,
    	name=name,
    	description=description
    )
    return Response(product)


@api_view(['DELETE'])
def delete_product(request, pk):
    product = stripe.Product.delete(pk)
    return Response(product)


@api_view(['GET'])
def get_product(request, pk):
    product = stripe.Product.retrieve(pk)
    return Response(product)


@api_view(['GET'])
def get_products(request):
    products = stripe.Product.list()
    return Response(products.data)
