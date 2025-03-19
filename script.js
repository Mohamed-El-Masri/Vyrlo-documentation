document.addEventListener('DOMContentLoaded', function() {
    // Fetch and load the API documentation data
    fetchAPIData()
        .then(data => {
            initializeDocumentation(data);
        })
        .catch(err => {
            console.error('Failed to load API documentation:', err);
            document.querySelector('.main-content').innerHTML = `
                <div class="error-container">
                    <h2>Error Loading Documentation</h2>
                    <p>Failed to load API documentation. Please try refreshing the page.</p>
                </div>
            `;
        });
    
    // Mobile menu toggle
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    
    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        const isOpen = sidebar.classList.contains('open');
        menuToggle.innerHTML = isOpen ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    });
});

async function fetchAPIData() {
    // In a real application, you would fetch this from a server
    // For this example, we'll use the data from the APIs-doc.json file
    try {
        const response = await fetch('APIs-doc.json');
        if (!response.ok) {
            throw new Error('Failed to fetch API data');
        }
        return await response.json();
    } catch (err) {
        console.error('Error fetching API data:', err);
        throw err;
    }
}

function initializeDocumentation(data) {
    // Set base URL
    document.getElementById('base-url').textContent = data.baseUrl;
    
    // Generate sidebar navigation
    generateSidebarNav(data.sections);
    
    // Generate main content sections
    generateApiSections(data.sections);
    
    // Initialize search functionality
    initializeSearch(data);
    
    // Initialize syntax highlighting
    hljs.highlightAll();
    
    // Setup copy functionality for endpoint URLs
    setupCopyButtons();
    
    // Setup smooth scrolling for navigation
    setupSmoothScrolling();
    
    // Make API data available to other scripts via an event
    window.apiData = data;
    // Dispatch event for api-relationships.js
    window.dispatchEvent(new CustomEvent('apiDataLoaded', { detail: data }));
}

function generateSidebarNav(sections) {
    const sidebarNav = document.getElementById('sidebar-nav');
    
    sections.forEach(section => {
        const sectionElement = document.createElement('div');
        sectionElement.className = 'nav-section';
        
        const sectionTitle = document.createElement('a');
        sectionTitle.className = 'nav-section-title';
        sectionTitle.textContent = section.title;
        sectionTitle.href = `#section-${section.id}`;
        
        sectionElement.appendChild(sectionTitle);
        
        if (section.endpoints && section.endpoints.length > 0) {
            const endpointsList = document.createElement('div');
            endpointsList.className = 'nav-endpoints';
            
            section.endpoints.forEach(endpoint => {
                const endpointLink = document.createElement('a');
                endpointLink.className = 'nav-endpoint';
                endpointLink.textContent = endpoint.title;
                endpointLink.href = `#endpoint-${endpoint.id}`;
                
                endpointsList.appendChild(endpointLink);
            });
            
            sectionElement.appendChild(endpointsList);
        }
        
        sidebarNav.appendChild(sectionElement);
    });
}

function generateApiSections(sections) {
    const sectionsContainer = document.getElementById('sections-container');
    
    sections.forEach(section => {
        const sectionElement = document.createElement('div');
        sectionElement.className = 'api-section';
        sectionElement.id = `section-${section.id}`;
        
        const sectionTitle = document.createElement('h2');
        sectionTitle.className = 'api-section-title';
        sectionTitle.textContent = section.title;
        
        sectionElement.appendChild(sectionTitle);
        
        if (section.endpoints && section.endpoints.length > 0) {
            section.endpoints.forEach(endpoint => {
                const endpointElement = createEndpointElement(endpoint);
                sectionElement.appendChild(endpointElement);
            });
        }
        
        sectionsContainer.appendChild(sectionElement);
    });
}

// Implement response tabs functionality

