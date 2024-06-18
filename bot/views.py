from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .predict_response import bot_response


@csrf_exempt
def bot(request):
    if request.method == 'POST':
        # Obtenha a entrada do usuário
        input_text = request.POST.get("user_bot_input_text")

        # Chame o método para obter a resposta do robô
        bot_res = bot_response(input_text)

        response = {
            "bot_response": bot_res
        }

        return JsonResponse(response)
    else:
        return JsonResponse({"error": "Método não permitido"}, status=405)
