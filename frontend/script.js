// SCRIPT AVEC MODIFICATIONS COMPLÈTES POUR CATWAYS ET RÉSERVATIONS

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  const errorDiv = document.getElementById('error');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      const res = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        window.location.href = 'dashboard.html';
      } else {
        errorDiv.textContent = data.message || "Identifiants invalides";
      }
    });
    return;
  }

  const token = localStorage.getItem('token');
  if (!token) return window.location.href = 'index.html';

  const userInfo = document.getElementById('userInfo');
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const email = payload.email || "Utilisateur inconnu";
    const date = new Date().toLocaleDateString('fr-FR', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
    if (userInfo) userInfo.innerHTML = `Connecté en tant que <b>${email}</b> – ${date}`;
  } catch {}

  // -------- CATWAYS --------
  const list = document.getElementById('catwayList');
  const addForm = document.getElementById('addCatwayForm');

  if (list) {
    fetch('http://localhost:3000/api/catways', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        data.forEach(catway => {
          const li = document.createElement('li');
          li.innerHTML = `
            <span>#${catway.catwayNumber} - ${catway.catwayType} - ${catway.catwayState}</span>
            <div class="actions">
              <button onclick="editCatway(${catway.catwayNumber}, '${catway.catwayType}', '${catway.catwayState}')">✏️</button>
              <button onclick="deleteCatway(${catway.catwayNumber})">🗑️</button>
            </div>
          `;
          list.appendChild(li);
        });
      });
  }

  if (addForm) {
    addForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const body = {
        catwayNumber: document.getElementById('catwayNumber').value,
        catwayType: document.getElementById('catwayType').value,
        catwayState: document.getElementById('catwayState').value
      };

      const res = await fetch('http://localhost:3000/api/catways', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });

      if (res.ok) {
        alert("Catway ajouté !");
        location.reload();
      } else {
        alert("Erreur");
      }
    });
  }

  // -------- RESERVATIONS --------
  const reservationList = document.getElementById('reservationList');
  if (reservationList) {
    fetch('http://localhost:3000/api/reservations', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        reservationList.innerHTML = '';
        data.forEach(res => {
          const li = document.createElement('li');
          li.innerHTML = `
            <span>Catway #${res.catwayNumber} – ${res.clientName} – ${res.boatName} (${res.startDate?.slice(0, 10)} ➔ ${res.endDate?.slice(0, 10)})</span>
            <div class="actions">
              <button onclick="editReservation('${res._id}', ${res.catwayNumber}, '${res.clientName}', '${res.boatName}', '${res.startDate?.slice(0, 10)}', '${res.endDate?.slice(0, 10)}')">✏️</button>
              <button onclick="deleteReservation('${res._id}')">🗑️</button>
            </div>
          `;
          reservationList.appendChild(li);
        });
      });
  }

  const reservationForm = document.getElementById('addReservationForm');
  if (reservationForm) {
    reservationForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const body = {
        catwayNumber: document.getElementById('resCatwayNumber').value,
        clientName: document.getElementById('clientName').value,
        boatName: document.getElementById('boatName').value,
        startDate: document.getElementById('startDate').value,
        endDate: document.getElementById('endDate').value
      };

      const res = await fetch('http://localhost:3000/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });

      if (res.ok) {
        alert("Réservation ajoutée !");
        location.reload();
      } else {
        alert("Erreur");
      }
    });
  }

  // -------- UTILISATEURS --------
  const userList = document.getElementById('userList');
  if (userList) {
    fetch('http://localhost:3000/api/users', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(users => {
        users.forEach(u => {
          const li = document.createElement('li');
          li.textContent = `${u.username} – ${u.email}`;
          userList.appendChild(li);
        });
      });
  }

  const addUserForm = document.getElementById('addUserForm');
  if (addUserForm) {
    addUserForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const body = {
        username: document.getElementById('newUsername').value,
        email: document.getElementById('newEmail').value,
        password: document.getElementById('newPassword').value
      };

      const res = await fetch('http://localhost:3000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });

      if (res.ok) {
        alert("Utilisateur créé !");
        location.reload();
      } else {
        alert("Erreur");
      }
    });
  }
});

function logout() {
  localStorage.removeItem('token');
  window.location.href = 'index.html';
}

function scrollToSection(id) {
  const map = {
    catways: 'catwayList',
    reservations: 'reservationList',
    users: 'userList'
  };
  const el = document.getElementById(map[id]);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

function editCatway(number, currentType, currentState) {
  const newType = prompt("Nouveau type :", currentType);
  const newState = prompt("Nouveau état :", currentState);
  if (!newType || !newState) return;

  fetch(`http://localhost:3000/api/catways/${number}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify({ catwayType: newType, catwayState: newState })
  }).then(res => {
    if (res.ok) location.reload();
    else alert("Erreur de mise à jour");
  });
}

function deleteCatway(number) {
  if (!confirm(`Supprimer le catway #${number} ?`)) return;

  fetch(`http://localhost:3000/api/catways/${number}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  }).then(res => {
    if (res.ok) location.reload();
    else alert("Erreur de suppression");
  });
}

function editReservation(id, currentCatway, currentClient, currentBoat, currentStart, currentEnd) {
  const newCatway = prompt("Nouveau numéro de catway :", currentCatway);
  const newClient = prompt("Nouveau client :", currentClient);
  const newBoat = prompt("Nouveau bateau :", currentBoat);
  const newStart = prompt("Nouvelle date de début :", currentStart);
  const newEnd = prompt("Nouvelle date de fin :", currentEnd);

  if (!newCatway || !newClient || !newBoat || !newStart || !newEnd) return;

  fetch(`http://localhost:3000/api/reservations/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify({
      catwayNumber: newCatway,
      clientName: newClient,
      boatName: newBoat,
      startDate: newStart,
      endDate: newEnd
    })
  }).then(res => {
    if (res.ok) location.reload();
    else alert("Erreur de mise à jour");
  });
}

function deleteReservation(id) {
  if (!confirm("Supprimer cette réservation ?")) return;

  fetch(`http://localhost:3000/api/reservations/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  }).then(res => {
    if (res.ok) location.reload();
    else alert("Erreur de suppression");
  });
}
