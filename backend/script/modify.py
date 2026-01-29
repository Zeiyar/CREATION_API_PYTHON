import os
import json

test = os.path.getsize("tickets.json")  #récuperer la taille du fichier sous forme d'entier (si 0 = vide)
if test == 0:
    print("Erreur: Le fichier est vide")
    exit()           # Vérifier que le fichier n'est pas vide et quitter le script si c'est le cas


# Fonction pour vérifier si l'ID du ticket est valide
def is_valid_id(ticket_id):
    return isinstance(ticket_id, int) and ticket_id > 0

# Fonction pour trouver un ticket existent par son ID
def find_ticket_by_id(tickets, ticket_id):
    for ticket in tickets:
        if ticket.get("id") == ticket_id:
            return ticket
    return None


    
def modify_ticket(file_path, ancient_file_id, updates):
    
    with open(file_path,"r",encoding="utf-8") as f:
        tickets = json.load(f)
        
    # Rechercher le ticket par son ID associée et appliquer les mises à jour
    for i,ticket in enumerate(tickets):
        if ticket.get("id") == ancient_file_id:
            tickets[i] = {**ticket,**updates}
            updated_ticket = tickets[i]
                #print("modify successfull")
            break
    else:
        #print("non trouvé")
        return
    
    
    with open(file_path,"w",encoding="utf-8") as f:
        json.dump(tickets,f,indent=2,ensure_ascii=False)
    
    return updated_ticket

# Exemple de modification d'un ticket
modify_ticket(
    "tickets.json",
    3,
    {"status": "Active", "priority": "High"}
)
