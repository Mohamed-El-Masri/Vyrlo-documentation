/**
 * API Relationships and Service Visualization script
 * This script adds visualizations showing how different APIs relate to each other
 * and how they connect to frontend files.
 */

// Define totalEndpoints at the module level so it's accessible to all functions
let totalEndpoints = 0;

document.addEventListener('DOMContentLoaded', function() {
    console.log('Document loaded, setting up tabs and waiting for API data');
    setupTabs();
    
    // Wait for the API data to be loaded
    const checkDataInterval = setInterval(() => {
        if (window.apiData) {
            clearInterval(checkDataInterval);
            console.log('API data loaded, initializing visualizations');
            initVisualization(window.apiData);
        }
    }, 100);
});

function initVisualization(data) {
    updateStatistics(data);
    createServiceMap(data);
    createFileMap(data);
    createAuthFlowChart();
    mapApiToFileRelationships(data);
}

function updateStatistics(data) {
    // Count total endpoints
    totalEndpoints = 0; // Reset the global variable
    let authProtectedEndpoints = 0;

    data.sections.forEach(section => {
        if (section.endpoints) {
            totalEndpoints += section.endpoints.length;
            
            // Count auth protected endpoints (those with token headers)
            section.endpoints.forEach(endpoint => {
                if (endpoint.headers && endpoint.headers.some(h => h.name === 'token')) {
                    authProtectedEndpoints++;
                }
            });
        }
    });

    // Update DOM
    document.getElementById('endpoints-count').textContent = totalEndpoints;
    document.getElementById('services-count').textContent = data.sections.length;
    document.getElementById('auth-endpoints').textContent = authProtectedEndpoints;
}

// Add zoom functionality to the service visualization

