import { useEffect, useState } from 'react'
import './App.css'
import GET from './API';


function App() {
  const [tickets, setTickets] = useState({
    Active:[],
    Inactive:[],
    Pending:[]
  });    // État pour stocker les tickets récupérés
  const allTickets = [
    ...tickets.Active,
    ...tickets.Inactive,
    ...tickets.Pending
    ]

  // Utilisation de useEffect pour récupérer les tickets au montage du composant
  useEffect(() => {
    GET("http://127.0.0.1:8000/tickets").then(data => { setTickets(data.tickets);
      console.log(data)})    // Met à jour l'état avec les tickets récupérés
      .catch(console.error);     // Gestion des erreurs
  }, []);

  return (
    <div>
      <h1>Liste des tickets</h1>
      <ul>
        {allTickets.map(t => (
          <li key={t.id}>{t.title} - {t.description}</li>   // Adapte l'affichage selon la structure des tickets du backend
        ))}
      </ul>
    </div>
  );
}

export default App;
