1. **Display list of all scholarships**

    - **HTTP Method**: `GET`
    - **Endpoint**: `/scholarships`
    - **Description**: Returns a list of all scholarships.

2. **Search scholarships by name**

    - **HTTP Method**: `GET`
    - **Endpoint**: `/scholarships/search`
    - **Query Parameter**: `name`
    - **Description**: Returns a list of scholarships that partially match the `name` parameter in the query string. Example: `/scholarships/search?name=engineering`

3. **Search scholarships by location**

    - **HTTP Method**: `GET`
    - **Endpoint**: `/scholarships/location/:location`
    - **Description**: Returns a list of scholarships available in a specific location. Example: `/scholarships/location/NewYork`

4. **Get distinct list of scholarship locations**

    - **HTTP Method**: `GET`
    - **Endpoint**: `/scholarships/locations`
    - **Description**: Returns a list of distinct locations where scholarships are available.

5. **Get details of a specific scholarship by ID**

    - **HTTP Method**: `GET`
    - **Endpoint**: `/scholarships/:id`
    - **Description**: Returns details of a specific scholarship based on its unique ID. Example: `/scholarships/634d9f2e7b3a1a0015a0e9c3`

6. **Search scholarships by deadline**
    - **HTTP Method**: `GET`
    - **Endpoint**: `/scholarships/deadline/:deadline`
    - **Description**: Returns a list of scholarships that have a deadline on or before the specified date. Example: `/scholarships/deadline/2022-12-31`

### **Authentication Endpoints**

1. **Sign up a new user**

    - **HTTP Method**: `POST`
    - **Endpoint**: `/auth/signup`
    - **Description**: Registers a new user by creating an account and sending a verification email. The request body must include the user’s first name, last name, email, password, and confirm password.

2. **Log in an existing user**

    - **HTTP Method**: `POST`
    - **Endpoint**: `/auth/login`
    - **Description**: Logs in an existing user using email and password. Generates and returns an access token and sets a refresh token in a cookie.

3. **Verify email address**

    - **HTTP Method**: `GET`
    - **Endpoint**: `/auth/verify-email/:id/:token`
    - **Description**: Verifies a user’s email by matching the user’s ID and the verification token sent via email.

4. **Verify access token**

    - **HTTP Method**: `GET`
    - **Endpoint**: `/auth/verify-token`
    - **Description**: Verifies if the current access token is valid or has expired.

5. **Logout a user**

    - **HTTP Method**: `GET`
    - **Endpoint**: `/auth/logout`
    - **Description**: Logs out the user and clears the refresh token from the cookie.

6. **Refresh access token**
    - **HTTP Method**: `GET`
    - **Endpoint**: `/auth/refresh-token`
    - **Description**: Generates a new access token using the refresh token stored in the cookie. The old access token should have expired or be near expiration.
