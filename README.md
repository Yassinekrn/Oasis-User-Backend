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

### RESTful Endpoint Summary

-   **GET /scholarships**: Retrieve all scholarships.
-   **GET /scholarships/search?name=**: Search for scholarships by name.
-   **GET /scholarships/location/:location**: Search for scholarships by location.
-   **GET /scholarships/locations**: Retrieve distinct list of all scholarship locations.
-   **GET /scholarships/:id**: Retrieve details of a specific scholarship by ID.
-   **GET /scholarships/deadline/:deadline**: Search for scholarships by deadline.
