from rest_framework.decorators import api_view
import stripe

@api_view(['POST'])
def create_product(request):
    pass


@api_view(['PUT'])
def update_product(request, pk):
    pass


@api_view(['DELETE'])
def delete_poduct(request, pk):
    pass


@api_view(['GET'])
def retrieve_product(request, pk):
    pass


@api_view(['GET'])
def retrieve_all_products(request):
    pass
