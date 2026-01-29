import json
import os

file = os.path.getsize("tickets.json")  #récuperer la taille du fichier sous forme d'entier (si 0 = vide)
if file == 0:
    print("Erreur: Le fichier est vide")
    exit()            # Vérifier que le fichier n'est pas vide et quitter le script si c'est le cas
        
#charger ticket JSON
def get_one_ticket(file_path,id):
    with open(file_path,"r",encoding="utf-8") as file:
        tickets = json.load(file) 
        for ticket in tickets:
            if id == ticket["id"]:
                return ticket
        else:
            return None
        
#print(get_one_ticket("tickets.json",1))