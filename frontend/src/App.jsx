import { useEffect, useState } from 'react'
import './App.css'
import {getTickets, getTicketById, postTicket, deleteTicket, patchTicket} from './API';


function App() {
  const [id,setId] = useState(1);
  const [title,setTitle] = useState("");
  const [description,setDescription] = useState("");
  const [priority,setPriority] = useState("");
  const [status_ticket,setStatus_ticket] = useState("");
  const [adding,setAdding] = useState(false);
  const [tickets, setTickets] = useState({
    Active:[],
    Inactive:[],
    Pending:[]
  });    // État pour stocker les tickets récupérés
  
  const [allTickets,setAllTickets] = useState([
    ...tickets.Pending,
    ...tickets.Active,
    ...tickets.Inactive
    ]);

  const url = "http://127.0.0.1:8000/tickets"

  // Utilisation de useEffect pour récupérer les tickets au montage du composant
  useEffect(() => {
  getTickets(url)
    .then(data => {
      if (!data || !data.tickets) return;
      setTickets(data.tickets);
    })
    .catch(console.error);
}, []);

  useEffect(() => {
    setAllTickets([
      ...tickets.Pending,
      ...tickets.Active,
      ...tickets.Inactive,
    ]);
  }, [tickets]);

  // useEffect(() => {
  //   patchTicket("http://127.0.0.1:8000/tickets",id,update_ticket).then(data => { setUpdateTicket(data);
  //     console.log(data)})    // Met à jour l'état avec les tickets récupérés
  //     .catch(console.error);     // Gestion des erreurs
  // }, [patch]);

  // useEffect(() => {
  //   deleteTicket("http://127.0.0.1:8000/tickets",id).then(data => { setTicketID(data.tickets);
  //     console.log(data)})    // Met à jour l'état avec les tickets récupérés
  //     .catch(console.error);     // Gestion des erreurs
  // }, [delete]);
  
  const handleAddTicket = async() =>{
      const newTicket = {
      "id" : allTickets.length + 1,
      "title" : title,
      "description": description,
      "priority": priority,
      "status": status_ticket.trim(),
      "createdAt": new Date().toISOString(),
    }
      if (!priority || !status_ticket) {
        alert("Priority et status obligatoires");
        return;
      }

      const created = await postTicket(url,newTicket)

      if (created) {
        setAllTickets(prev => ({...prev,[created.status]:[...prev[created.status],created]}));   // prev représente l'état précédent de allTickets
        setAdding(false);               // Réinitialise l'état d'ajout de ticket
      }
  }

  return (
    <div className="tickets-page">
      <div className="tickets-header-bar">
        <h1>All open tickets</h1>
        {adding && (
          <div>
            <input placeholder="titre" onChange={e => setTitle(e.target.value)} />
            <textarea placeholder="description" onChange={e => setDescription(e.target.value)} />
            <select value={priority} onChange={e => setPriority(e.target.value)}>
              <option value="">Select Priority</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
            <select value={status_ticket} onChange={e => setStatus_ticket(e.target.value)}>
              <option value="">Select Status</option>
              <option value="Pending">Pending</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        )}
        {/* Button to add a new ticket */}
        <button 
          className="btn primary" 
          onClick={() => adding ? handleAddTicket() : setAdding(true)}>+ Add ticket</button>   
      </div>

      <div className="tickets-table">
        <div className="tickets-row tickets-head">
          <span>Title</span>
          <span>Status</span>
          <span>Priority</span>
          <span>Created</span>
          <span>Actions</span>
        </div>

        {allTickets.map(t => (
          <div
            key={t.id}
            className="tickets-row ticket-item"
            onClick={() => setId(t.id)}
          >
            <span className="ticket-title">{t.title}</span>

            <span className={`status ${t.status.toLowerCase()}`}>
              {t.status}
            </span>

            <span>{t.priority}</span>
            <span>{t.createdAt}</span>

            <span
              className="actions"
              onClick={e => e.stopPropagation()} // empêche le click global
            >
              <button className="icon-btn edit" >✏️</button>
              <button className="icon-btn delete">🗑️</button>
            </span>
            {id == t.id ? <span>{t.description}</span> : <span>cliquer pour voir la description</span>} {/*show description if ticket is selected else it just show the other message*/}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