function createEndpointElement(endpoint) {
    // Clone the endpoint template
    const template = document.getElementById('endpoint-template');
    const endpointElement = document.importNode(template.content, true).children[0];
    endpointElement.id = `endpoint-${endpoint.id}`;
    
    // Set method
    const methodElement = endpointElement.querySelector('.method');
    methodElement.textContent = endpoint.method || 'GET';
    methodElement.classList.add(endpoint.method ? endpoint.method.toLowerCase() : 'get');
    
    // Set title
    endpointElement.querySelector('.endpoint-title').textContent = endpoint.title;
    
    // Set URL
    const baseUrl = document.getElementById('base-url').textContent;
    const fullUrl = baseUrl + (endpoint.urlExample || endpoint.url);
    endpointElement.querySelector('.endpoint-url').textContent = fullUrl;
    
    // Set description if available
    const descriptionEl = endpointElement.querySelector('.description');
    if (endpoint.description) {
        descriptionEl.textContent = endpoint.description;
    } else {
        descriptionEl.remove();
    }
    
    // Handle parameters
    const paramsSection = endpointElement.querySelector('.params-section');
    if (endpoint.parameters && endpoint.parameters.length > 0) {
        const paramsContent = endpointElement.querySelector('.params-content');
        const paramsTable = createParamsTable(endpoint.parameters);
        paramsContent.appendChild(paramsTable);
    } else {
        paramsSection.remove();
    }
    
    // Handle headers
    const headersSection = endpointElement.querySelector('.headers-section');
    if (endpoint.headers && endpoint.headers.length > 0) {
        const headersContent = endpointElement.querySelector('.headers-content');
        const headersTable = createHeadersTable(endpoint.headers);
        headersContent.appendChild(headersTable);
    } else {
        headersSection.remove();
    }
    
    // Handle request body
    const requestBodySection = endpointElement.querySelector('.request-body-section');
    if (endpoint.requestBody && endpoint.requestBody.content) {
        const requestBodyContent = endpointElement.querySelector('.request-body-content');
        Object.keys(endpoint.requestBody.content).forEach(contentType => {
            const example = endpoint.requestBody.content[contentType].example;
            if (example) {
                const pre = document.createElement('pre');
                const code = document.createElement('code');
                code.className = getLanguageClass(contentType);
                code.textContent = JSON.stringify(example, null, 2);
                pre.appendChild(code);
                requestBodyContent.appendChild(pre);
            }
        });
    } else {
        requestBodySection.remove();
    }
    
    // Handle form data
    const formDataSection = endpointElement.querySelector('.form-data-section');
    if (endpoint.formData && endpoint.formData.length > 0) {
        const formDataContent = endpointElement.querySelector('.form-data-content');
        const formDataTable = createFormDataTable(endpoint.formData);
        formDataContent.appendChild(formDataTable);
    } else {
        formDataSection.remove();
    }
    
    // Handle responses - Updated for tabs
    const responsesSection = endpointElement.querySelector('.responses-section');
    if (endpoint.responses && endpoint.responses.length > 0) {
        const responsesContent = endpointElement.querySelector('.responses-content');
        
        // Create tabs container
        const tabsContainer = document.createElement('div');
        tabsContainer.className = 'responses-tabs';
        responsesContent.insertBefore(tabsContainer, responsesContent.firstChild);
        
        // Create tabs and content
        endpoint.responses.forEach((response, index) => {
            // Create the tab
            const tab = document.createElement('div');
            tab.className = `response-tab ${index === 0 ? 'active' : ''}`;
            tab.setAttribute('data-response-id', `response-${endpoint.id}-${response.status}`);
            
            const statusSpan = document.createElement('span');
            statusSpan.className = `status status-${response.status}`;
            statusSpan.textContent = response.status;
            tab.appendChild(statusSpan);
            
            const descSpan = document.createElement('span');
            descSpan.textContent = response.description || '';
            tab.appendChild(descSpan);
            
            tabsContainer.appendChild(tab);
            
            // Create the response body wrapper
            const responseBodyWrapper = document.createElement('div');
            responseBodyWrapper.className = `response-body-wrapper ${index === 0 ? 'active' : ''}`;
            responseBodyWrapper.id = `response-${endpoint.id}-${response.status}`;
            
            // Create the response element
            const responseElement = createResponseElement(response);
            responseBodyWrapper.appendChild(responseElement);
            
            responsesContent.appendChild(responseBodyWrapper);
            
            // Add click event to tab
            tab.addEventListener('click', function() {
                // Remove active class from all tabs and content
                const allTabs = tabsContainer.querySelectorAll('.response-tab');
                allTabs.forEach(t => t.classList.remove('active'));
                
                const allContents = responsesContent.querySelectorAll('.response-body-wrapper');
                allContents.forEach(c => c.classList.remove('active'));
                
                // Add active class to clicked tab and matching content
                tab.classList.add('active');
                responseBodyWrapper.classList.add('active');
            });
        });
    } else {
        responsesSection.remove();
    }
    
    return endpointElement;
}

