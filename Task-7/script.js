const userList = document.getElementById("userList");
const errorDiv = document.getElementById("error");
const reloadBtn = document.getElementById("reloadBtn");

// Fake generators
function getRandomEmail(name) {
  const domains = ["mail.com", "webmail.io", "coolmail.net", "fakemail.org"];
  const username = name.toLowerCase().replace(/\s/g, '') + Math.floor(Math.random() * 1000);
  const domain = domains[Math.floor(Math.random() * domains.length)];
  return `${username}@${domain}`;
}

function getRandomAddress() {
  const streets = ["Sunset Blvd", "Palm Street", "Maple Avenue", "Ocean Drive", "Rosewood Lane", "Riverstone Rd", "Emerald Path"];
  const cities = ["NeoCity", "Rainville", "Techburg", "Greenfield", "Stonehaven", "Lumina", "Skybay"];
  return `${streets[Math.floor(Math.random() * streets.length)]}, ${cities[Math.floor(Math.random() * cities.length)]}`;
}

// Shuffle function
function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

// Main function
async function fetchUsers() {
  userList.innerHTML = '';
  errorDiv.textContent = '';

  try {
    const res = await fetch('https://jsonplaceholder.typicode.com/users');
    if (!res.ok) throw new Error(`Status: ${res.status}`);

    let users = await res.json();

    // Shuffle users and take a random number between 5-10
    users = shuffleArray(users).slice(0, Math.floor(Math.random() * 5) + 5);

    users.forEach(user => {
      const fakeEmail = getRandomEmail(user.name);
      const fakeAddress = getRandomAddress();

      const card = document.createElement("div");
      card.className = "user-card";
      card.innerHTML = `
        <h2>${user.name}</h2>
        <p><strong>Email:</strong> ${fakeEmail}</p>
        <p><strong>Address:</strong> ${fakeAddress}</p>
      `;
      userList.appendChild(card);
    });

  } catch (error) {
    errorDiv.textContent = `Error fetching data: ${error.message}`;
  }
}

// Initial load and reload
fetchUsers();
reloadBtn.addEventListener("click", fetchUsers);
