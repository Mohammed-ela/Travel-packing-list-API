# 📦 Travel Packing List API  
**Gérez vos voyages et votre checklist d’objets essentiels facilement !**  

🔗 **API en ligne** : [https://travel-packing-list-api-production.up.railway.app/](https://travel-packing-list-api-production.up.railway.app/)  

## ✨ Fonctionnalités  
✅ **Authentification sécurisée** (Inscription, Connexion, JWT)  
✅ **Gestion des voyages** (Créer, Lister, Détails)  
✅ **Gestion des items à emporter** (Ajouter, Modifier, Supprimer, Marquer comme pris)  
✅ **Validation des entrées** avec **Zod**  
✅ **Sécurisé avec JWT & Bcrypt**  
✅ **Documenté avec OpenAPI (Stoplight)**  

---

## 🚀 Installation & Démarrage  

### 1️⃣ Cloner le projet  
```bash
git clone https://github.com/ton-repo/travel-packing-list-api.git
cd travel-packing-list-api
```

### 2️⃣ Installer les dépendances  
```bash
npm install
```

### 3️⃣ Configurer l’environnement (`.env`)  
Crée un fichier `.env` et ajoute tes variables :  
```plaintext
PORT=3000
MONGO_URI=mongodb+srv://...
JWT_SECRET=supersecretkey
JWT_EXPIRES_IN=1h
```

### 4️⃣ Lancer le serveur  
```bash
npm run dev
```
L'API tourne sur `http://localhost:3000` 🚀  

---

## 📡 Endpoints API  

### 🔐 **Authentification**  
#### 1️⃣ Inscription  
`POST /auth/register`  
```json
{
  "email": "test@example.com",
  "password": "mypassword"
}
```

#### 2️⃣ Connexion  
`POST /auth/login`  
```json
{
  "email": "test@example.com",
  "password": "mypassword"
}
```
Réponse :
```json
{ "token": "JWT_TOKEN_HERE" }
```

#### 3️⃣ Profil utilisateur  
`GET /auth/me`  
**Headers** : `Authorization: Bearer <JWT_TOKEN>`  

---

### ✈️ **Voyages**  
#### 4️⃣ Créer un voyage  
`POST /trips`  
```json
{
  "destination": "Paris",
  "startDate": "2025-02-01",
  "endDate": "2025-02-10"
}
```

#### 5️⃣ Lister tous les voyages  
`GET /trips`  

#### 6️⃣ Détails d’un voyage  
`GET /trips/{tripId}`  

#### 7️⃣ Modifier un voyage  
`PUT /trips/{tripId}`  
```json
{
  "destination": "Londres",
  "startDate": "2025-03-01",
  "endDate": "2025-03-15"
}
```

#### 8️⃣ Supprimer un voyage  
`DELETE /trips/{tripId}`  

---

### 🎒 **Items d’un voyage**  
#### 9️⃣ Ajouter un item  
`POST /trips/{tripId}/items`  
```json
{
  "name": "Passeport",
  "quantity": 1
}
```

#### 🔟 Marquer un item comme pris  
`PATCH /trips/{tripId}/items/{itemId}/mark`  

#### 1️⃣1️⃣ Supprimer un item  
`DELETE /trips/{tripId}/items/{itemId}`  

---

## 📖 Documentation API  
📜 **OpenAPI / Stoplight** : [Voir la doc](https://momodev.stoplight.io/docs/travel-packing-list-api/acukk4vmoon2d-travel-packing-list-api)  

📌 **Technos utilisées** :  
- **Node.js + Express.js**
- **MongoDB (Mongoose)**
- **JWT (jsonwebtoken)**
- **Bcrypt (chiffrement des mots de passe)**
- **Zod (validation des entrées)**
- **Stoplight (Documentation API)** 

---

### **💡 Contribuer**  
Les PR sont les bienvenues ! Fork, clone et propose tes améliorations. 😊  

