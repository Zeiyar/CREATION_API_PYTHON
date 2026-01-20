#hors APIs
import json
import os
#charger ticket JSON
file = os.path.getsize("tickets.json")
if not file: exit # Vérifier que le fichier n'est pas vide

with open("tickets.json","r",encoding="utf-8") as file:
    tickets = json.load(file)

#compter ticket par status (status / ID)
count = {}
tickets_by_status = {}
for el in tickets:
    if not el:
        continue
    status = el["status"]
    if (status not in tickets_by_status):
        count[status]=0
        tickets_by_status[status] = []
    
    count[status] += 1
    tickets_by_status[status].append(el) 
        
#filtrer les tickets (prio status / id)
order = {
    "Active":0,
    "Pending":1,
    "Inactive":2
}
tickets_sorted = sorted(tickets, key=lambda el: order.get(el["status"],99))
result = {
    "count" : count,
    "tickets": tickets_sorted
}
print(result)
#trier tickets
#ajouter ticket
#mettre a jour le ticket existant