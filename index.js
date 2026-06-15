let allUsers = []; // Line 1: Create an empty box to hold the list of users we get from the database.

async function fetchUsers() {
  // Line 3: Create a special function that can pause and wait for internet data.
  const tableBody = document.getElementById("userTableBody"); // Line 4: Find the table body element from your HTML.
  tableBody.innerHTML = `<tr><td colspan="8" class="text-center py-12 text-gray-400">Loading live data...</td></tr>`; // Line 5: Show "Loading..." text on screen.
  try {
    // Line 6: Try running the database fetching sequence.
    const response = await fetch(
      "https://charity-minds-backend.onrender.com/api/v1/users",
    ); // Line 7: Contact your Render API URL.
    const result = await response.json(); // Line 8: Turn raw internet data into a clean JavaScript object.
    allUsers = Array.isArray(result) ? result : result.data || []; // Line 9: Store the array inside our master allUsers variable.
    document.getElementById("totalUsersCount").textContent = allUsers.length; // Line 10: Map to HTML id="totalUsersCount".
    filterTable(); // Line 11: Run the filter function right away to draw the data.
  } catch (error) {
    // Line 12: Catch network errors safely.
    tableBody.innerHTML = `<tr><td colspan="8" class="text-center py-12 text-red-500">Failed to load data.</td></tr>`; // Line 13: Print clean error message.
  }
}

async function handleAddNewUser() {
  // Line 17: Function that fires when your "+ Add New User" button is clicked.
  const fName = prompt("Enter First Name:"); // Line 18: Ask for first name.
  const lName = prompt("Enter Last Name:"); // Line 19: Ask for last name.
  const genderSelection = prompt("Enter Gender (male or female):"); // Line 20: Ask for gender.

  if (!fName || !lName) return alert("First and Last name are required!"); // Line 22: Stop if core fields are blank.

  // Create dummy fallback data for the remaining fields so the database backend validation passes smoothly!
  const newUser = {
    // Line 25: Build the profile object matching your table columns exactly.
    firstName: fName, // Line 26: Assign first name.
    lastName: lName, // Line 27: Assign last name.
    username: fName.toLowerCase() + Math.floor(Math.random() * 100), // Line 28: STRING METHOD: Auto-generate a clean username string.
    email: fName.toLowerCase() + "@example.com", // Line 29: STRING METHOD: Auto-generate an email string.
    phone: "+123456789", // Line 30: Fallback phone number text string.
    dob: "2000-01-01", // Line 31: Fallback birthdate text string.
    gender: genderSelection ? String(genderSelection).toLowerCase() : "male", // Line 32: STRING METHOD: Turn gender lowercase.
    createdAt: new Date().toISOString(), // Line 33: Create a valid ISO timestamp string for right now.
  };

  try {
    // Line 36: Attempt to upload this profile to the backend database.
    const response = await fetch(
      "https://charity-minds-backend.onrender.com/api/v1/users",
      {
        // Line 37: Connect to backend.
        method: "POST", // Line 38: Use POST to create a new entry.
        headers: { "Content-Type": "application/json" }, // Line 39: Send as JSON text format.
        body: JSON.stringify(newUser), // Line 40: Convert object into raw string text.
      },
    );

    if (response.ok) {
      // Line 43: If the server successfully created the user...
      alert("User saved successfully!"); // Line 44: Notify the browser user.
      await fetchUsers(); // Line 45: Wait for a fresh download sequence so the new user instantly appends to your table layout!
    } else {
      // Line 46: If the server rejected it (e.g., 400 Bad Request error)...
      const errData = await response.json().catch(() => ({})); // Line 47: Try parsing the error message text.
      alert(
        "Server Error: " +
          (errData.message || "Failed to save user. Check data structure."),
      ); // Line 48: Show exactly why it failed.
    }
  } catch (error) {
    alert("Network error: Could not reach the database server.");
  } // Line 50: Handle offline/drop connection states.
}

function filterTable() {
  // Line 53: Main sorting and presentation engine.
  const chosenGender = document.getElementById("genderFilter").value; // Line 54: Read selection value from your HTML gender dropdown.
  const chosenDate = document.getElementById("dateFilter").value; // Line 55: Read selection value from your HTML date dropdown.
  const tableBody = document.getElementById("userTableBody"); // Line 56: Grab the row layout container.
  tableBody.innerHTML = ""; // Line 57: Wipe out previous table canvas entries.
  let matchCount = 0; // Line 58: Clear the match score tracker to zero.

  allUsers.forEach((user) => {
    // Line 60: Inspect every profile entry in our list.
    const userGender = user.gender ? String(user.gender).toLowerCase() : ""; // Line 61: STRING METHOD: Clean user gender data string to lowercase.
    const userCreated = user.createdAt ? String(user.createdAt) : ""; // Line 62: STRING METHOD: Read timestamp string.
    const genderMatches = chosenGender === "all" || userGender === chosenGender; // Line 63: Exact check logic match.
    const dateMatches =
      chosenDate === "all" || userCreated.includes(chosenDate); // Line 64: STRING METHOD: Check if option string exists inside timeline text.

    if (genderMatches && dateMatches) {
      // Line 66: If profile clears both logic tests...
      matchCount++; // Line 67: Bump the match total up by one.
      const cleanDate = userCreated.includes("T")
        ? userCreated.split("T")[0]
        : userCreated; // Line 68: STRING METHOD: Drop time segment at marker character 'T'.
      tableBody.innerHTML += `
        <tr class="hover:bg-slate-50 border-b border-gray-100 transition duration-150">
          <td class="py-4 font-medium text-slate-900">${user.firstName || ""}</td>
          <td class="py-4">${user.lastName || ""}</td>
          <td class="py-4 text-slate-500">${user.username || ""}</td>
          <td class="py-4 text-slate-500">${user.email || ""}</td>
          <td class="py-4 text-slate-500">${user.phone || ""}</td>
          <td class="py-4 text-slate-500">${user.dob || ""}</td>
          <td class="py-4 text-slate-500">${user.gender || ""}</td>
          <td class="py-4 text-xs font-mono text-slate-400">${cleanDate}</td>
        </tr>`; // Lines 70-81: Append layout rows dynamically to fill up table body.
    }
  });
  document.getElementById("filteredUsersCount").textContent = matchCount; // Line 84: Map matching list counter to HTML.
}

// Event Listeners:
window.addEventListener("DOMContentLoaded", fetchUsers); // Line 88: Download data once page is loaded.
document.getElementById("genderFilter").addEventListener("change", filterTable); // Line 89: Recalculate tables on gender shift.
document.getElementById("dateFilter").addEventListener("change", filterTable); // Line 90: Recalculate tables on date shift.
document.getElementById("addNew").addEventListener("click", handleAddNewUser); // Line 91: Map to your HTML id="addNew" button.
