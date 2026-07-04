# 💊 Pawlos Drug Store

A role-based front-end web app for an online pharmacy — customers can browse and buy products, while admins manage inventory and orders from a dashboard.

Built with plain **HTML, CSS, and JavaScript** — no frameworks, no build tools, no dependencies to install. Just open it in a browser.

![Made with HTML](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![Made with CSS](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![Made with JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)

---

## ✨ Features

### 🧑 Customer
- Browse products by category (Pain Relief, Vitamins, First Aid, Devices, Baby Care, Hygiene, Skin Care)
- Live search across product name, category, and description
- Add to cart with quantity controls
- Cart drawer with subtotal, delivery fee, and total
- Free delivery on orders over 500 ETB
- Checkout flow that creates an order

### 🛡️ Admin
- Dashboard overview: total products, total orders, total revenue, low-stock alerts
- Manage products: add, edit, and delete items via a modal form
- View and update order status (Pending → Shipped → Delivered)
- See recent orders at a glance

### 🔐 Role-based access
- Simple login screen with demo accounts
- Customers and admins see completely different interfaces after logging in

---

## 📸 Preview

| Login | Customer Storefront | Admin Dashboard |
|---|---|---|
| Sign in screen with demo credentials | Product grid, search, cart drawer | Stats, product table, order management |

*(Add your own screenshots here once deployed — see [Adding Screenshots](#adding-screenshots) below.)*

---

## 🚀 Getting Started

### Run it locally

1. Clone or download this repository
   ```bash
   git clone https://github.com/your-username/pawlos-drug-store.git
   cd pawlos-drug-store
   ```
2. Open `index.html` directly in your browser

   **or**, for auto-reload on save, use the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension in VS Code:
   - Right-click `index.html` → **Open with Live Server**

No installation, no `npm install`, no server required.

### Demo accounts

| Role | Username | Password |
|---|---|---|
| Admin | `admin` | `admin123` |
| Customer | `customer` | `customer123` |

---

## 📁 Project Structure

```
pawlos-drug-store/
├── index.html      # Page structure: login screen, customer view, admin view
├── style.css        # All styling (colors, layout, components, responsive rules)
├── script.js         # App logic: auth, product data, cart, checkout, admin CRUD
└── README.md         # You are here
```

---

## 🛠️ Built With

- **HTML5** – semantic structure
- **CSS3** – custom properties (CSS variables), Flexbox, Grid, responsive design
- **Vanilla JavaScript** – DOM rendering, state management, event handling
- **Google Fonts** – Poppins (headings) & Inter (body text)

---

## ⚠️ Known Limitations

This is a **front-end-only prototype**. That means:

- **Data does not persist.** Products you add/edit and orders placed live in memory and reset when the page is refreshed.
- **Authentication is not secure.** Usernames/passwords are hardcoded in `script.js` for demo purposes only — do not use real credentials or deploy this as-is for real users.
- **No real payment processing.** Checkout simply records an order in memory.

These are expected for a static demo. See the roadmap below for how to make it production-ready.

---

## 🗺️ Roadmap / Next Steps

To turn this into a real, production-ready pharmacy platform:

- [ ] Add a backend (e.g. Node.js/Express, Django, or Firebase) for persistent data storage
- [ ] Move product and order data into a real database (PostgreSQL, MongoDB, etc.)
- [ ] Implement secure authentication (hashed passwords, sessions/JWT)
- [ ] Add real payment gateway integration (Chapa, Stripe, etc.)
- [ ] Add image uploads for products instead of emoji icons
- [ ] Add pagination for large product catalogs
- [ ] Add customer order history / account page
- [ ] Add email/SMS order confirmations

---

## 🖼️ Adding Screenshots

Once you've deployed or run the project, add screenshots to a `/screenshots` folder and reference them here:

```markdown
![Customer storefront](screenshots/storefront.png)
![Admin dashboard](screenshots/dashboard.png)
```

---

## 📄 License

This project is open source and available for personal or educational use. Add a `LICENSE` file (e.g. MIT) if you plan to share or accept contributions publicly.

---

## 🙋 About

**Pawlos Drug Store** is a demo project showcasing a role-based e-commerce interface for a pharmacy, built to practice front-end development: DOM manipulation, state management, responsive design, and UI/UX for two distinct user roles.

Feel free to fork this project, use it as a learning reference, or build on top of it.
