from fastapi import FastAPI, HTTPException
from script.add import add_ticket
from script.delete import delete_ticket
from script.get_one import get_one_ticket
from script.modify import modify_ticket
from script.sort import get_all_ticket_sorted
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

# Middleware CORS configuration pour autoriser les requêtes depuis le frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"], # ou [""] en dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#GET
@app.get("/tickets")                   # FastAPI decorator to define a GET endpoint at the root URL
def get_all_tickets_main():
    return get_all_ticket_sorted("tickets.json")
    
#GET{id}
@app.get("/tickets/{id}")
def get_one_ticket_main(id: int):
    ticket = get_one_ticket("tickets.json",id)
    if ticket is None:
        raise HTTPException(status_code=404,detail="Ticket not found")
    return ticket

#POST
@app.post("/tickets")
def add_ticket_main(new_ticket: dict):
    return add_ticket(new_ticket,"tickets.json")

#DELETE{id}
@app.delete("/tickets/{id}")    # Delete decorator to define a DELETE endpoint for deleting a ticket by its ID
def delete_ticket_main(id: int):
    deleted = delete_ticket(id,"tickets.json")
    # Check if the ticket was found and deleted else it raises a 404 error
    if not deleted:
        raise HTTPException(status_code=404, detail="Ticket not found/deleted")
    return {"message : ticket deleted"}

#MODIFY{id}
@app.patch("/tickets/{id}")     # Patch decorator to define a PATCH endpoint for modifying a ticket by its ID
def modify_ticket_main(id: int, updated: dict):
    updated = modify_ticket("tickets.json",id,updated)
    if not updated:
        raise HTTPException(status_code=404, detail="Ticket not found/updated")
    return updated