function createParamsTable(parameters) {
    const table = document.createElement('table');
    table.className = 'params-table';
    
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    ['Name', 'Type', 'Required', 'Description'].forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    
    const tbody = document.createElement('tbody');
    parameters.forEach(param => {
        const row = document.createElement('tr');
        
        const nameCell = document.createElement('td');
        nameCell.textContent = param.name || '';
        row.appendChild(nameCell);
        
        const typeCell = document.createElement('td');
        typeCell.textContent = param.type || '';
        row.appendChild(typeCell);
        
        const requiredCell = document.createElement('td');
        requiredCell.textContent = param.required ? 'Yes' : 'No';
        row.appendChild(requiredCell);
        
        const descCell = document.createElement('td');
        descCell.textContent = param.description || '';
        row.appendChild(descCell);
        
        tbody.appendChild(row);
    });
    
    table.appendChild(thead);
    table.appendChild(tbody);
    return table;
}

function createHeadersTable(headers) {
    const table = document.createElement('table');
    table.className = 'headers-table';
    
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    ['Name', 'Required', 'Description'].forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    
    const tbody = document.createElement('tbody');
    headers.forEach(header => {
        const row = document.createElement('tr');
        
        const nameCell = document.createElement('td');
        nameCell.textContent = header.name || '';
        row.appendChild(nameCell);
        
        const requiredCell = document.createElement('td');
        requiredCell.textContent = header.required ? 'Yes' : 'No';
        row.appendChild(requiredCell);
        
        const descCell = document.createElement('td');
        descCell.textContent = header.description || '';
        row.appendChild(descCell);
        
        tbody.appendChild(row);
    });
    
    table.appendChild(thead);
    table.appendChild(tbody);
    return table;
}

function createFormDataTable(formData) {
    const table = document.createElement('table');
    table.className = 'form-data-table';
    
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    ['Name', 'Type', 'Description'].forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    
    const tbody = document.createElement('tbody');
    formData.forEach(field => {
        const row = document.createElement('tr');
        
        const nameCell = document.createElement('td');
        nameCell.textContent = field.name || '';
        row.appendChild(nameCell);
        
        const typeCell = document.createElement('td');
        typeCell.textContent = field.type || '';
        row.appendChild(typeCell);
        
        const descCell = document.createElement('td');
        descCell.textContent = field.description || '';
        row.appendChild(descCell);
        
        tbody.appendChild(row);
    });
    
    table.appendChild(thead);
    table.appendChild(tbody);
    return table;
}

function createResponseElement(response) {
    const responseItem = document.createElement('div');
    responseItem.className = 'response-item';
    
    // Create response header
    const responseHeader = document.createElement('div');
    responseHeader.className = 'response-header';
    
    const status = document.createElement('div');
    status.className = `status status-${response.status}`;
    status.textContent = response.status;
    responseHeader.appendChild(status);
    
    const description = document.createElement('div');
    description.className = 'status-description';
    description.textContent = response.description || '';
    responseHeader.appendChild(description);
    
    responseItem.appendChild(responseHeader);
    
    // Create response body if content exists
    if (response.content) {
        const responseBody = document.createElement('div');
        responseBody.className = 'response-body';
        
        Object.keys(response.content).forEach(contentType => {
            const example = response.content[contentType].example;
            if (example) {
                const pre = document.createElement('pre');
                const code = document.createElement('code');
                code.className = getLanguageClass(contentType);
                code.textContent = JSON.stringify(example, null, 2);
                pre.appendChild(code);
                responseBody.appendChild(pre);
            }
        });
        
        responseItem.appendChild(responseBody);
    }
    
    return responseItem;
}

function getLanguageClass(contentType) {
    const typeToLang = {
        'application/json': 'language-json',
        'application/xml': 'language-xml',
        'text/html': 'language-html',
        'text/plain': 'language-txt',
        'application/javascript': 'language-javascript'
    };
    
    return typeToLang[contentType] || 'language-json';
}

function setupCopyButtons() {
    // Add event listeners to all copy buttons
    document.querySelectorAll('.copy-btn').forEach(button => {
        button.addEventListener('click', function() {
            // Find the closest URL container
            const urlContainer = this.closest('.endpoint-url-container');
            const urlText = urlContainer.querySelector('.endpoint-url').textContent;
            
            // Copy to clipboard
            navigator.clipboard.writeText(urlText).then(() => {
                // Visual feedback
                const originalHTML = this.innerHTML;
                this.innerHTML = '<i class="fas fa-check"></i>';
                setTimeout(() => {
                    this.innerHTML = originalHTML;
                }, 1500);
            })
            .catch(err => {
                console.error('Could not copy text: ', err);
            });
        });
    });
}

