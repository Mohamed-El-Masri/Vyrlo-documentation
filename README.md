# Vyrlo Project Structure
we will use Google (colors , Fonts , design , theme ... etc) (simulate Google)
Small Cards 
focous on how to make benefit from the website as encourage users to be sponser and alot of sponsered features and featured bussines features 
```
vyrlo/
├── index.html                      # Redirect to home page
├── html/
│   ├── pages/                      # Main pages
│   │   ├── home.html               # Home/landing page
│   │   ├── auth/
│   │   │   ├── login.html          # Login page
│   │   │   ├── register.html       # Registration page
│   │   │   ├── forgot-password.html # Password recovery
│   │   ├── listings/
│   │   │   ├── listing-search.html # Search listings page
│   │   │   ├── listing-details.html # Single listing view
│   │   ├── profile/
│   │   │   ├── user-profile.html   # View profile
│   │   │   ├── edit-profile.html   # Edit profile
│   │   │   ├── user-listings.html  # User's listings dashboard
│   │   │   ├── reviews.html        # User's reviews
│   │   │   ├── create-listing.html # Create new listing
│   │   │   ├── edit-listing.html   # Edit existing listing
│   │   ├── checkout/
│   │   │   ├── payment.html        # Payment processing
│   │   ├── api-documentation.html  # API documentation page
│   ├── components/                  # Reusable HTML components
│   │   ├── header-lg.html          # Site header for large and extra large screens
│   │   ├── header-sm.html          # Site header for small and tablets screens
│   │   ├── footer.html             # Site footer
│   │   ├── listing-card.html       # Listing preview card
│   │   ├── Featured-listing-card.html       # Listing preview card
│   │   ├── sponserd-listing-card.html       # Listing preview card
│   │   ├── review-card.html        # Review display component
│   │   ├── category-list.html      # Category listing component (small slider)
│   │   ├── sponserd-list.html      # sponserd listing component (small slider)
│   │   ├── search-filter.html      # Search filters component
│   │   ├── pricing-sec.html
│   │   ├── promo-sec.html
├── css/
│   ├── main.css                    # Main styles
│   ├── layout/
│   │   ├── grid.css                # Grid system
│   │   ├── responsive.css          # Responsive design rules
│   │   ├── header-lg.css              # Header layout styles
│   │   ├── header-sm.css              # Header layout styles
│   │   ├── footer.css              # Footer layout styles
│   ├── pages/                      # Page-specific styles
│   │   ├── home.css
│   │   ├── auth.css
│   │   ├── listings.css
│   │   ├── profile.css
│   │   ├── checkout.css
│   │   ├── api-documentation.css   # API documentation styles
│   ├── dark-theme.css              # Dark theme styles
│   ├── components/                  # Component-specific styles
│   │   ├── buttons.css
│   │   ├── listing-card.css      
│   │   ├── Featured-listing-card.css      
│   │   ├── sponserd-listing-card.css       
│   │   ├── review-card.css        
│   │   ├── category-list.css     
│   │   ├── sponserd-list.css   
│   │   ├── forms.css
│   │   ├── modals.css
│   │   ├── review.css
│   │   ├── pricing-sec.css
│   │   ├── search-filter.css     
├── js/
│   ├── pages/                      # Page-specific scripts
│   │   ├── home/
│   │   │   ├── index.js            # Home page main script
│   │   │   ├── category-list.js      
│   │   │   ├── sponserd-list.js  
│   │   │   ├── search-filter.js      
│   │   │   ├── featured-listings.js # Featured listings component
│   │   ├── auth/
│   │   │   ├── login.js
│   │   │   ├── register.js
│   │   │   ├── forgot-password.js
│   │   ├── listings/
│   │   │   ├── listing-search.js
│   │   │   ├── listing-details.js
│   │   │   ├── create-listing.js
│   │   │   ├── edit-listing.js
│   │   │   ├── components/
│   │   │   │   ├── map.js          # Map integration component
│   │   │   │   ├── booking.js      # Booking component
│   │   ├── profile/
│   │   │   ├── user-profile.js
│   │   │   ├── edit-profile.js
│   │   │   ├── user-listings.js
│   │   │   ├── create-listing.css # Create new listing
│   │   │   ├── edit-listing.css   # Edit existing listing
│   │   │   ├── reviews.js
│   │   ├── checkout/
│   │   │   ├── payment.js
│   │   ├── api-documentation/
│   │   │   ├── index.js            # API documentation main script
│   │   │   ├── stats.js            # API statistics
│   │   │   ├── search.js           # Advanced search functions
│   ├── services/                   # API services
│   │   ├── api.js                  # Base API configuration
│   │   ├── auth-service.js         # Authentication API calls
│   │   ├── listing-service.js      # Listing API calls
│   │   ├── category-service.js     # Categories API calls
│   │   ├── profile-service.js      # Profile API calls
│   │   ├── review-service.js       # Review API calls
│   │   ├── payment-service.js      # Payment API calls
│   │   ├── api-docs-parser.js      # API documentation parser
│   │   ├── api-visualization.js    # Visualization via D3.js
│   │   ├── api-relationships-mapping.js # API relationships mapping
│   │   ├── api-ui-integration.js   # UI integration
│   │   ├── api-compatibility-manager.js # Compatibility manager
│   ├── core/                       # Core functionality
│   │   ├── component-loader.js     # Dynamic component loading
│   │   ├── config.js               # Configuration settings
│   │   ├── storage.js              # Local storage management
│   │   ├── auth.js                 # Auth token management
│   │   ├── validation.js           # Form validation
│   │   ├── utils.js                # Utility functions
├── assets/
│   ├── images/                     # Image assets
│   │   ├── logo/
│   │   ├── icons/
│   │   ├── backgrounds/
│   │   ├── placeholders/
│   ├── fonts/                      # Font files
├── APIs-doc.md                     # API documentation source file in Markdown format
````
