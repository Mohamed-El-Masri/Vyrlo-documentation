# VYRLO API DOCUMENTATION

## Base URL
https://www.vyrlo.com:8080/

## 1. Authentication APIs

### 1.1 Sign Up
- **URL**: `/signup`
- **Method**: POST
- **Request Body**:
```json
{
    "username": "momen",
    "email": "momensaleh2468@gmail.com",
    "password": "m1234567"
}
```
- **Responses**:
  - `201 Created`: 
  ```json
  {
      "message": "User Created Successfully"
  }
  ```
  - `409 Conflict`:
  ```json
  {
      "statusCode": 409,
      "message": "already registerd"
  }
  ```
  - `500 Internal Server Error`: (when duplicated username)
  ```json
  {
      "statusCode": 500,
      "message": "Internal server error"
  }
  ```

### 1.2 Sign In
- **URL**: `/signin`
- **Method**: POST
- **Request Body**:
```json
{
    "email": "momensaleh2468@gmail.com",
    "password": "m1234567"
}
```
- **Responses**:
  - `201 Created`:
  ```json
  {
      "message": "success",
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoibW9tZW4iLCJlbWFpbCI6Im1vbWVuc2FsZWgyNDY4QGdtYWlsLmNvbSIsInVzZXJJZCI6IjY3YTg5OWY1MTkwOWJjNjBjY2RjMjZhNyIsImlhdCI6MTc0MDEwMzIwMX0.m9M3Je5XhXCSbLFWXukPE_7PIRdTKr8Fd049ct24AkM"
  }
  ```
  - `500 Internal Server Error`: (when email or password is wrong)
  ```json
  {
      "statusCode": 500,
      "message": "Internal server error"
  }
  ```

### 1.3 Reset Password with OTP
- **URL**: `/forgetpass/reset`
- **Method**: POST
- **Request Body**:
```json
{
    "email": "momensaleh2468@gmail.com",
    "newPassword": "ma12345678",
    "otp": "827427"
}
```

### 1.4 Send OTP
- **URL**: `/send-otp`
- **Method**: POST
- **Request Body**:
```json
{
    "email": "momensaleh2468@gmail.com"
}
```
- **Response**: `201 Created`
```json
{
    "message": "OTP sent to email"
}
```

### 1.5 Change Password
- **URL**: `/change-pass`
- **Method**: PUT
- **Request Body**:
```json
{
    "oldPassword": "ma12345678",
    "newPassword": "m1234567"
}
```
- **Response**: `403 Forbidden` (if incorrect old password)
```json
{
    "statusCode": 403,
    "message": "Incorrect old password"
}
```

### 1.6 Forget Password Request
- **URL**: `/forgetpass/request`
- **Method**: POST
- **Request Body**:
```json
{
    "email": "momensaleh2468@gmail.com"
}
```
- **Response**:
```json
{
    "message": "OTP sent to email"
}
```

## 2. Profile Management

### 2.1 Get User Profile
- **URL**: `/profile/{UserId}` (Example: `/profile/67a899f51909bc60ccdc26a7`)
- **Method**: GET
- **Response**:
```json
{
    "numberOfProjects": 0,
    "_id": "67aa4ae73f7622b5e0af990d",
    "userId": {
        "_id": "67a899f51909bc60ccdc26a7",
        "username": "momen",
        "email": "momensaleh2468@gmail.com"
    },
    "profilePic": [
        "http://res.cloudinary.com/da44zf1mo/image/upload/v1740104111/Category/icons/szn0adraujidvgrnkeyo.png"
    ],
    "socialAccounts": [
        {
            "platform": "LinkedIn",
            "url": "https://linkedin.com/in/username",
            "_id": "67b7e1b03e563fdd31b8dbff"
        }
    ],
    "address": "123 Main Street",
    "phoneNumber": "1234567890",
    "title": "Software Engineer",
    "about": "Passionate developer with experience in full-stack development",
    "city": "new york",
    "state": "yn",
    "zipCode": "10001"
}
```

### 2.2 Edit User Profile
- **URL**: `/profile/{UserId}` (Example: `/profile/67a899f51909bc60ccdc26a7`)
- **Method**: POST
- **Form Data**:
  - `profilePic`: file
  - `title`: text
  - `phoneNumber`: text
  - `address`: text
  - `city`: text
  - `state`: text
  - `zipCode`: text
  - `about`: text
  - `socialAccounts`: text
- **Responses**:
  - `201 Created`:
  ```json
  {
      "numberOfProjects": 0,
      "_id": "67aa4ae73f7622b5e0af990d",
      "userId": "67a899f51909bc60ccdc26a7",
      "profilePic": [
          "http://res.cloudinary.com/da44zf1mo/image/upload/v1740104111/Category/icons/szn0adraujidvgrnkeyo.png"
      ],
      "title": "Software Engineer",
      "phoneNumber": "1234567890",
      "address": "123 Main Street",
      "city": "new york",
      "state": "yn",
      "zipCode": "10001",
      "about": "Passionate developer with experience in full-stack development"
  }
  ```
  - `400 Bad Request`:
  ```json
  {
      "statusCode": 400,
      "message": "Invalid file type."
  }
  ```

