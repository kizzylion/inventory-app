# Inventory Management App

Welcome to the **Inventory Management App** repository! This project is a tech gadget inventory management system built to streamline the tracking and management of items across multiple store locations. It supports CRUD operations for categories, items, stores, and suppliers, with features for stock movement and insightful inventory dashboards.

---

## Features

### Core Functionalities

- **Dynamic Inventory Management**: Create, read, update, and delete items, categories, and stores.
- **Supplier Integration**: Manage supplier details and link them to items.
- **Multi-Store Support**: Transfer items between store locations seamlessly.
- **Stock Insights**: View total inventory levels and stock history for each item.
- **Image Support**: Upload and store item images as binary data (BLOBs) in the PostgreSQL database.

### Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Templating Engine**: EJS
- **Middleware**: Multer (for image uploads)
- **CSS Framework**: Tailwind CSS

---

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- PostgreSQL (v12 or later)
- Git

### Installation

1. Clone this repository:

   ```bash
   git clone https://github.com/kizzylion/inventory-app
   cd inventory-management-app
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up the database:

   - Create a PostgreSQL database.
   - Run the SQL schema and seed scripts located in the `db/` folder to set up tables and seed data.

4. Create a `.env` file in the root directory:

   ```env
   DATABASE_HOST=localhost
   DATABASE_PORT=5432
   DATABASE_USER=yourusername
   DATABASE_PASSWORD=yourpassword
   DATABASE_NAME=yourdatabase

   ```

5. Start the server:
   ```bash
   npm start
   ```
   The app will be live at `http://localhost:3000`.

---

## Usage

### Adding a New Item

1. Navigate to `/products/new`.
2. Fill in the product details, including name, price, quantity, category, supplier, and an optional image.
3. Submit the form to add the item to the inventory.

### Viewing Total Inventory

- Access `/dashboard` to view:
  - Total stock for each item.
  - Movement history of items between stores.

### Managing Categories and Suppliers

- Use the respective pages to add, edit, or delete categories and suppliers.

---

## Project Structure

```
project-root/
├── controllers/       # Application logic
├── db/                # SQL scripts for schema and seed data
├── public/            # Static assets (CSS, JS, images)
├── routes/            # Express route handlers
├── views/             # EJS templates for UI
├── .env.example       # Environment variable example file
├── app.js             # Entry point
├── package.json       # Dependencies and scripts
```

---

## Future Enhancements

- **Authentication and Authorization**: Role-based access control for users.
- **Enhanced Reporting**: Detailed analytics on inventory trends.
- **RESTful API**: API endpoints for external integrations.

---

## Contributing

Contributions are welcome! Please fork the repository, create a new branch, and submit a pull request.

---

## License

This project is licensed under the [MIT License](LICENSE).

---

## Contact

For any questions or feedback, feel free to reach out:

- **Email**: kztchm@gmail.com

---

Thank you for checking out the Inventory Management App! 🎉
