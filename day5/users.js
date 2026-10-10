const loadBtn = document.getElementById('load-users');
const filterInput = document.getElementById('filter-input');
const statusP = document.getElementById('status');
const usersList = document.getElementById('users-list');

let allUsers = [];

// Render users array to the DOM
function renderUsers(list) {
    usersList.innerHTML = '';

    if (list.length === 0) {
        statusP.textContent = 'No users match your filter.';
        return;
    }

    list.forEach(user => {
        const li = document.createElement('li');
        
        const nameEl = document.createElement('strong');
        nameEl.textContent = user.name;
        
        const emailEl = document.createElement('div');
        emailEl.textContent = `Email: ${user.email}`;
        
        const cityEl = document.createElement('div');
        cityEl.textContent = `City: ${user.address ? user.address.city : 'N/A'}`;
        
        const companyEl = document.createElement('div');
        companyEl.textContent = `Company: ${user.company ? user.company.name : 'N/A'}`;

        li.appendChild(nameEl);
        li.appendChild(emailEl);
        li.appendChild(cityEl);
        li.appendChild(companyEl);

        usersList.appendChild(li);
    });
}

// Fetch users from API using async/await and try/catch/finally
async function loadUsers() {
    loadBtn.disabled = true;
    statusP.textContent = 'Loading users...';
    usersList.innerHTML = '';

    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        allUsers = await response.json();
        statusP.textContent = `Successfully loaded ${allUsers.length} users.`;
        renderUsers(allUsers);
    } catch (error) {
        statusP.textContent = `Failed to load users: ${error.message}`;
    } finally {
        loadBtn.disabled = false;
    }
}

// Filter users dynamically on input event (case-insensitive)
filterInput.addEventListener('input', () => {
    const query = filterInput.value.toLowerCase();
    const filtered = allUsers.filter(user => user.name.toLowerCase().includes(query));
    
    if (allUsers.length > 0) {
        statusP.textContent = filtered.length > 0 ? `Showing ${filtered.length} matching users.` : '';
    }
    
    renderUsers(filtered);
});

loadBtn.addEventListener('click', loadUsers);