function setupSmoothScrolling() {
    // Add smooth scrolling for all hash links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Close mobile sidebar if it's open
                const sidebar = document.querySelector('.sidebar');
                if (sidebar.classList.contains('open')) {
                    sidebar.classList.remove('open');
                    document.getElementById('mobile-menu-toggle').innerHTML = '<i class="fas fa-bars"></i>';
                }
                
                // Smooth scroll to the element
                window.scrollTo({
                    top: targetElement.offsetTop - 20,
                    behavior: 'smooth'
                });
                
                // Update the URL
                history.pushState(null, null, targetId);
                
                // Add active class to the navigation item
                document.querySelectorAll('.nav-endpoint.active').forEach(item => {
                    item.classList.remove('active');
                });
                document.querySelector(`a[href="${targetId}"]`)?.classList.add('active');
            }
        });
    });
}

function initializeSearch(data) {
    const searchInput = document.getElementById('search-input');
    const suggestionsContainer = document.getElementById('search-suggestions');
    let allEndpoints = [];
    
    // Create a flat list of all endpoints with relevant data for searching
    data.sections.forEach(section => {
        if (section.endpoints) {
            section.endpoints.forEach(endpoint => {
                allEndpoints.push({
                    id: endpoint.id,
                    title: endpoint.title,
                    url: endpoint.url,
                    method: endpoint.method,
                    sectionTitle: section.title,
                    description: endpoint.description || ''
                });
            });
        }
    });
    
    // Search functionality
    searchInput.addEventListener('input', debounce(function() {
        const query = this.value.trim().toLowerCase();
        
        if (query.length < 2) {
            suggestionsContainer.style.display = 'none';
            suggestionsContainer.innerHTML = '';
            return;
        }
        
        // Filter endpoints by search query
        const filteredEndpoints = allEndpoints.filter(endpoint => {
            const titleMatch = endpoint.title.toLowerCase().includes(query);
            const urlMatch = endpoint.url.toLowerCase().includes(query);
            const methodMatch = endpoint.method.toLowerCase().includes(query);
            const descriptionMatch = endpoint.description.toLowerCase().includes(query);
            const sectionMatch = endpoint.sectionTitle.toLowerCase().includes(query);
            
            return titleMatch || urlMatch || methodMatch || descriptionMatch || sectionMatch;
        });
        
        // Sort results by relevance (title match first)
        filteredEndpoints.sort((a, b) => {
            const aTitle = a.title.toLowerCase();
            const bTitle = b.title.toLowerCase();
            
            if (aTitle.includes(query) && !bTitle.includes(query)) return -1;
            if (!aTitle.includes(query) && bTitle.includes(query)) return 1;
            return 0;
        });
        
        renderSearchSuggestions(filteredEndpoints, query);
    }, 300));
    
    // Hide suggestions when clicking outside
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !suggestionsContainer.contains(e.target)) {
            suggestionsContainer.style.display = 'none';
        }
    });
    
    // Show suggestions when input is focused
    searchInput.addEventListener('focus', function() {
        if (this.value.trim().length >= 2) {
            suggestionsContainer.style.display = 'block';
        }
    });
}

function renderSearchSuggestions(endpoints, query) {
    const suggestionsContainer = document.getElementById('search-suggestions');
    suggestionsContainer.innerHTML = '';
    
    if (endpoints.length === 0) {
        suggestionsContainer.innerHTML = '<div class="search-suggestion">No results found</div>';
        suggestionsContainer.style.display = 'block';
        return;
    }
    
    endpoints.slice(0, 10).forEach(endpoint => {
        const suggestion = document.createElement('div');
        suggestion.className = 'search-suggestion';
        
        // Highlight the matched part in the title
        const highlightedTitle = highlightText(endpoint.title, query);
        
        suggestion.innerHTML = `
            <div class="method ${endpoint.method.toLowerCase()}">${endpoint.method}</div>
            <div class="suggestion-content">
                <span class="suggestion-title">${highlightedTitle}</span>
                <span class="suggestion-url">${endpoint.url}</span>
                <span class="suggestion-section">${endpoint.sectionTitle}</span>
            </div>
        `;
        
        suggestion.addEventListener('click', () => {
            window.location.href = `#endpoint-${endpoint.id}`;
            suggestionsContainer.style.display = 'none';
        });
        
        suggestionsContainer.appendChild(suggestion);
    });
    
    suggestionsContainer.style.display = 'block';
}

function highlightText(text, query) {
    // Case-insensitive replace to highlight the search query
    const regex = new RegExp(query, 'gi');
    return text.replace(regex, match => `<span class="highlight">${match}</span>`);
}

function debounce(func, wait) {
    let timeout;
    return function(...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}