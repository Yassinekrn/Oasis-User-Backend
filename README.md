# 🌟 Oasis User Backend

![Oasis User Backend](./assets/oasis-banner.png)

[![Node.js](https://img.shields.io/badge/Node.js-18.x-brightgreen)](https://nodejs.org/) [![Express.js](https://img.shields.io/badge/Express.js-4.x-lightgrey)](https://expressjs.com/) [![MongoDB](https://img.shields.io/badge/MongoDB-6.x-brightgreen)](https://www.mongodb.com/) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow)](./LICENSE)

Oasis User Backend is the backend service for the user-facing section of the Oasis Scholarships Platform. This service provides a RESTful API for managing user accounts, scholarships, and advanced features such as complex search filters and user notifications.

---

## 📖 **Table of Contents**

1. [Features](#features)
2. [Technology Stack](#technology-stack)
3. [API Documentation](#api-documentation)
4. [Installation](#installation)
5. [Usage](#usage)
6. [Contributing](#contributing)
7. [License](#license)
8. [Acknowledgments](#acknowledgments)

---

## ✨ **Features**

-   **User Management**

    -   User registration, login, and CRUD operations.
    -   Account verification and password recovery procedures.

-   **Scholarship Management**

    -   Complex search with advanced filters (IDs, locations, deadlines).
    -   Add/remove scholarships from user favorites.
    -   Follow scholarships to receive notifications.

-   **Security**
    -   Secure authentication and data handling.
    -   Robust protection against common vulnerabilities.

---

## 🛠️ **Technology Stack**

This project is built with the following technologies and packages:

| Package              | Purpose                                                                     |
| -------------------- | --------------------------------------------------------------------------- |
| `bcrypt`             | For hashing passwords to securely store sensitive user credentials.         |
| `cookie-parser`      | To parse and manage HTTP cookies.                                           |
| `cors`               | Enables Cross-Origin Resource Sharing for secure client-server interaction. |
| `express-validator`  | Middleware for validating and sanitizing incoming user inputs.              |
| `helmet`             | Adds security headers to protect against common web vulnerabilities.        |
| `jsonwebtoken`       | Implements secure authentication using JSON Web Tokens (JWT).               |
| `mongoose`           | Object Data Modeling (ODM) for MongoDB, simplifying database interactions.  |
| `morgan`             | Logs HTTP requests for better monitoring and debugging.                     |
| `multer`             | Middleware for handling file uploads.                                       |
| `nodemailer`         | Sends email notifications for account verification and password recovery.   |
| `swagger-ui-express` | Provides interactive API documentation using Swagger UI.                    |

---

## 📑 **API Documentation**

The project includes Swagger-based API documentation for developers to easily explore and test the available endpoints.  
To access the documentation, start the server and navigate to:  
`http://<server-host>:<server-port>/api-docs`

---

## ⚙️ **Installation**

Follow these steps to set up and run the project locally:

1. **Clone the repository**:
    ```bash
    git clone https://github.com/Yassinekrn/Oasis-User-Backend.git
    ```
2. **Navigate to the project directory**:
    ```bash
    cd Oasis-User-Backend
    ```
3. **Install dependencies**:
    ```bash
    npm install
    ```
4. **Configure environment variables**:  
   Create a `.env` file in the root directory and specify the following:
    ```plaintext
    MONGODB_URI=<your-mongodb-uri>
    FRONTEND_URL=<your-frontend-url>
    EMAIL_FROM=<your-email>
    PORT=<server-port>
    SALT=<bcrypt-salt>
    ACCESS_JWT_SECRET=<access-jwt-secret>
    REFRESH_JWT_SECRET=<refresh-jwt-secret>
    SENDGRID_API_KEY=<sendgrid-api-key>
    NODE_ENV=development
    ```
5. **Start the server**:
    ```bash
    npm start
    ```

---

## 🚀 **Usage**

-   **Development Mode**:
    ```bash
    npm run dev
    ```
-   **Production Mode**:
    ```bash
    npm run start
    ```

---

## 🤝 **Contributing**

Contributions are welcome! If you have ideas to improve this project, feel free to fork the repository and submit a pull request.

1. Fork the repository.
2. Create a feature branch:
    ```bash
    git checkout -b feature-name
    ```
3. Commit your changes:
    ```bash
    git commit -m "Description of changes"
    ```
4. Push to the branch:
    ```bash
    git push origin feature-name
    ```
5. Open a pull request.

---

## 📝 **License**

This project is licensed under the [MIT License](./LICENSE).

---

## ❤️ **Acknowledgments**

Made with ❤️ by the Oasis Team
