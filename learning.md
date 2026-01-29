## 🤖 Utilisation du LLM (IA)
# by Corentin Mariey - Jean-Baptiste Lizé

### 🔹 Exemples de prompts jugés pertinents

* « j’avais mis un compteur dans result ça compte par nombre de status pending active etc… est-ce que tu peux me faire un compteur stylé dans la page stp et mettre aussi du responsive »
* « c’est quoi ** et enumerate(tickets) ? explique la fonction »
* « j’aimerais que y ait pas de blanc à droite et aussi quand je add ça met le truc en haut c’est un peu bizarre comme design »
* « est-ce que tu peux me faire une liste de ce que je t’ai envoyé comme prompt et dis-moi un moment où tu t’es trompé »
* « ça crée bien le ticket mais ne peut pas s’afficher, quand je recharge ça fait une erreur, qu’est-ce que tu aurais besoin pour trouver l’erreur ? »

Ces prompts ont permis d’identifier rapidement les problèmes réels et d’améliorer la qualité du projet.

---


## 🐞 Erreurs rencontrées et corrections

### 1️⃣ Tickets non affichés après création

**Problème :** le ticket était bien créé côté backend mais n’apparaissait pas dans l’interface.

**Cause :** l’endpoint `POST /tickets` ne retournait pas la ressource créée.

**Correction :** retour de la resource dans le POST.

---

### 2️⃣ Crash CORS / erreur 500 au rechargement

**Problème :** erreur CORS affichée côté frontend masquant une erreur serveur.

**Cause réelle :** exception Python non gérée côté backend.

**Correction :** 

* analyse du traceback FastAPI
* correction du code Python
* ajout de gestion d’erreurs avec `HTTPException`

---

### 3️⃣ Problèmes de dates (datetime naïf / aware)

**Problème :** formats de dates incohérents empêchant le tri.

**Correction :**

* normalisation des dates au format ISO 8601
* utilisation cohérente de `createdAt` côté backend et frontend

---

### 4️⃣ PATCH supprimait le ticket

**Problème :** après modification, le ticket disparaissait.

**Cause :** l’API retournait un simple message au lieu du ticket mis à jour.

**Correction :** retour du ticket modifié dans la réponse PATCH.

---

### 5️⃣ Valeurs vides (status / priority)

**Problème :** création de tickets invalides.

**Correction :**

* validation des champs côté frontend
* inputs contrôlés React

---

## ⚠️ Limite identifiée du LLM

Une erreur d’analyse a été relevée lors du développement :

* **Diagnostic initial du LLM :** problème attribué au frontend (gestion du state React)
* **Cause réelle :** bug backend (données invalides dans `tickets.json`)

**Résolution :**

* inspection du traceback FastAPI
* vérification manuelle du fichier JSON

👉 Cette situation a permis de comprendre l’importance de **croiser les analyses IA avec le débogage réel**.
