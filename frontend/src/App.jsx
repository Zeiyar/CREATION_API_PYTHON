import { useEffect, useState } from 'react'
import './App.css'
import {getTickets, getTicketById, postTicket, deleteTicket, patchTicket} from './API';


function App() {
  const [editing, setEditing] = useState(false);

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
  const [count, setCount] = useState({
      Pending: 0,
      Active: 0,
      Inactive: 0,
    });

  const url = "http://127.0.0.1:8000/tickets"

  // Utilisation de useEffect pour récupérer les tickets au montage du composant
  useEffect(() => {
  getTickets(url)
    .then(data => {
      if (!data || !data.tickets) return;
      setTickets(data.tickets);
      setCount(data.count);
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

  const handleDeleteTicket = async(ticket) => {
    await deleteTicket(url,ticket.id);
    
    setTickets(prev => {
    const newState = {
      Active: prev.Active.filter(t => t.id !== ticket.id),
      Pending: prev.Pending.filter(t => t.id !== ticket.id),
      Inactive: prev.Inactive.filter(t => t.id !== ticket.id),
    };
    return newState;
      });
    };

  const handleEditClick = (ticket) => {
    setId(ticket.id);
    setTitle(ticket.title);
    setDescription(ticket.description);
    setPriority(ticket.priority);
    setStatus_ticket(ticket.status);
    setEditing(true);
    setAdding(true);
  };
  
  const handlePatchTicket = async () => {
    const updatedTicket = {
      title,
      description,
      priority,
      status: status_ticket.trim(),
      createdAt: new Date().toISOString().split(".")[0],
    };

    const updated = await patchTicket(url, id, updatedTicket);

    if (!updated) return;

    setTickets(prev => {
      const newState = {
        Active: [...prev.Active],
        Pending: [...prev.Pending],
        Inactive: [...prev.Inactive],
      };

      // retirer l’ancien ticket
      Object.keys(newState).forEach(status => {
        newState[status] = newState[status].filter(t => t.id !== id);
      });

      // ajouter le nouveau
      newState[updated.status] = [...newState[updated.status] || [], updated];

      return newState;
    });

    setAdding(false);
    setEditing(false);
  };

  const handleAddTicket = async () => {
    const newTicket = {
      title,
      description,
      priority,
      status: status_ticket.trim(),
      createdAt: new Date().toISOString(),
    };

    if (!priority || !status_ticket) {
      alert("Priority et status obligatoires");
      return;
    }

    const created = await postTicket(url, newTicket);

    if (created) {
      setTickets(prev => ({
        ...prev,
        [created.status]: [...prev[created.status], created]
      }));

      setAdding(false);
    }
  };

  return (
    <div className="tickets-page">
      <div className="tickets-header-bar">
        <h1 id="top">All open tickets</h1>

        <div className="stats-container">
          <div className="stat-card pending">
            <span className="stat-number">{count.Pending ?? 0}</span>
            <span className="stat-label">Pending</span>
          </div>

          <div className="stat-card active">
            <span className="stat-number">{count.Active ?? 0}</span>
            <span className="stat-label">Active</span>
          </div>

          <div className="stat-card inactive">
            <span className="stat-number">{count.Inactive ?? 0}</span>
            <span className="stat-label">Inactive</span>
          </div>
        </div>
        
        {adding && (
          <div className="ticket-form">
            <input
              placeholder="Titre"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />

            <textarea
              placeholder="Description"
              value={description}
              onChange={e => setDescription(e.target.value)}
            />

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
              <button
                className="btn primary"
                onClick={editing ? handlePatchTicket : handleAddTicket}
              >
                {editing ? "Update ticket" : "Create ticket"}
              </button>

              <button
                className="btn secondary"
                onClick={() => {
                  setAdding(false);
                  setEditing(false);
                }}
              >
                Cancel
              </button>
            </div>
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
              <button
                className="icon-btn edit"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditClick(t);
                }}
              >
                <a href="#top">✏️</a>
              </button>

              <button
                className="icon-btn delete"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteTicket(t);
                }}
              >
                <a href="#top">🗑️</a>
              </button>
            </span>
            {id == t.id ? <span>{t.description}</span> : <span>cliquer pour voir la description</span>} {/*show description if ticket is selected else it just show the other message*/}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
