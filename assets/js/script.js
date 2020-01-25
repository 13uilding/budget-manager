// ======================
// VARIABLES
// ======================

// 1st: pull initial budgetItems/lastID from localStorage to set initial variables
let budgetItems = JSON.parse(localStorage.getItem("budgetItems")) || [];
let lastID = parseInt(localStorage.getItem("lastID")) || 0;
// How do I grab the local storage? localStorage.getItem("name")




// ======================
// FUNCTIONS
// ======================

// 4th: function to update localStorage with latest budgetItems and latest lastID
const updateStorage = () => {
    localStorage.setItem("budgetItems", JSON.stringify(budgetItems));
    localStorage.setItem("lastID", lastID);
};

// 5th: function to render budgetItems on table; each item should be rendered in this format:
// <tr data-id="2"><td>Oct 14, 2019 5:08 PM</td><td>November Rent</td><td>Rent/Mortgage</td><td>1300</td><td>Fill out lease renewal form!</td><td class="delete"><span>x</span></td></tr>
// also, update total amount spent on page (based on selected category):
const renderItems = items => {
    const tbody = $("#budgetItems tbody");
    if (!items) items = budgetItems;
    tbody.empty();
    for (const {id, date, name, category, amount, notes} of items) {
        const row = `<tr data-id=${id}><td>${date}</td><td>${name}</td><td>${category}</td><td>$${parseFloat(amount).toFixed(2)}</td><td>${notes}</td><td class="delete"><span>x</span></td></tr>`;
        tbody.append(row);
    }

    const total = items.reduce((accum, item) => accum + parseFloat(item.amount), 0);
    $("#total").text(`$${total.toFixed(2)}`)
    console.log(total);
}


// ======================
// MAIN PROCESS
// ======================
renderItems();
// 2nd: wire up click event on 'Enter New Budget Item' button to toggle display of form
// Enter New Budget Item
$("#toggleFormButton, #hideForm").on("click", function(e) {
    // e.preventDefault();
    const addItemForm = $("#addItemForm");
    addItemForm.toggle("slow", () => {
        $("#toggleFormButton").text(addItemForm.is(":visible") ? "Hide Form" : "Enter New Budget Item");
    });
});

// 3rd: wire up click event on 'Add Budget Item' button, gather user input and add item to budgetItems array
// (each item's object should include: id / date / name / category / amount / notes)... then clear the form
// fields and trigger localStorage update/budgetItems rerender functions, once created
$("#addItem").on("click", function(e) {
    e.preventDefault();

    const newItem = {
        id: ++lastID,
        date: moment().format("lll"),
        name: $("#name").val().trim(),
        category: $("#category").val(),
        amount: $("#amount").val().trim(), //type number
        notes: $("#notes").val().trim()
    }

    if (!newItem.name || !newItem.category || !newItem.category) {
        alert("You must specify name, category, and amout for each budget item!");
        return false;
    }
    // Push
    budgetItems.push(newItem);
    // Getting rid of past material
    $("#addItemForm form")[0].reset(); // Form reset
    updateStorage();
    renderItems();


    localStorage.getItem(JSON.stringify(newItem));
    // console.log(newItem);
})

// 6th: wire up change event on the category select menu, show filtered budgetItems based on selection
$("#categoryFilter").on("change", function() {
    const category = $(this).val();
    if (category) {
        const filteredItems = budgetItems.filter(item => (category === item.category));
        renderItems(filteredItems);
    } else {
        renderItems();
    }
    // console.log(filteredItems);
});

// 7th: wire up click event on the delete button of a given row; on click delete that budgetItem
$("#budgetItems").on("click", ".delete span", function() {
    const id = $(this).parents("tr").data("id"); // .data("id")
    const remainingItems = budgetItems.filter( item => item.id !== parseInt(id));
    budgetItems = remainingItems;
    updateStorage();
    renderItems();
    $("#categoryFilter").val("");
})