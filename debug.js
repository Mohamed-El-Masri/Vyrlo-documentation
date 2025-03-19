/**
 * This file contains debugging utilities for the API documentation site
 */

// Log when D3 is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Document loaded');
    
    // Check if D3 is available
    if (window.d3) {
        console.log('D3 library is loaded:', d3.version);
    } else {
        console.error('D3 library is not loaded!');
    }
    
    // Check for visualization containers
    ['service-visualization', 'file-visualization', 'auth-flow-chart'].forEach(id => {
        const container = document.getElementById(id);
        if (container) {
            console.log(`Found container #${id}, width: ${container.clientWidth}, height: ${container.clientHeight}`);
        } else {
            console.error(`Container #${id} not found!`);
        }
    });
    
    // Check tab setup
    const tabBtns = document.querySelectorAll('.tab-btn');
    console.log(`Found ${tabBtns.length} tab buttons`);
    
    // Listen for API data load event
    window.addEventListener('apiDataLoaded', function(e) {
        console.log('API data loaded event received:', e.detail ? 'Data available' : 'No data');
    });
    
    // Monitor tab clicks
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            console.log('Tab clicked:', this.getAttribute('data-tab'));
            
            // Check if the targeted tab content exists
            const targetId = this.getAttribute('data-tab');
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                console.log(`Target element #${targetId} found`);
            } else {
                console.error(`Target element #${targetId} not found!`);
            }
        });
    });
});

// Monitor resize events
window.addEventListener('resize', function() {
    console.log('Window resize event');
});
