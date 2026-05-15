const state = {
  users: [],
  pets: [],
  adoptions: [],
};

const elements = {
  apiStatus: document.querySelector('#apiStatus'),
  usersCount: document.querySelector('#usersCount'),
  petsCount: document.querySelector('#petsCount'),
  adoptionsCount: document.querySelector('#adoptionsCount'),
  availablePetsCount: document.querySelector('#availablePetsCount'),
  petsGrid: document.querySelector('#petsGrid'),
  usersList: document.querySelector('#usersList'),
  adoptionsList: document.querySelector('#adoptionsList'),
  adoptionUser: document.querySelector('#adoptionUser'),
  adoptionPet: document.querySelector('#adoptionPet'),
  registerForm: document.querySelector('#registerForm'),
  petForm: document.querySelector('#petForm'),
  adoptionForm: document.querySelector('#adoptionForm'),
  refreshDataButton: document.querySelector('#refreshDataButton'),
  petSearch: document.querySelector('#petSearch'),
  petFilter: document.querySelector('#petFilter'),
  toast: document.querySelector('#toast'),
};

const apiRequest = async (url, options = {}) => {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
    ...options,
  });

  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const errorMessage = body?.error || body?.message || 'Ocurrió un error inesperado';
    throw new Error(errorMessage);
  }

  return body;
};

const showToast = (message, tone = 'success') => {
  elements.toast.textContent = message;
  elements.toast.className = `toast show ${tone}`;
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => {
    elements.toast.className = 'toast';
  }, 3200);
};

