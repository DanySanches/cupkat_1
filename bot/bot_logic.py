# import json
# import pickle
# import numpy as np
# import random
# import tensorflow as tf
# import nltk
# from nltk.stem import PorterStemmer

# nltk.download('punkt')
# nltk.download('wordnet')
# nltk.download('rslp')

# stemmer = PorterStemmer()
# ignore_words = ['?', '!', ',', '.', "'s", "'m"]

# # Carregar dados e modelo
# with open('./static_local/assets/chatbot_corpus/intents.json') as file:
#     intents = json.load(file)

# model = tf.keras.models.load_model('./static_local/assets/model_files/chatbot_model.h5')
# words = pickle.load(open('./static_local/assets/chatbot_corpus/words.pkl', 'rb'))
# classes = pickle.load(open('./static_local/assets/chatbot_corpus/classes.pkl', 'rb'))

# # Funções para processar a entrada do usuário
# def get_stem_words(words, ignore_words):
#     stem_words = []
#     for word in words:
#         if word not in ignore_words:
#             w = stemmer.stem(word.lower())
#             stem_words.append(w)
#     return stem_words

# def preprocess_user_input(user_input):
#     if not isinstance(user_input, str):
#         user_input = str(user_input)
    
#     input_word_token_1 = nltk.word_tokenize(user_input)
#     input_word_token_2 = get_stem_words(input_word_token_1, ignore_words)
#     input_word_token_2 = sorted(list(set(input_word_token_2)))
    
#     bag_of_words = [1 if word in input_word_token_2 else 0 for word in words]
#     return np.array([bag_of_words])

# # Funções para gerar a resposta do chatbot
# def bot_class_prediction(user_input):
#     inp = preprocess_user_input(user_input)
#     prediction = model.predict(inp)
#     predicted_class_label = np.argmax(prediction[0])
#     return predicted_class_label

# def bot_response(user_input):
#     print("Input received:", user_input)
#     predicted_class_label = bot_class_prediction(user_input)
#     predicted_class = classes[predicted_class_label]
    
#     for intent in intents['intents']:
#         if intent['tag'] == predicted_class:
#             return random.choice(intent['responses'])

#     return "Desculpe, não entendi a sua pergunta."