function createServiceMap(data) {
    const container = document.getElementById('service-visualization');
    if (!container) return;
    container.innerHTML = '';

    // Set up dimensions
    const width = container.clientWidth;
    const height = container.clientHeight || 400;
    
    // Create SVG element with zoom support
    const svg = d3.select(container)
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('viewBox', [0, 0, width, height])
        .attr('style', 'max-width: 100%; height: auto;');
    
    // Add zoom controls
    const zoomControls = d3.select(container)
        .append('div')
        .attr('class', 'zoom-controls')
        .style('position', 'absolute')
        .style('top', '10px')
        .style('right', '10px')
        .style('display', 'flex')
        .style('flex-direction', 'column')
        .style('gap', '5px');
    
    zoomControls.append('button')
        .attr('class', 'zoom-button zoom-in')
        .style('width', '30px')
        .style('height', '30px')
        .style('border-radius', '50%')
        .style('background', 'white')
        .style('border', '1px solid #ccc')
        .style('display', 'flex')
        .style('align-items', 'center')
        .style('justify-content', 'center')
        .style('cursor', 'pointer')
        .style('font-size', '16px')
        .html('<i class="fas fa-plus"></i>')
        .on('click', () => zoomBy(1.2));
    
    zoomControls.append('button')
        .attr('class', 'zoom-button zoom-out')
        .style('width', '30px')
        .style('height', '30px')
        .style('border-radius', '50%')
        .style('background', 'white')
        .style('border', '1px solid #ccc')
        .style('display', 'flex')
        .style('align-items', 'center')
        .style('justify-content', 'center')
        .style('cursor', 'pointer')
        .style('font-size', '16px')
        .html('<i class="fas fa-minus"></i>')
        .on('click', () => zoomBy(0.8));
    
    zoomControls.append('button')
        .attr('class', 'zoom-button zoom-reset')
        .style('width', '30px')
        .style('height', '30px')
        .style('border-radius', '50%')
        .style('background', 'white')
        .style('border', '1px solid #ccc')
        .style('display', 'flex')
        .style('align-items', 'center')
        .style('justify-content', 'center')
        .style('cursor', 'pointer')
        .style('font-size', '16px')
        .html('<i class="fas fa-home"></i>')
        .on('click', resetZoom);
    
    // Create a group for all visualization elements that will be zoomed
    const g = svg.append('g');
    
    // Define zoom behavior
    const zoom = d3.zoom()
        .scaleExtent([0.1, 4])
        .on('zoom', (event) => {
            g.attr('transform', event.transform);
        });
    
    // Apply zoom behavior to SVG
    svg.call(zoom);
    
    // Function to zoom by a factor
    function zoomBy(factor) {
        svg.transition()
            .duration(300)
            .call(zoom.scaleBy, factor);
    }
    
    // Function to reset zoom
    function resetZoom() {
        svg.transition()
            .duration(300)
            .call(zoom.transform, d3.zoomIdentity);
    }

    // Prepare data for visualization
    const nodes = [];
    const links = [];
    
    // Create center node (API Gateway)
    nodes.push({
        id: 'gateway',
        name: 'API Gateway',
        group: 'gateway',
        size: 20
    });
    
    // Create nodes for each section
    data.sections.forEach(section => {
        nodes.push({
            id: section.id,
            name: section.title,
            group: section.id,
            size: section.endpoints ? 10 + section.endpoints.length : 10
        });
        
        // Link from gateway to section
        links.push({
            source: 'gateway',
            target: section.id,
            value: section.endpoints ? section.endpoints.length : 1
        });
    });
    
    // Add relationships between services
    // Authentication -> Profile
    if (nodes.find(n => n.id === 'authentication') && nodes.find(n => n.id === 'profile')) {
        links.push({
            source: 'authentication',
            target: 'profile',
            value: 2
        });
    }
    
    // Profile -> Listings
    if (nodes.find(n => n.id === 'profile') && nodes.find(n => n.id === 'listings')) {
        links.push({
            source: 'profile',
            target: 'listings',
            value: 2
        });
    }
    
    // Listings -> Reviews
    if (nodes.find(n => n.id === 'listings') && nodes.find(n => n.id === 'reviews')) {
        links.push({
            source: 'listings',
            target: 'reviews',
            value: 1
        });
    }
    
    // Categories -> Listings
    if (nodes.find(n => n.id === 'categories') && nodes.find(n => n.id === 'listings')) {
        links.push({
            source: 'categories',
            target: 'listings',
            value: 1
        });
    }
    
    // Profile -> Payments
    if (nodes.find(n => n.id === 'profile') && nodes.find(n => n.id === 'payments')) {
        links.push({
            source: 'profile',
            target: 'payments',
            value: 1
        });
    }
    
    // Create force simulation
    const simulation = d3.forceSimulation(nodes)
        .force('link', d3.forceLink(links).id(d => d.id).distance(100))
        .force('charge', d3.forceManyBody().strength(-200))
        .force('center', d3.forceCenter(width / 2, height / 2))
        .on('tick', ticked);
    
    // Create links within the group g
    const link = g.append('g')
        .attr('stroke', '#999')
        .attr('stroke-opacity', 0.6)
        .selectAll('line')
        .data(links)
        .join('line')
        .attr('stroke-width', d => Math.sqrt(d.value) * 2);
    
    // Create nodes within the group g
    const node = g.append('g')
        .attr('stroke', '#fff')
        .attr('stroke-width', 1.5)
        .selectAll('circle')
        .data(nodes)
        .join('circle')
        .attr('r', d => d.size)
        .attr('fill', d => getNodeColor(d))
        .call(drag(simulation))
        .on('mouseover', function(event, d) {
            d3.select(this).attr('stroke', '#000');
            showTooltip(event, d);
        })
        .on('mouseout', function() {
            d3.select(this).attr('stroke', '#fff');
            hideTooltip();
        });
    
    // Add text labels within the group g
    const text = g.append('g')
        .selectAll('text')
        .data(nodes)
        .join('text')
        .attr('text-anchor', 'middle')
        .attr('dy', d => d.id === 'gateway' ? '-1.5em' : '2.5em')
        .text(d => d.name)
        .attr('font-size', d => d.id === 'gateway' ? '14px' : '12px')
        .attr('fill', '#333')
        .attr('pointer-events', 'none');
    
    // Handle position updates
    function ticked() {
        link
            .attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y);
        
        node
            .attr('cx', d => d.x = Math.max(d.size, Math.min(width - d.size, d.x)))
            .attr('cy', d => d.y = Math.max(d.size, Math.min(height - d.size, d.y)));
        
        text
            .attr('x', d => d.x)
            .attr('y', d => d.y);
    }
    
    // Handle node dragging
    function drag(simulation) {
        function dragstarted(event) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            event.subject.fx = event.subject.x;
            event.subject.fy = event.subject.y;
        }
        
        function dragged(event) {
            event.subject.fx = event.x;
            event.subject.fy = event.y;
        }
        
        function dragended(event) {
            if (!event.active) simulation.alphaTarget(0);
            event.subject.fx = null;
            event.subject.fy = null;
        }
        
        return d3.drag()
            .on('start', dragstarted)
            .on('drag', dragged)
            .on('end', dragended);
    }
    
    // Get color for nodes based on group/category
    function getNodeColor(node) {
        const colorMap = {
            'gateway': '#2c3e50',
            'authentication': '#3498db',
            'profile': '#9b59b6',
            'payments': '#e74c3c',
            'listings': '#2ecc71',
            'reviews': '#f39c12',
            'categories': '#1abc9c',
            'pricing': '#e67e22'
        };
        
        return colorMap[node.group] || '#95a5a6';
    }
    
    // Tooltip functions
    function showTooltip(event, d) {
        const tooltip = d3.select('body').append('div')
            .attr('class', 'tooltip')
            .style('position', 'absolute')
            .style('background', 'white')
            .style('padding', '10px')
            .style('border-radius', '5px')
            .style('box-shadow', '0 0 10px rgba(0,0,0,0.2)')
            .style('pointer-events', 'none')
            .style('z-index', 1000);
        
        // Calculate endpoints count for this node - this approach avoids the reference error
        let endpointsCount = 0;
        if (d.group === 'gateway') {
            // For gateway, use the global totalEndpoints
            endpointsCount = totalEndpoints;
        } else {
            // For other services, count their endpoints directly
            const section = data.sections.find(s => s.id === d.id);
            endpointsCount = section && section.endpoints ? section.endpoints.length : 0;
        }
        
        tooltip.html(`
            <strong>${d.name}</strong><br>
            Endpoints: ${endpointsCount}
        `);
        
        tooltip
            .style('left', (event.pageX + 10) + 'px')
            .style('top', (event.pageY + 10) + 'px');
    }
    
    function hideTooltip() {
        d3.select('.tooltip').remove();
    }
}

