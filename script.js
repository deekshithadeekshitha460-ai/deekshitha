const mockRecords = [
    { id: 'SRV-4021', district: 'Westview', area: '4.5', owner: 'Alexander Thorne', status: 'verified' },
    { id: 'SRV-8829', district: 'Eastgate', area: '12.2', owner: 'Sarah Jenkins', status: 'pending' },
    { id: 'SRV-1055', district: 'Southvale', area: '0.8', owner: 'Michael Chen', status: 'verified' },
    { id: 'SRV-3310', district: 'Northridge', area: '2.5', owner: 'Elena Rodriguez', status: 'verified' },
    { id: 'SRV-2022', district: 'Westview', area: '1.2', owner: 'James Wilson', status: 'pending' }
];

document.addEventListener('DOMContentLoaded', () => {
    const recordsBody = document.getElementById('recordsBody');
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.querySelector('.search-btn');
    const tabBtns = document.querySelectorAll('.tab-btn');

    // Render helper
    const renderRecords = (records) => {
        recordsBody.innerHTML = records.map(record => `
            <tr>
                <td><strong>${record.id}</strong></td>
                <td>${record.district}</td>
                <td>${record.area}</td>
                <td>${record.owner}</td>
                <td><span class="status-badge status-${record.status}">${record.status}</span></td>
                <td><a href="#" class="view-details" data-id="${record.id}" style="color: var(--accent); text-decoration: none; font-weight: 600;">View Details</a></td>
            </tr>
        `).join('');

        // Re-attach listeners to new "View Details" links
        document.querySelectorAll('.view-details').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                showDetails(link.dataset.id);
            });
        });
    };

    // Modal Logic
    const modal = document.getElementById('detailsModal');
    const closeModal = document.querySelector('.close-modal');
    const closeModalBtn = document.getElementById('closeModalBtn');

    const showDetails = (id) => {
        const record = mockRecords.find(r => r.id === id);
        if (!record) return;

        document.getElementById('modalTitle').innerText = `Property Portfolio: ${record.id}`;
        document.getElementById('detailOwner').innerText = record.owner;
        document.getElementById('detailId').innerText = record.id;
        document.getElementById('detailDistrict').innerText = record.district;
        document.getElementById('detailArea').innerText = `${record.area} Acres`;
        
        // Map Logic - use generated images for specific IDs
        const mapImg = document.getElementById('detailMap');
        const surveyPart = record.id.split('-')[1];
        if (['4021', '8829', '1055'].includes(surveyPart)) {
            mapImg.src = `map_${surveyPart}.png`;
        } else {
            mapImg.src = 'https://images.unsplash.com/photo-1541913080214-63023902341b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
        }

        const statusBadge = document.getElementById('modalStatus');
        statusBadge.innerText = record.status;
        statusBadge.className = `status-badge status-${record.status}`;

        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent background scroll
    };

    const hideModal = () => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    };

    closeModal.onclick = hideModal;
    closeModalBtn.onclick = hideModal;
    window.onclick = (event) => {
        if (event.target == modal) hideModal();
    };

    // Initial render
    renderRecords(mockRecords);

    // Tab switching
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const tab = btn.dataset.tab;
            if (tab === 'survey') searchInput.placeholder = "Enter survey number (e.g., 402/A)...";
            if (tab === 'owner') searchInput.placeholder = "Enter owner's full name...";
            if (tab === 'location') searchInput.placeholder = "Enter district or locality...";
        });
    });

    // Simple search logic
    const handleSearch = () => {
        const query = searchInput.value.toLowerCase();
        const filtered = mockRecords.filter(r => 
            r.id.toLowerCase().includes(query) || 
            r.owner.toLowerCase().includes(query) || 
            r.district.toLowerCase().includes(query)
        );
        
        // Add a small delay for "loading" feel
        recordsBody.style.opacity = '0.3';
        setTimeout(() => {
            renderRecords(filtered);
            recordsBody.style.opacity = '1';
            if (filtered.length > 0) {
                document.querySelector('.recent-records').scrollIntoView({ behavior: 'smooth' });
            }
        }, 300);
    };

    searchBtn.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        const nav = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            nav.style.height = '70px';
            nav.style.background = 'rgba(2, 12, 27, 0.95)';
        } else {
            nav.style.height = '80px';
            nav.style.background = 'rgba(2, 12, 27, 0.85)';
        }
    });
});
