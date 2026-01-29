const headers = {
  "Content-Type": "application/json",
};

/* GET ALL */
export async function getTickets(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("GET failed");
    return await res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
}

/* GET BY ID */
export async function getTicketById(url, id) {
  try {
    const res = await fetch(`${url}/${id}`);
    if (!res.ok) throw new Error("GET ID failed");
    return await res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
}

/* POST */
export async function postTicket(url, newTicket) {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(newTicket),
    });
    if (!res.ok) throw new Error("POST failed");
    return await res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
}

/* DELETE */
export async function deleteTicket(url, id) {
  try {
    const res = await fetch(`${url}/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("DELETE failed");
    return await res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
}

/* PATCH */
export async function patchTicket(url, id, updatedTicket) {
  try {
    const res = await fetch(`${url}/${id}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(updatedTicket),
    });
    if (!res.ok) throw new Error("PATCH failed");
    return await res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
}