function createFileMap(data) {
    const container = document.getElementById('file-visualization');
    if (!container) return;
    container.innerHTML = '';
    
    // This is a simplified tree diagram showing how API services connect to frontend files
    
    // Define root data structure for tree
    const rootData = {
        name: "VYRLO",
        children: [
            {
                name: "API Services",
                children: []
            },
            {
                name: "Frontend Files",
                children: [
                    { 
                        name: "auth", 
                        children: [
                            { name: "login.js" },
                            { name: "register.js" },
                            { name: "forgot-password.js" }
                        ] 
                    },
                    { 
                        name: "profile", 
                        children: [
                            { name: "user-profile.js" },
                            { name: "edit-profile.js" }
                        ] 
                    },
                    { 
                        name: "listings", 
                        children: [
                            { name: "listing-search.js" },
                            { name: "listing-details.js" },
                            { name: "create-listing.js" }
                        ] 
                    }
                ]
            }
        ]
    };
    
    // Add API services from data
    data.sections.forEach(section => {
        rootData.children[0].children.push({
            name: section.title,
            size: section.endpoints ? section.endpoints.length * 5000 : 5000
        });
    });
    
    // Set up dimensions
    const width = container.clientWidth;
    const height = container.clientHeight || 400;
    const margin = {top: 10, right: 120, bottom: 10, left: 120};
    
    // Create SVG
    const svg = d3.select(container)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("style", "max-width: 100%; height: auto;");
    
    const g = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);
    
    // Create hierarchical layout
    const root = d3.hierarchy(rootData);
    
    const treeLayout = d3.tree()
        .size([height - margin.top - margin.bottom, width - margin.left - margin.right]);
    
    treeLayout(root);
    
    // Create links
    const link = g.selectAll(".link")
        .data(root.links())
        .enter().append("path")
        .attr("class", "link")
        .attr("fill", "none")
        .attr("stroke", "#ccc")
        .attr("stroke-width", 1.5)
        .attr("d", d3.linkHorizontal()
            .x(d => d.y)
            .y(d => d.x));
    
    // Create nodes
    const node = g.selectAll(".node")
        .data(root.descendants())
        .enter().append("g")
        .attr("class", d => "node" + (d.children ? " node--internal" : " node--leaf"))
        .attr("transform", d => `translate(${d.y},${d.x})`);
    
    // Add circles for nodes
    node.append("circle")
        .attr("r", d => d.data.size ? Math.sqrt(d.data.size) / 20 : 5)
        .attr("fill", d => {
            if (d.data.name === "VYRLO") return "#2c3e50";
            if (d.data.name === "API Services") return "#3498db";
            if (d.data.name === "Frontend Files") return "#e67e22";
            if (d.data.name.endsWith(".js")) return "#2ecc71";
            return "#9b59b6";
        });
    
    // Add labels
    node.append("text")
        .attr("dy", "0.31em")
        .attr("x", d => d.children ? -6 : 6)
        .attr("text-anchor", d => d.children ? "end" : "start")
        .text(d => d.data.name)
        .attr("font-size", "12px")
        .attr("fill", "#333");
}

