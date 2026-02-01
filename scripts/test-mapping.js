const rawData = [
    {
        "_id": "6963d475e422ca517b2c8873",
        "name": "Ganesh Home",
        "email": "ganeshsamgir79@gmail.com",
        "phone": "9423523735",
        "city": "Pune",
        "category": "New Inquiry",
        "tags": [],
        "totalBilled": 0,
        "totalPaid": 0,
        "pendingAmount": 0,
        "createdAt": "2026-01-11T16:48:53.103Z",
        "updatedAt": "2026-01-11T16:48:53.103Z",
        "__v": 0
    },
    {
        "_id": "696376b78efd53a8aeb0b89e",
        "name": "Aditi & Neel Mehta",
        "email": "aditi.neel@example.com",
        "phone": "+91 90040 22217",
        "city": "Mumbai",
        "state": "MH",
        "category": "New Inquiry",
        "eventType": "Engagement",
        "budget": 620000,
        "status": "Lead",
        "tags": [
            "sunrise",
            "beach"
        ],
        "notes": "Destination engagement at Aksa beach.",
        "totalBilled": 0,
        "totalPaid": 0,
        "pendingAmount": 0,
        "__v": 0,
        "createdAt": "2026-01-11T10:08:55.114Z"
    }
];

// The exact mapping logic from AdminClients.jsx
const mappedData = rawData.map(c => ({
    ...c,
    id: c._id,
    whatsapp: c.whatsapp || c.phone || "",
    event: c.event || c.eventType || "Wedding", // Fallback logic
    budget: c.budget || 0,
    status: c.status || "Lead" // Fallback logic
}));

console.log(JSON.stringify(mappedData, null, 2));
