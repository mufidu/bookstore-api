# Online Bookstore Management System

This project is a backend system for managing an online bookstore. It allows customers to browse, search, and purchase books while providing functionality for inventory and customers management for admins.

## Features

## CI/CD
- **Testing:** Unit and integration tests are run on GitHub Actions every time a commit is pushed.
- **Continuous Deployment:** Every successful push to the main branch triggers a deployment to fly.io.

### User Authentication
- **Roles:** Two user roles are supported: customer and admin.
- **Customer Authentication:** Customers can register, log in, and update their profile information.
- **Admin Management:** Admins can manage customers' accounts.

### Book Management
- **Add Books:** Admins can add new books to the inventory via an API endpoint.
- **Update Books:** An endpoint is available for admins to update existing book details.
- **Retrieve Books:** Users can retrieve a list of books with filtering options; genre, author, and year.

### Shopping Cart
- **Add to Cart:** Customers can add books to their shopping cart.
- **Update Cart:** Customers can update the quantity or remove items from their cart.
- **Total Price Calculation:** The total price of items in the cart is automatically calculated each time the cart is updated.

### Order Processing
- **Place Orders:** Customers can place orders to checkout their carts.
- **Inventory Deduction:** The ordered quantity is deducted from the inventory upon order placement.
- **Payment Gateway:** Midtrans payment gateway is integrated to process order payments. Customers can pay using QRIS.
- **Email Notification:** Customers receive an email confirmation after placing an order.

### Inventory Management
- **View and Manage Inventory:** Admins can view and manage the current inventory.

### Security
- **Validation and Error Handling:** All API endpoints have proper validation and error handling.
- **Sensitive Information:** Sensitive information is securely encrypted.

### Logging and Monitoring
- **Logging:** Important events and errors are logged with Morgan.
- **Monitoring:** Basic monitoring for API performance is implemented using Prometheus.

### Testing
- **Unit Tests:** Important API endpoints (book and order) have unit tests.
- **Integration Testing:** Integration testing ensures components work together seamlessly.

## Database Schema

![Database Schema](https://raw.githubusercontent.com/mufidu/jobhun-devops-test/main/Screenshot%202024-06-17%20at%2015.45.24.jpg)

## Documentation

The API documentation is available at [Postman](https://documenter.getpostman.com/view/33823495/2sA3XS9g65).

## Getting Started

### Tech Stack

- Node.js and npm for server-side code.
- PostgreSQL for database.
- Midtrans for payment gateway.
- Postman for API documentation.
- fly.io for deployment.

### Setup

1. Clone the repository:

```bash
git clone https://github.com/mufidu/bookstore-api.git
cd bookstore-api
```

2. Install dependencies:

```bash
npm install
```

3. Set up the environment variables:

```bash
cp .env.example .env
```

4. Set up the database:

```bash
NODE_ENV=development npx sequelize-cli db:migrate
```

5. Start the server:

```bash
npm run dev
```

6. The server will be running at `http://localhost:9000`.

## Deployment

The API is deployed on fly.io. The live version is available at [https://bookstore-app.fly.dev](https://bookstore-app.fly.dev).
