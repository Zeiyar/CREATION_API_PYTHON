import os
import json

test = os.path.getsize("tickets.json")  #récuperer la taille du fichier sous forme d'entier (si 0 = vide)
if test == 0:
    print("Erreur: Le fichier est vide")
    exit()     

def delete_ticket(file_id,file_path):
    newFile = []
    found = False
    with open(file_path,"r",encoding="utf-8") as f:
        tickets = json.load(f)
        
    for ticket in tickets:
        if ticket.get("id") == file_id:
            found = True
        else:
            newFile.append(ticket)
             
    if not found:
        #print("élément non trouvé")
        return

    with open(file_path,"w",encoding="utf-8") as f:
        json.dump(newFile,f,indent=2,ensure_ascii=False)
    #print("ticket supprimé avec succès")

    return newFile

#Exemple de suppression d'un ticket avec l'id 11
delete_ticket(11,"tickets.json")
            