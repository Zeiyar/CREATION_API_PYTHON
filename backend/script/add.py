import os
import json

test = os.path.getsize("tickets.json")  #récuperer la taille du fichier sous forme d'entier (si 0 = vide)
if test == 0:
    print("Erreur: Le fichier est vide")
    exit()            # Vérifier que le fichier n'est pas vide et quitter le script si c'est le cas
        
        
    
def add_ticket(new_ticket,file_path):
    #charger ticket JSON
    with open(file_path,"r",encoding="utf-8") as file:
        tickets = json.load(file)

    new_ticket["id"] = max(t["id"] for t in tickets) + 1 if tickets else 1  # Assigner un ID unique au nouveau ticket

    # Ajouter le nouveau ticket à la liste des tickets existants     
    tickets.append(new_ticket)  
      
    
    
    # Réécrire le fichier JSON avec le nouveau ticket ajouté
    with open(file_path,"w",encoding="utf-8") as file:
        json.dump(tickets,file,indent=2,ensure_ascii=False)
    #print("adding successfull")
    return new_ticket