## 3. Payment and Checkout

### 3.1 Process Checkout
- **URL**: `/profile/api/checkout`
- **Method**: POST
- **Headers**: `token` required for user identification
- **Request Body**:
```json
{
    "transactionId": "test123",
    "type": "monthly",
    "listingId": "67ab7fdae9fc0bcda8726b39",
    "price": 20
}
```

## 4. Pricing APIs

### 4.1 Get All Pricing
- **URL**: `/pricing`
- **Method**: GET
- **Response**:
```json
[
    {
        "_id": "67a8f12d25d1f11973d902fe",
        "monthlyPrice": "20",
        "yearlyPrice": "20",
        "postingPrice": "20",
        "createdAt": "2025-02-09T18:17:17.960Z",
        "updatedAt": "2025-02-11T16:43:16.122Z"
    }
]
```

### 4.2 Get Pricing by ID
- **URL**: `/pricing/{id}`
- **Method**: GET

### 4.3 Add New Pricing (Admin)
- **URL**: `/pricing`
- **Method**: POST

### 4.4 Update Pricing (Admin)
- **URL**: `/pricing/{id}`
- **Method**: PUT

### 4.5 Delete Pricing (Admin)
- **URL**: `/pricing/{id}`
- **Method**: DELETE

## 5. Reviews

### 5.1 Get Reviews for a Listing
- **URL**: `/api/reviews/{listingId}`
- **Method**: GET
- **Query Parameters**:
  - `page`: number (pagination page number)
  - `limit`: number (items per page)
- **Response**:
```json
{
    "message": "Reviews retrieved successfully",
    "reviews": [
        {
            "_id": "67ab8ef254aace716f867c9f",
            "listingId": "67ab7fdae9fc0bcda8726b39",
            "serviceRating": 5,
            "moneyRating": 4,
            "cleanlinessRating": 5,
            "locationRating": 4,
            "reviewerName": "John Doe",
            "reviewerEmail": "johndoe@example.com",
            "reviewText": "hello i want to say these is great listing",
            "createdAt": "2025-02-11T17:54:58.815Z",
            "updatedAt": "2025-02-11T17:54:58.815Z"
        }
    ],
    "averages": {
        "serviceAvg": 5,
        "moneyAvg": 4,
        "cleanlinessAvg": 5,
        "locationAvg": 4,
        "totalAverage": 4.5
    },
    "pagination": {
        "totalReviews": 1,
        "totalPages": 1,
        "currentPage": 1,
        "limit": 2
    }
}
```

### 5.2 Create Review
- **URL**: `/api/reviews/{listingId}`
- **Method**: POST
- **Request Body**:
```json
{
    "serviceRating": 5,
    "moneyRating": 4,
    "cleanlinessRating": 5,
    "locationRating": 4,
    "reviewerName": "John Doe",
    "reviewerEmail": "johndoe@example.com",
    "reviewText": "hello i want to say these is great listing"
}
```
- **Response**:
```json
{
    "message": "Review added successfully",
    "newReview": {
        "listingId": "67ab7fdae9fc0bcda8726b39",
        "serviceRating": 5,
        "moneyRating": 4,
        "cleanlinessRating": 5,
        "locationRating": 4,
        "reviewerName": "John Doe",
        "reviewerEmail": "johndoe@example.com",
        "reviewText": "hello i want to say these is great listing",
        "_id": "67b7e8480e74e45bfabefbbb",
        "createdAt": "2025-02-21T02:43:20.178Z",
        "updatedAt": "2025-02-21T02:43:20.178Z"
    }
}
```

### 5.3 Update Review
- **URL**: `/api/reviews/{reviewId}`
- **Method**: PATCH
- **Request Body**: Same as Create Review
- **Response**:
```json
{
    "message": "Review updated successfully",
    "review": {
        "_id": "64a000000000000000000002",
        "listingId": "64a000000000000000000010",
        "serviceRating": 5,
        "moneyRating": 4,
        "cleanlinessRating": 5,
        "locationRating": 4,
        "reviewText": "hello i want to say these is great listing",
        "reviewerName": "John Doe",
        "reviewerEmail": "johndoe@example.com"
    }
}
```

### 5.4 Delete Review
- **URL**: `/api/reviews/{reviewId}`
- **Method**: DELETE
- **Access**: Admin and review writer only

## 6. Categories

### 6.1 Get All Categories
- **URL**: `/categories`
- **Method**: GET
- **Response**:
```json
[
    {
        "_id": "67ae1e66c57141f547bc1f47",
        "categoryName": "Accountant",
        "iconOne": "",
        "iconTwo": "",
        "amenities": [
            "Free initial consultation",
            "Online appointment scheduling",
            "Client portal for document sharing"
        ]
    }
]
```

### 6.2 Get Category by ID
- **URL**: `/categories/{id}`
- **Method**: GET
- **Response**:
```json
{
    "_id": "67ae1e66c57141f547bc1f4a",
    "categoryName": "Restaurant",
    "iconOne": "",
    "iconTwo": "",
    "amenities": [
        "Outdoor patio or rooftop dining",
        "Takeout and delivery options via app",
        "Happy hour drink and food specials"
    ]
}
```