const formatDate = (value) => {
  if (!value) return 'Sin fecha';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

const renderStats = () => {
  const availablePets = state.pets.filter((pet) => !pet.adopted).length;
  elements.usersCount.textContent = state.users.length;
  elements.petsCount.textContent = state.pets.length;
  elements.adoptionsCount.textContent = state.adoptions.length;
  elements.availablePetsCount.textContent = availablePets;
};

const renderPets = () => {
  const search = elements.petSearch.value.trim().toLowerCase();
  const filter = elements.petFilter.value;

  const filteredPets = state.pets.filter((pet) => {
    const matchesSearch =
      !search ||
      pet.name?.toLowerCase().includes(search) ||
      pet.specie?.toLowerCase().includes(search);

    const matchesStatus =
      filter === 'all' ||
      (filter === 'available' && !pet.adopted) ||
      (filter === 'adopted' && pet.adopted);

    return matchesSearch && matchesStatus;
  });

  if (!filteredPets.length) {
    elements.petsGrid.innerHTML = '<div class="empty-state">No hay mascotas que coincidan con el filtro actual.</div>';
    return;
  }

  elements.petsGrid.innerHTML = filteredPets
    .map(
      (pet) => `
        <article class="pet-card">
          <div class="badge-row">
            <span class="badge">${pet.specie || 'Sin especie'}</span>
            <span class="badge ${pet.adopted ? 'danger' : 'success'}">
              ${pet.adopted ? 'Adoptada' : 'Disponible'}
            </span>
          </div>
          <h3>${pet.name || 'Mascota sin nombre'}</h3>
          <p>Nacimiento: ${formatDate(pet.birthDate)}</p>
          <small>ID: ${pet._id}</small>
        </article>
      `,
    )
    .join('');
};

const renderUsers = () => {
  if (!state.users.length) {
    elements.usersList.innerHTML = '<li class="empty-state">Todavía no hay usuarios para mostrar.</li>';
    return;
  }

  elements.usersList.innerHTML = state.users
    .slice(0, 6)
    .map(
      (user) => `
        <li>
          <strong>${user.first_name} ${user.last_name}</strong>
          <small>${user.email}</small>
          <small>Rol: ${user.role || 'user'} · Mascotas asociadas: ${user.pets?.length ?? 0}</small>
        </li>
      `,
    )
    .join('');
};

const renderAdoptions = () => {
  if (!state.adoptions.length) {
    elements.adoptionsList.innerHTML = '<li class="empty-state">Aún no hay adopciones registradas.</li>';
    return;
  }

  elements.adoptionsList.innerHTML = state.adoptions
    .slice(0, 6)
    .map(
      (adoption) => {
        const owner = state.users.find((user) => user._id === adoption.owner);
        const pet = state.pets.find((item) => item._id === adoption.pet);

        return `
          <li>
            <strong>${pet?.name || 'Mascota'} → ${owner ? `${owner.first_name} ${owner.last_name}` : adoption.owner}</strong>
            <small>Mascota: ${pet?.specie || adoption.pet}</small>
            <small>Adopción ID: ${adoption._id}</small>
          </li>
        `;
      },
    )
    .join('');
};

const renderAdoptionOptions = () => {
  const userOptions = state.users
    .map(
      (user) => `<option value="${user._id}">${user.first_name} ${user.last_name} · ${user.email}</option>`,
    )
    .join('');

  const petOptions = state.pets
    .filter((pet) => !pet.adopted)
    .map((pet) => `<option value="${pet._id}">${pet.name} · ${pet.specie}</option>`)
    .join('');

  elements.adoptionUser.innerHTML = userOptions || '<option value="">No hay usuarios disponibles</option>';
  elements.adoptionPet.innerHTML = petOptions || '<option value="">No hay mascotas disponibles</option>';
};

const renderAll = () => {
  renderStats();
  renderPets();
  renderUsers();
  renderAdoptions();
  renderAdoptionOptions();
};

const loadDashboard = async () => {
  elements.apiStatus.textContent = 'Sincronizando información…';

  const [usersResponse, petsResponse, adoptionsResponse] = await Promise.all([
    apiRequest('/api/users'),
    apiRequest('/api/pets'),
    apiRequest('/api/adoptions'),
  ]);

  state.users = usersResponse.payload ?? [];
  state.pets = petsResponse.payload ?? [];
  state.adoptions = adoptionsResponse.payload ?? [];

  elements.apiStatus.textContent = 'API conectada correctamente';
  renderAll();
};

const submitRegister = async (event) => {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const payload = Object.fromEntries(formData.entries());

  await apiRequest('/api/sessions/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  event.currentTarget.reset();
  showToast('Usuario registrado con éxito.');
  await loadDashboard();
};

const submitPet = async (event) => {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const payload = Object.fromEntries(formData.entries());

  await apiRequest('/api/pets', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  event.currentTarget.reset();
  showToast('Mascota publicada correctamente.');
  await loadDashboard();
};

const submitAdoption = async (event) => {
  event.preventDefault();
  const userId = elements.adoptionUser.value;
  const petId = elements.adoptionPet.value;

  if (!userId || !petId) {
    showToast('Seleccioná un usuario y una mascota disponible.', 'error');
    return;
  }

  await apiRequest(`/api/adoptions/${userId}/${petId}`, { method: 'POST' });
  showToast('Adopción realizada con éxito.');
  await loadDashboard();
};

const attachEvents = () => {
  elements.registerForm.addEventListener('submit', (event) => {
    submitRegister(event).catch((error) => showToast(error.message, 'error'));
  });

  elements.petForm.addEventListener('submit', (event) => {
    submitPet(event).catch((error) => showToast(error.message, 'error'));
  });

  elements.adoptionForm.addEventListener('submit', (event) => {
    submitAdoption(event).catch((error) => showToast(error.message, 'error'));
  });

  elements.refreshDataButton.addEventListener('click', () => {
    loadDashboard()
      .then(() => showToast('Datos actualizados.'))
      .catch((error) => showToast(error.message, 'error'));
  });

  elements.petSearch.addEventListener('input', renderPets);
  elements.petFilter.addEventListener('change', renderPets);
};

attachEvents();
loadDashboard().catch((error) => {
  elements.apiStatus.textContent = 'No se pudo conectar con la API';
  showToast(error.message, 'error');
});
