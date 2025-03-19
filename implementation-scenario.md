# VYRLO Implementation Scenarios

This document outlines common implementation scenarios for integrating with the VYRLO API system.

## Scenario 1: Building a Basic Business Listing Platform

### Requirements
- User authentication
- Business profile management
- Category browsing
- Business listing creation and search

### Implementation Steps

1. **Setup Authentication**
   ```javascript
   // Register a new user
   const registerUser = async (userData) => {
     const response = await fetch('https://www.vyrlo.com:8080/signup', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify(userData)
     });
     return response.json();
   };

   // Login and get token
   const loginUser = async (credentials) => {
     const response = await fetch('https://www.vyrlo.com:8080/signin', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify(credentials)
     });
     const data = await response.json();
     localStorage.setItem('token', data.token);
     return data;
   };
   ```

2. **Setup User Profile**
   ```javascript
   // Get user profile
   const getUserProfile = async (userId) => {
     const response = await fetch(`https://www.vyrlo.com:8080/profile/${userId}`);
     return response.json();
   };

   // Update user profile
   const updateUserProfile = async (userId, formData) => {
     const token = localStorage.getItem('token');
     const response = await fetch(`https://www.vyrlo.com:8080/profile/${userId}`, {
       method: 'POST',
       headers: { 'token': token },
       body: formData
     });
     return response.json();
   };
   ```

3. **Fetch Categories**
   ```javascript
   // Get all categories
   const getCategories = async () => {
     const response = await fetch('https://www.vyrlo.com:8080/categories');
     return response.json();
   };
   ```

4. **Manage Listings**
   ```javascript
   // Create a new listing
   const createListing = async (listingData) => {
     const token = localStorage.getItem('token');
     const response = await fetch('https://www.vyrlo.com:8080/listing', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
         'token': token
       },
       body: JSON.stringify(listingData)
     });
     return response.json();
   };

   // Search listings
   const searchListings = async (filters) => {
     const queryParams = new URLSearchParams(filters).toString();
     const response = await fetch(`https://www.vyrlo.com:8080/listing?${queryParams}`);
     return response.json();
   };
   ```

## Scenario 2: Adding Reviews Functionality

### Requirements
- Allow users to leave reviews on business listings
- Display average ratings and review lists
- Sort and filter reviews

### Implementation Steps

1. **Create and Fetch Reviews**
   ```javascript
   // Submit a new review
   const submitReview = async (listingId, reviewData) => {
     const response = await fetch(`https://www.vyrlo.com:8080/api/reviews/${listingId}`, {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify(reviewData)
     });
     return response.json();
   };

   // Get reviews for a listing
   const getReviews = async (listingId, page = 1, limit = 10) => {
     const response = await fetch(`https://www.vyrlo.com:8080/api/reviews/${listingId}?page=${page}&limit=${limit}`);
     return response.json();
   };
   ```

2. **Display Reviews**
   ```javascript
   // Example of displaying review statistics
   const displayReviewStats = (averages) => {
     document.getElementById('overall-rating').textContent = averages.totalAverage.toFixed(1);
     document.getElementById('service-rating').style.width = `${averages.serviceAvg * 20}%`;
     document.getElementById('money-rating').style.width = `${averages.moneyAvg * 20}%`;
     document.getElementById('cleanliness-rating').style.width = `${averages.cleanlinessAvg * 20}%`;
     document.getElementById('location-rating').style.width = `${averages.locationAvg * 20}%`;
   };
   ```

## Scenario 3: Implementing Payment for Sponsored Listings

### Requirements
- Support subscription-based sponsored listings
- Process payments
- Update listing status after payment

### Implementation Steps

1. **Get Pricing Information**
   ```javascript
   // Fetch pricing options
   const getPricing = async () => {
     const response = await fetch('https://www.vyrlo.com:8080/pricing');
     return response.json();
   };
   ```

2. **Process Payment**
   ```javascript
   // Process checkout for sponsored listing
   const processCheckout = async (paymentData) => {
     const token = localStorage.getItem('token');
     const response = await fetch('https://www.vyrlo.com:8080/profile/api/checkout', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
         'token': token
       },
       body: JSON.stringify(paymentData)
     });
     return response.json();
   };
   ```

3. **Update Listing Status**
   ```javascript
   // Update listing to sponsored status after payment
   const updateListingStatus = async (listingId, updatedData) => {
     const token = localStorage.getItem('token');
     const response = await fetch(`https://www.vyrlo.com:8080/listing/${listingId}`, {
       method: 'PUT',
       headers: {
         'Content-Type': 'application/json',
         'token': token
       },
       body: JSON.stringify(updatedData)
     });
     return response.json();
   };
   ```

## Integration Flow Diagram

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│  Authentication │─────▶│  User Profile   │─────▶│ Create Listing  │
└─────────────────┘      └─────────────────┘      └─────────────────┘
        │                        │                        │
        │                        │                        ▼
        │                        │              ┌─────────────────┐
        │                        │              │  Category List  │
        │                        │              └─────────────────┘
        ▼                        ▼                      │
┌─────────────────┐      ┌─────────────────┐           │
│ Payment Process │◀─────│   Sponsorship   │◀──────────┘
└─────────────────┘      └─────────────────┘
```