### 6.3 Add Category (Admin)
- **URL**: `/categories`
- **Method**: POST
- **Request Body**:
```json
{
    "categoryName": "test1",
    "iconOne": "",
    "iconTwo": "",
    "amenities": ["s", "d"]
}
```

### 6.4 Update Category (Admin)
- **URL**: `/categories/{id}`
- **Method**: PUT

### 6.5 Delete Category (Admin)
- **URL**: `/categories/{id}`
- **Method**: DELETE

## 7. Listings APIs

### 7.1 Get Listings (with pagination and filters)
- **URL**: `/listing`
- **Method**: GET
- **Query Parameters**:
  - `lastValue`: number (1 for 4 items, 2 for 5 items, etc.)
  - `name`: string (optional filter)
  - `location`: string (optional filter)
  - `categoryId`: string (optional filter)
- **Response**:
```json
{
    "listings": [
        {
            "_id": "67ab7fdae9fc0bcda8726b39",
            "userId": "67a899f51909bc60ccdc26a7",
            "listingName": "My New Listing",
            "categoryId": {
                "_id": "67ae1e66c57141f547bc1f47",
                "categoryName": "Accountant"
            },
            "location": "New York",
            "longitude": "-74.0060",
            "latitude": "40.7128",
            "description": "A great place to stay!",
            "isActive": true,
            "isPosted": true
        }
    ],
    "lastValue": 4,
    "totalItems": 1
}
```

### 7.2 Get Listing by ID
- **URL**: `/listing/{id}`
- **Method**: GET
- **Response** (if exists):
```json
{
    "_id": "67ab7fdae9fc0bcda8726b39",
    "userId": "67a899f51909bc60ccdc26a7",
    "listingName": "My New Listing",
    "categoryId": {
        "_id": "67ae1e66c57141f547bc1f47",
        "categoryName": "Accountant",
        "amenities": ["Free initial consultation"]
    },
    "location": "New York",
    "description": "A great place to stay!",
    "email": "owner@example.com",
    "mobile": "123456789"
}
```
- **Response** (if not exists):
```json
{
    "message": "Listing is not found"
}
```

### 7.3 Get User Listings
- **URL**: `/listing/user`
- **Method**: GET
- **Headers**: `token` required for user identification
- **Response**:
```json
[
    {
        "_id": "67ab7fdae9fc0bcda8726b39",
        "userId": "67a899f51909bc60ccdc26a7",
        "listingName": "My New Listing",
        "location": "New York",
        "description": "A great place to stay!",
        "isActive": true,
        "isPosted": true
    }
]
```

### 7.4 Create Listing
- **URL**: `/listing`
- **Method**: POST
- **Headers**: `token` required
- **Request Body**:
```json
{
    "listingName": "Tech Solutions",
    "categoryId": "67ae1e66c57141f547bc1f48",
    "location": "San Francisco",
    "longitude": "-122.4194",
    "latitude": "37.7749",
    "description": "Your go-to place for all tech solutions!",
    "amenitielsList": ["24/7 tech support", "Custom software development"],
    "email": "info@techsolutions.com",
    "mobile": "987654321",
    "taxNumber": "67890",
    "openingTimes": {
        "Monday": { "status": "open", "from": "09:00", "to": "18:00" },
        "Tuesday": { "status": "open", "from": "09:00", "to": "18:00" },
        "Wednesday": { "status": "open", "from": "09:00", "to": "18:00" }
    }
}
```
- **Response** (201 Created):
```json
{
    "userId": "67a899f51909bc60ccdc26a7",
    "listingName": "Tech Solutions",
    "categoryId": "67ae1e66c57141f547bc1f48",
    "location": "San Francisco",
    "_id": "87ab7fdae9fc1bcda8726b40"
}
```

### 7.5 Update Listing
- **URL**: `/listing/{id}`
- **Method**: PUT
- **Headers**: `token` required
- **Request Body**:
```json
{
    "listingName": "Updated Listing Name",
    "location": "Los Angeles",
    "items": [
        {
            "_id": "67a9ef61d7aecc72104f5365",
            "name": "Updated Item mmmm",
            "price": 75
        },
        {
            "name": "New Item 3",
            "price": 200
        }
    ],
    "openingTimes": {
        "Monday": { "status": "open", "from": "10:00", "to": "12:00" },
        "Tuesday": { "status": "close", "closingReason": "Holiday" }
    }
}
```
- **Response** (200 OK):
```json
{
    "_id": "67ab7febe9fc0bcda8726b41",
    "userId": "67a899f51909bc60ccdc26a7",
    "listingName": "Updated Listing Name",
    "location": "Los Angeles"
}
```

### 7.6 Delete Listing
- **URL**: `/listing/{id}`
- **Method**: DELETE
- **Response** (200 OK):
```json
{
    "message": "Listing deleted successfully"
}
```
- **Response** (404 Not Found):
```json
{
    "statusCode": 404,
    "message": "Listing not found"
}

