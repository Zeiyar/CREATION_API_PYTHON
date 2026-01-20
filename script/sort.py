# hors APIs
import json
import os

file = os.path.getsize("tickets.json")  # récupérer la taille du fichier
if file == 0:
    print("Erreur: Le fichier est vide")
    exit()  # quitter le script si vide


# charger ticket JSON
def get_all_ticket_sorted(file_path):
    with open(file_path, "r", encoding="utf-8") as file:
        tickets = json.load(file)

    
    # filtrer les tickets (prio status / priority / createdAt)
    order = {
        "Active": 0,
        "Pending": 1,
        "Inactive": 2
    }

    order_prio = {
        "Low": 2,
        "Medium": 1,
        "High": 0,
    }

    # compter ticket par status (status / ID)
    count = {}
    nbtickets_by_status = {}


    for el in tickets:  # el = chaque ticket
        if not el:
            continue  # ticket vide → on passe au suivant

        #status = el["status"]
        status = el.get("status")
        if not status:
            continue

        if status not in nbtickets_by_status:
            count[status] = 0
            nbtickets_by_status[status] = []

        count[status] += 1
        nbtickets_by_status[status].append(el)

    for status, tickets_list in nbtickets_by_status.items():
        nbtickets_by_status[status] = sorted(
            tickets_list,
            key=lambda el: (
                order.get(el["status"], 99),
                order_prio.get(el["priority"], 99),
                el.get("createdAt", 0),
            )
        )

    # résultat final
    result = {
        "count": count,
        "tickets": nbtickets_by_status
    }

    if not result:
        return None

    return result


print(get_all_ticket_sorted("tickets.json"))