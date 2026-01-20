#hors APIs
import json
import os

file = os.path.getsize("tickets.json")  #récuperer la taille du fichier sous forme d'entier (si 0 = vide)
if file == 0:
    print("Erreur: Le fichier est vide")
    exit            # Vérifier que le fichier n'est pas vide et quitter le script si c'est le cas
        
#charger ticket JSON
with open("tickets.json","r",encoding="utf-8") as file:
    tickets = json.load(file)


#compter ticket par status (status / ID)
count = {}
nbtickets_by_status = {}
for el in tickets:              # el = chaque ticket
    if not el:
        print("Erreur: Ticket vide détecté, passage au suivant.")
        continue
    status = el["status"]
    if (status not in nbtickets_by_status):
        count[status]=0
        nbtickets_by_status[status] = []
    
    count[status] += 1      
    nbtickets_by_status[status].append(el) 
        
        
#filtrer les tickets (prio status / id)
order = {
    "Active":0,
    "Pending":1,
    "Inactive":2
}
order_prio = {
    "Low":2,
    "Medium":1,
    "High":0,
}
for status, tickets_list in nbtickets_by_status.items():        #ticket_list = liste des tickets pour chaque status
    nbtickets_by_status[status] = sorted(
        tickets_list,
        key=lambda el: (                            #key=lambda el: ... permet de définir une fonction anonyme pour trier les éléments
            order.get(el["status"],99),         #order.get permet de récupérer la valeur associée à la clé el["status"], si la clé n'existe pas, retourne 99
            order_prio.get(el["priority"],99),  #order_prio.get permet de récupérer la valeur associée à la clé el["priority"], si la clé n'existe pas, retourne 99
            el.get("createdAt",0),                 #el.get permet de récupérer la valeur associée à la clé "id", si la clé n'existe pas, retourne 0
        )
    )

# On affiche les tickets triés par status et priorité (High > Medium > Low)
result = {
    "count" : count,
    "tickets": nbtickets_by_status
}
print(result)