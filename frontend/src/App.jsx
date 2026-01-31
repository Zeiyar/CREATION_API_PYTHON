import { useEffect, useState } from 'react'
import './App.css'
import {getTickets, getTicketById, postTicket, deleteTicket, patchTicket} from './API';


function App() {

  // État pour stocker le nombre de tickets par statut
  const [ticketCounts, setTicketCounts] = useState({
    Active: 0,
    Pending: 0,
    Inactive: 0
  });

  const [backendError, setBackendError] = useState(null);
  const [allTickets,setAllTickets] = useState([]); // État pour stocker tous les tickets combinés
  const [filteredTickets, setFilteredTickets] = useState([]); // État pour stocker les tickets filtrés

  const [filterStatus, setFilterStatus] = useState("");    // Status filter
  const [filterPriority, setFilterPriority] = useState(""); // Priority filter

  const [editing, setEditing] = useState(false);    // État pour gérer l’édition d’un ticket
  const [adding,setAdding] = useState(false);     // État pour gérer l’ajout d’un nouveau ticket

  const [id,setId] = useState(null);        // État pour stocker l’ID du ticket en cours d’édition ou de visualisation
  const [title,setTitle] = useState("");    // État pour stocker le titre du ticket en cours d’édition ou d’ajout
  const [description,setDescription] = useState("");      // État pour stocker la description du ticket en cours d’édition ou d’ajout
  const [priority,setPriority] = useState("");        // État pour stocker la priorité du ticket en cours d’édition ou d’ajout
  const [status_ticket,setStatus_ticket] = useState("");      // État pour stocker le statut du ticket en cours d’édition ou d’ajout
  const [selectedTicketId, setSelectedTicketId] = useState(null);

  
  const url = "http://127.0.0.1:8000/tickets"

  useEffect(() => {
    fetch("http://127.0.0.1:8000/")  // endpoint root pour vérifier le backend
      .then(response => {if (!response.ok) {
          throw new Error(`Backend unreachable (status ${response.status})`);
        }
        return response.json();
      })
      .then(data => {console.log("Backend OK:", data);
        setBackendError(null); // pas d'erreur
      })
      .catch(err => {console.error("Erreur backend:", err);
        setBackendError("Le backend n'est pas lancé ou inaccessible. Veuillez démarrer uvicorn.");
      });
  }, []);

  
  
  // Utilisation de useEffect pour récupérer les tickets au montage du composant

  useEffect(() => {
  // Construire l’URL avec les filtres
  let query = [];
  if (filterStatus) query.push(`status=${filterStatus}`);
  if (filterPriority) query.push(`priority=${filterPriority}`);
  const fetchUrl = query.length > 0 ? `${url}?${query.join("&")}` : url;

  // Récupérer les tickets avec les filtres appliqués
  getTickets(fetchUrl).then(data => {
      if (!data || !data.tickets) return;   // Vérifier si les données sont valides

      const merged = [
      ...(data.tickets.Pending || []),
      ...(data.tickets.Active || []),
      ...(data.tickets.Inactive || []),
      ];

      setAllTickets(merged);
      setFilteredTickets(merged);
      })
    .catch(console.error);  // Gérer les erreurs de récupération des tickets
  }, []);


  useEffect(() => {
  let result = [...allTickets];

  if (filterStatus) {
    result = result.filter(t => t.status === filterStatus);
  }

  if (filterPriority) {
    result = result.filter(t => t.priority === filterPriority);
  }

  setFilteredTickets(result);
}, [filterStatus, filterPriority, allTickets]);

  
  // --- Add / Edit / Delete handlers ---
  const handleAddTicket = async () => {
    if (!title || !priority || !status_ticket) {
      alert("Title, Priority et Status sont obligatoires");
      return;
    }

    const newTicket = {
      title,
      description,
      priority,
      status: status_ticket,
      createdAt: new Date().toISOString().split(".")[0]
    };

    const created = await postTicket(url, newTicket);
    if (created) {
      setAllTickets(prev => [...prev, created]);
      setAdding(false);
      resetForm();
    }
  };


  const handleEditTicket = async () => {
    const updatedTicket = {
      title,
      description,
      priority,
      status: status_ticket,
      createdAt: new Date().toISOString().split(".")[0]
    };

    const updated = await patchTicket(url, id, updatedTicket);
    if (!updated) return;

    // Supprimer l'ancien ticket
    setAllTickets(prev =>
    prev.map(t => (t.id === id ? updated : t))
  );

  setEditing(false);
  setAdding(false);
  resetForm();
  };


  const handleDeleteTicket = async (ticketId) => {
  await deleteTicket(url, ticketId);
  setAllTickets(prev => prev.filter(t => t.id !== ticketId));
  };

  const handleEditClick = (ticket) => {
    setId(ticket.id);
    setTitle(ticket.title);
    setDescription(ticket.description);
    setPriority(ticket.priority);
    setStatus_ticket(ticket.status);
    setAdding(true);
    setEditing(true);
  };

  const resetForm = () => {
    setId(null);
    setTitle("");
    setDescription("");
    setPriority("");
    setStatus_ticket("");
  };

  const ticketCount = {
    Pending: allTickets.filter(t => t.status === "Pending").length,
    Active: allTickets.filter(t => t.status === "Active").length,
    Inactive: allTickets.filter(t => t.status === "Inactive").length,
  };



  // Rendu graphique du composant App.jsx
  return (


    <div className="tickets-page">

      {/* --- Message d'erreur backend --- */}
        {backendError && (
          <div className="backend-error">
            ⚠️ {backendError}
          </div>
        )}

      <h1 id="top">Tickets Dashboard</h1>

      {/* --- Compteur des tickets --- */}
      <div className="ticket-counts">
        <span>Pending: {ticketCount.Pending}</span>
        <span>Active: {ticketCount.Active}</span>
        <span>Inactive: {ticketCount.Inactive}</span>
      </div>


      {/* --- Filtres --- */}
      <div className="filters">
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>

        <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)}>
          <option value="">All Priority</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>

      {/* --- Formulaire Add/Edit en overlay --- */}
      {adding && (
        <div className="modal-overlay" onClick={() => { setAdding(false); setEditing(false); resetForm(); }}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>{editing ? "Modifier le ticket" : "Ajouter un ticket"}</h2>
            <input placeholder="Titre" value={title} onChange={e => setTitle(e.target.value)} />
            <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
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

            <div className="form-actions">
              <button className="btn primary" onClick={editing ? handleEditTicket : handleAddTicket}>
                {editing ? "Update" : "Add"} Ticket
              </button>
              <button className="btn secondary" onClick={() => { setAdding(false); setEditing(false); resetForm(); }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}


      <div className="add-ticket-bar">
            <button
              className="btn add"
              onClick={() => {
                setAdding(true);
                setEditing(false);
                resetForm();
              }}
            >
              ➕ Ajouter un ticket
            </button>
          </div>
      


      {/* --- Liste des tickets filtrés --- */}
      <div className="tickets-table">
        <div className="tickets-row tickets-head">
          <span>Title</span>
          <span>Status</span>
          <span>Priority</span>
          <span>Created</span>
          <span>Actions</span>
        </div>

        {filteredTickets.map(t => (
          <div key={t.id} className="tickets-row ticket-item"
            onClick={() => setSelectedTicketId(prevId => (prevId === t.id ? null : t.id))} // ← sélection du ticket
          >
            <span>{t.title}</span>
            <span className={`status ${t.status.toLowerCase()}`}>{t.status}</span>
            <span className={`priority ${t.priority.toLowerCase()}`}>{t.priority}</span>
            <span>{t.createdAt}</span>
            <span className="actions">
            <button onClick={() => handleEditClick(t)}>✏️</button>
            <button onClick={() => handleDeleteTicket(t.id)}>🗑️</button>
            </span>

            {/* Affichage conditionnel de la description */}
            {selectedTicketId === t.id ? (
              <div className="ticket-description">{t.description}</div>
            ) : (
              <div className="ticket-description-placeholder">Cliquez pour voir la description</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