function createAuthFlowChart() {
    const container = document.getElementById('auth-flow-chart');
    if (!container) return;
    container.innerHTML = '';
    
    // Set up dimensions
    const width = container.clientWidth;
    const height = container.clientHeight || 400;
    const margin = {top: 30, right: 30, bottom: 30, left: 30};
    
    // Define the auth flow steps
    const steps = [
        { id: "signup", name: "Sign Up", description: "Register a new user" },
        { id: "signin", name: "Sign In", description: "Login with credentials" },
        { id: "token", name: "Get Token", description: "Receive authentication token" },
        { id: "use", name: "Use APIs", description: "Access protected endpoints" },
        { id: "refresh", name: "Refresh Token", description: "Keep session active" }
    ];
    
    // Create SVG
    const svg = d3.select(container)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("style", "max-width: 100%; height: auto;");
    
    const g = svg.append("g");
    
    // Create nodes
    const nodeWidth = 120;
    const nodeHeight = 60;
    const stepWidth = (width - margin.left - margin.right - nodeWidth) / (steps.length - 1);
    
    const nodes = steps.map((step, i) => {
        return {
            id: step.id,
            name: step.name,
            description: step.description,
            x: margin.left + i * stepWidth,
            y: height / 2 - nodeHeight / 2
        };
    });
    
    // Create links between nodes
    const links = [];
    for (let i = 0; i < nodes.length - 1; i++) {
        links.push({
            source: {x: nodes[i].x + nodeWidth, y: nodes[i].y + nodeHeight / 2},
            target: {x: nodes[i+1].x, y: nodes[i+1].y + nodeHeight / 2}
        });
    }
    
    // Render links as arrows
    const arrow = g.selectAll(".arrow")
        .data(links)
        .enter()
        .append("g");
    
    arrow.append("line")
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x - 10)
        .attr("y2", d => d.target.y)
        .attr("stroke", "#3498db")
        .attr("stroke-width", 2);
    
    arrow.append("polygon")
        .attr("points", (d) => {
            const x = d.target.x;
            const y = d.target.y;
            return `${x-10},${y-6} ${x},${y} ${x-10},${y+6}`;
        })
        .attr("fill", "#3498db");
    
    // Render node rectangles
    const node = g.selectAll(".node")
        .data(nodes)
        .enter()
        .append("g");
    
    node.append("rect")
        .attr("x", d => d.x)
        .attr("y", d => d.y)
        .attr("width", nodeWidth)
        .attr("height", nodeHeight)
        .attr("rx", 5)
        .attr("ry", 5)
        .attr("fill", "#fff")
        .attr("stroke", "#3498db")
        .attr("stroke-width", 2);
    
    // Add titles
    node.append("text")
        .attr("x", d => d.x + nodeWidth / 2)
        .attr("y", d => d.y + 20)
        .attr("text-anchor", "middle")
        .attr("font-weight", "bold")
        .attr("font-size", "12px")
        .text(d => d.name);
    
    // Add descriptions
    node.append("text")
        .attr("x", d => d.x + nodeWidth / 2)
        .attr("y", d => d.y + 40)
        .attr("text-anchor", "middle")
        .attr("font-size", "10px")
        .text(d => d.description);
}

