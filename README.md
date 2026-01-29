# 📌 Projet – Gestion de tickets (Python, FastAPI & React)
# by Corentin Mariey - Jean-Baptiste Lizé

## 🧠 Contexte du projet

Ce projet a pour objectif de manipuler et traiter des données de tickets en **Python**, puis d’exposer ces données via une **API REST FastAPI**, connectée à un **frontend React (Vite)**.

Le travail s’inscrit dans une démarche pédagogique utilisant un **LLM** pour apprendre progressivement lors des développements.

---

## 🗂️ Structure du projet

```
CREATION_API_PYTHON/
│
├── backend/
│   ├── tickets.json        # Données des tickets (JSON)
│   ├── /script/            # Nos fonctions (add,delete,modify,sort)
│   └── main.py             # API FastAPI
│   
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── App.jsx
│       ├── App.css
│       ├── API.js
│       └── main.jsx
│
├── README.md
├── LEARNING.md
└── requirements.txt    # Dépendances Python
```

---

## 🧾 Description des données

Les tickets sont stockés dans un fichier **tickets.json**.

### Structure d’un ticket

```json
{
  "id": 1,
  "title": "Bug login",
  "description": "Erreur lors de la connexion",
  "priority": "High",
  "status": "Pending",
  "createdAt": "2026-01-29T12:55:19Z"
}
```

* **priority** : `Low | Medium | High`
* **status** : `Pending | Active | Inactive`
* **createdAt** : date ISO 8601

---

## 🐍 Backend – Python & FastAPI

### 🔧 Installation

Depuis le dossier `backend/` :

```bash
python -m venv venv                 # creer un environnement virtuel pour le projet
source venv/bin/activate            # active le venv
pip install -r requirements.txt     # instal le fichier requierments.txt
```

### 🚀 Lancement de l’API: serveur Uvicorn

```bash
uvicorn main:app --reload
```

L’API est disponible sur :

* [http://127.0.0.1:8000](http://127.0.0.1:8000)
* Documentation Swagger : [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

---

## 🔗 Endpoints de l’API

### 📥 GET /tickets

Récupère tous les tickets triés :

* par **statut**
* par **priorité**
* par **date de création**


---

### ➕ POST /tickets

Création d’un ticket

**Body :**

```json
{
  "title": "New bug",
  "description": "Description",
  "priority": "Medium",
  "status": "Pending",
  "createdAt": "2026-01-29T12:00:00Z"
}
```

---

### ✏️ PATCH /tickets/{id}

Met à jour un ticket (statut, priorité, contenu)

**Erreurs possibles :**

* `404` : ticket introuvable

---

### 🗑️ DELETE /tickets/{id}

Supprime un ticket

**Erreurs possibles :**

* `404` : ticket introuvable

---

### ⚠️ Gestion des erreurs

L’API utilise `HTTPException` avec des codes HTTP adaptés :

* `400` : requête invalide
* `404` : ressource non trouvée
* `500` : erreur serveur

---

## 🧪 Script Python (hors API)

Le fichier `main.py` avec ses imports du fichier /script/ permet :

* Lecture du JSON
* Comptage des tickets par statut
* Tri (statut → priorité → date)
* Ajout d’un ticket
* Mise à jour d’un ticket
* Suppression d'un ticket

Utilisé pour valider la logique métier avant l’API.

---

## ⚛️ Frontend – React (Vite)

### 📦 Prérequis

* Git bash
* npm

### 🔧 Installation

Depuis le dossier `frontend/` :

```bash
npm install
```

### 🚀 Lancement

```bash
npm run dev
```

Frontend accessible sur :

* [http://localhost:5173](http://localhost:5173)

---

## 🔄 Connexion Front ↔ Back

Le frontend utilise `fetch` pour aller chercher dans l’API :

* GET → affichage tous les tickets
* POST → création de tickets via un formulaire à remplir par l'utilisateur
* PATCH → édition d’un ticket
* DELETE → suppression d'une ticket

CORS configuré côté FastAPI pour autoriser `localhost:5173`.
Grace à un Middleware CORS configuration pour autoriser les requêtes depuis le frontend

```py
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## 🧪 Fonctionnalités validées

✔️ API fonctionnelle
✔️ Affichage des tickets
✔️ Affichage de la description du ticket quand on clic dessus
✔️ Création de ticket
✔️ Mise à jour du statut
✔️ Suppression
✔️ Tri par date / priorité / statut

---

## 📚 Documentation complémentaire

* `README.md` : installation et usage
* `LEARNING.md` : preuves de prompts concrètes (bugs + prompts + apprentissages)


---

## ✅ Conclusion

Ce projet permet de :

* Comprendre la manipulation de données en Python
* Construire une API REST propre
* Connecter un frontend moderne
* Appliquer de bonnes pratiques (HTTP, tri, état, erreurs)


