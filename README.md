## **Scholarship Endpoints**

1. **Display list of all scholarships**

    - **HTTP Method**: `GET`
    - **Endpoint**: `/scholarships`
    - **Description**: Returns a list of all scholarships.

2. **Search scholarships by name**

    - **HTTP Method**: `GET`
    - **Endpoint**: `/scholarships/search`
    - **Query Parameter**: `name`
    - **Description**: Returns a list of scholarships that match or partially match the `name` parameter in the query string.

3. **Search scholarships by location**

    - **HTTP Method**: `GET`
    - **Endpoint**: `/scholarships/location/:location`
    - **Description**: Returns scholarships available in a specific location.

4. **Get distinct list of scholarship locations**

    - **HTTP Method**: `GET`
    - **Endpoint**: `/scholarships/locations`
    - **Description**: Returns a distinct list of locations where scholarships are available.

5. **Get details of a specific scholarship by ID**

    - **HTTP Method**: `GET`
    - **Endpoint**: `/scholarships/:id`
    - **Description**: Returns details of a specific scholarship by its ID.

6. **Search scholarships by deadline**
    - **HTTP Method**: `GET`
    - **Endpoint**: `/scholarships/deadline/:deadline`
    - **Description**: Returns scholarships with a deadline on the specified date.

## **Authentication Endpoints**

1. **Sign up a new user**

    - **HTTP Method**: `POST`
    - **Endpoint**: `/auth/signup`
    - **Description**: Registers a new user with first name, last name, email, password, and confirm password.

2. **Log in an existing user**

    - **HTTP Method**: `POST`
    - **Endpoint**: `/auth/login`
    - **Description**: Logs in a user with email and password. Returns an access token and sets a refresh token in a cookie.

3. **Verify email address**

    - **HTTP Method**: `GET`
    - **Endpoint**: `/auth/verify-email/:id/:token`
    - **Description**: Verifies a user’s email by matching the user’s ID and token sent via email.

4. **Resend verification email**

    - **HTTP Method**: `POST`
    - **Endpoint**: `/auth/resend-verification-email`
    - **Description**: Resends the email verification link to the user's email address.

5. **Forgot password**

    - **HTTP Method**: `POST`
    - **Endpoint**: `/auth/forgot-password`
    - **Description**: Sends a reset password link to the user’s email.

6. **Reset password**

    - **HTTP Method**: `POST`
    - **Endpoint**: `/auth/reset-password/:id/:token`
    - **Description**: Resets a user’s password using the ID and token from the reset link.

7. **Verify access token**

    - **HTTP Method**: `GET`
    - **Endpoint**: `/auth/verify-token`
    - **Description**: Verifies if the current access token is valid or expired.

8. **Logout a user**

    - **HTTP Method**: `GET`
    - **Endpoint**: `/auth/logout`
    - **Description**: Logs out the user and clears the refresh token from cookies.

9. **Refresh access token**
    - **HTTP Method**: `GET`
    - **Endpoint**: `/auth/refresh-token`
    - **Description**: Generates a new access token using the refresh token.

## **User Endpoints**

1. **Get user profile**

    - **HTTP Method**: `GET`
    - **Endpoint**: `/users/profile`
    - **Description**: Returns the profile information of the authenticated user.

2. **Get user by ID**

    - **HTTP Method**: `GET`
    - **Endpoint**: `/users/:id`
    - **Description**: Returns a user’s details by their ID.

3. **Change password**

    - **HTTP Method**: `POST`
    - **Endpoint**: `/users/change-password`
    - **Description**: Allows an authenticated user to change their password.

4. **Update profile**

    - **HTTP Method**: `POST`
    - **Endpoint**: `/users/update-profile`
    - **Description**: Allows an authenticated user to update their profile details.

5. **Update profile picture**

    - **HTTP Method**: `POST`
    - **Endpoint**: `/users/update-avatar`
    - **Description**: Allows an authenticated user to update their profile picture.

6. **Update email address**

    - **HTTP Method**: `POST`
    - **Endpoint**: `/users/update-email`
    - **Description**: Allows an authenticated user to update their email address.

7. **Delete user account**

    - **HTTP Method**: `POST`
    - **Endpoint**: `/users/delete`
    - **Description**: Allows an authenticated user to delete their account.

8. **Add scholarship to favorites**

    - **HTTP Method**: `POST`
    - **Endpoint**: `/users/add-favorite`
    - **Description**: Adds a scholarship to the user's favorites list.

9. **Get favorite scholarships**

    - **HTTP Method**: `GET`
    - **Endpoint**: `/users/favorites`
    - **Description**: Returns the authenticated user’s list of favorite scholarships.

10. **Remove scholarship from favorites**
    - **HTTP Method**: `POST`
    - **Endpoint**: `/users/remove-favorite`
    - **Description**: Removes a scholarship from the user's favorites list.