function mapApiToFileRelationships(data) {
    // Create a mapping of API endpoints to related frontend files
    const fileMapping = {
        'authentication': ['auth-service.js', 'login.js', 'register.js', 'forgot-password.js'],
        'profile': ['profile-service.js', 'user-profile.js', 'edit-profile.js'],
        'payments': ['payment-service.js', 'checkout.js'],
        'pricing': ['pricing-service.js', 'pricing.js'],
        'reviews': ['review-service.js', 'reviews.js'],
        'categories': ['category-service.js', 'categories.js'],
        'listings': ['listing-service.js', 'listing-search.js', 'listing-details.js', 'create-listing.js']
    };
    
    // Add related files to each endpoint in the DOM
    data.sections.forEach(section => {
        if (!section.endpoints) return;
        
        section.endpoints.forEach(endpoint => {
            const relatedFiles = fileMapping[section.id] || [];
            const endpointElement = document.getElementById(`endpoint-${endpoint.id}`);
            if (!endpointElement) return;
            
            const relatedFilesContent = endpointElement.querySelector('.related-files-content');
            if (!relatedFilesContent) return;
            
            if (relatedFiles.length === 0) {
                endpointElement.querySelector('.related-files').style.display = 'none';
                return;
            }
            
            const filesList = document.createElement('ul');
            filesList.className = 'related-files-list';
            
            relatedFiles.forEach(file => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `<i class="fas fa-file-code"></i> ${file}`;
                filesList.appendChild(listItem);
            });
            
            relatedFilesContent.appendChild(filesList);
        });
    });
    
    // Make service badges for each endpoint
    data.sections.forEach(section => {
        if (!section.endpoints) return;
        
        section.endpoints.forEach(endpoint => {
            const endpointElement = document.getElementById(`endpoint-${endpoint.id}`);
            if (!endpointElement) return;
            
            const serviceBadge = endpointElement.querySelector('.service-badge');
            if (!serviceBadge) return;
            
            serviceBadge.textContent = section.title;
            serviceBadge.classList.add(`service-${section.id}`);
        });
    });
}

function setupTabs() {
    // Tab switching functionality
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    if (tabBtns.length === 0) {
        console.warn('No tab buttons found');
        return;
    }
    
    console.log('Setting up tabs:', tabBtns.length, 'buttons found');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            console.log('Tab clicked:', btn.getAttribute('data-tab'));
            
            // Remove active class from all buttons and contents
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            btn.classList.add('active');
            const tabId = btn.getAttribute('data-tab');
            const tabContent = document.getElementById(tabId);
            
            if (tabContent) {
                tabContent.classList.add('active');
                
                // Trigger resize event for D3 visualizations
                window.dispatchEvent(new Event('resize'));
                
                // If this is the service-map tab and it's now active, reinitialize the visualization
                if (tabId === 'service-map' && window.apiData) {
                    setTimeout(() => {
                        createServiceMap(window.apiData);
                    }, 100);
                }
                
                // Same for file-map
                if (tabId === 'file-map' && window.apiData) {
                    setTimeout(() => {
                        createFileMap(window.apiData);
                    }, 100);
                }
                
                // Same for auth-flow
                if (tabId === 'auth-flow') {
                    setTimeout(() => {
                        createAuthFlowChart();
                    }, 100);
                }
            } else {
                console.error('Tab content not found for id:', tabId);
            }
        });
    });
}

// Make apiData available globally when script.js loads it
window.addEventListener('apiDataLoaded', function(e) {
    window.apiData = e.detail;
    initVisualization(window.apiData);
});

// Make sure to update the visualization areas when tabs change or window resizes
window.addEventListener('resize', function() {
    if (window.apiData) {
        // Delay to ensure DOM is ready
        setTimeout(() => {
            // Get active tab
            const activeTab = document.querySelector('.tab-content.active');
            if (activeTab) {
                if (activeTab.id === 'service-map') {
                    createServiceMap(window.apiData);
                } else if (activeTab.id === 'file-map') {
                    createFileMap(window.apiData);
                } else if (activeTab.id === 'auth-flow') {
                    createAuthFlowChart();
                }
            }
        }, 200);
    }
});