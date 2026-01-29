# hors APIs
import json
import os
from datetime import datetime


file = os.path.getsize("tickets.json")  # récupérer la taille du fichier
if file == 0:
    print("Erreur: Le fichier est vide")
    exit()  # quitter le script si vide


# fonction pour parser les dates (format ISO 8601 : "2024-01-25T14:32:00")
from datetime import datetime, timezone

def parse_date(date_str):
    if not date_str:
        return datetime.min.replace(tzinfo=timezone.utc)

    # Timestamp (ms)
    if isinstance(date_str, (int, float)):
        return datetime.fromtimestamp(date_str / 1000, tz=timezone.utc)

    try:
        dt = datetime.fromisoformat(date_str.replace("Z", "+00:00"))
        # Force UTC aware
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=timezone.utc)
        return dt
    except Exception:
        return datetime.min.replace(tzinfo=timezone.utc)


# charger ticket JSON
def get_all_ticket_sorted(file_path):
    with open(file_path, "r", encoding="utf-8") as file:
        tickets = json.load(file)

    
    # filtrer les tickets (prio status / priority / createdAt)
    order_status = {
        "Active": 1,
        "Pending": 0,
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

    # Regrouper les tickets par statut
    for el in tickets:  
        if not el:
            continue  # ticket vide → on passe au suivant

        #status = el["status"]          # acces direct à la clé, si elle n'existe pas, KeyError
        status = el.get("status")       # acces via get(), si elle n'existe pas, None
        if not status:
            continue

        if status not in nbtickets_by_status:
            count[status] = 0
            nbtickets_by_status[status] = []

        nbtickets_by_status[status].append(el)
        count[status] += 1
        

    # Trier chaque ticket par priorité puis id
    for status, ticket_list in nbtickets_by_status.items():     #.items(): récupère clé ("Active", "Pending", etc) et valeur (liste des tickets du statut)
        nbtickets_by_status[status] = sorted(               #remplace pour une nouvelle liste triée
            ticket_list,                              #la liste des tickets à trier
            key=lambda el: (                               #key définit la fonction de tri et el chaque ticket
                order_prio.get(el.get("priority"), 99),       #si priorité absente, valeur 99 (fin de liste)
                parse_date(el.get("createdAt")),              #trier par date de création (plus ancien en premier)
                el.get("id", 0)
            ),
            reverse=False                              #ordre croissant
        )

    # Trier les status entre eux 
    sorted_tickets_by_status = dict(
        sorted(
            nbtickets_by_status.items(),
            key=lambda item: order_status.get(item[0], 99)
        )
    )


    # résultat final
    result = {
        "count": count,
        "tickets": sorted_tickets_by_status
    }

    if not result:
        return None

    return result


print(get_all_ticket_sorted("tickets.json"))