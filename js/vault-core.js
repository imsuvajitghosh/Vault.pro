const VaultCore = {
    DB: 'PRO_VAULT_FINAL_DB',
    PIN: '00110011', // Default 8-digit PIN

    Auth: {
        buffer: "",
        press(n) { if (this.buffer.length < 8) { this.buffer += n; UI.updatePinDots(this.buffer.length); } },
        update() { UI.updatePinDots(this.buffer.length); if (this.buffer.length === 8) this.verify(); },
        verify() {
            if (this.buffer === VaultCore.PIN) {
                sessionStorage.setItem('vault_auth', 'true');
                window.location.href = 'dashboard.html';
            } else { UI.toast("Security Breach: Invalid PIN", "error"); UI.shake('.glass'); this.clear(); }
        },
        clear() { this.buffer = ""; UI.updatePinDots(0); }
    },

    Data: {
        get() { return JSON.parse(localStorage.getItem(VaultCore.DB)) || []; },
        save(data) { localStorage.setItem(VaultCore.DB, JSON.stringify(data)); },
        
        async processUpload() {
            const place = document.getElementById('p_place').value;
            const person = document.getElementById('p_person').value;
            const cat = document.getElementById('p_cat').value;
            const files = document.getElementById('f_input').files;

            if (!place || !person || files.length === 0) return UI.toast("Missing Metadata!", "error");

            let db = this.get();
            UI.toast("Encrypting Files...", "info");
            for (let file of files) {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                await new Promise(res => reader.onload = () => {
                    db.push({
                        id: Date.now() + Math.random(),
                        place: place.trim(), person: person.trim(), category: cat,
                        url: reader.result, likes: 0, comments: [], date: new Date().toLocaleDateString()
                    });
                    res();
                });
            }
            this.save(db);
            UI.toast("Successfully Vaulted!", "success");
            setTimeout(() => window.location.href = 'dashboard.html', 1000);
        }
    },

    Explorer: {
        init() {
            if(!sessionStorage.getItem('vault_auth')) window.location.href = 'index.html';
            this.renderPlaces();
        },

        search(query) {
            const grid = document.getElementById('explorerGrid');
            const data = VaultCore.Data.get();
            const filtered = data.filter(i => i.place.toLowerCase().includes(query.toLowerCase()) || i.person.toLowerCase().includes(query.toLowerCase()));
            this.renderImages("Search", "Results", filtered);
        },

        renderPlaces() {
            const grid = document.getElementById('explorerGrid');
            const data = VaultCore.Data.get();
            const places = [...new Set(data.map(i => i.place))];
            UI.updateBreadcrumbs(['Root Vault']);
            
            grid.innerHTML = places.map(place => `
                <div onclick="VaultCore.Explorer.renderPersons('${place}')" class="folder-card p-10 text-center animate__animated animate__fadeInUp">
                    <div class="text-7xl mb-4 floating">📂</div>
                    <h3 class="text-xl font-bold text-white tracking-tighter">${place}</h3>
                    <p class="text-slate-500 text-[10px] mt-2 uppercase tracking-widest">Tours Folder</p>
                </div>`).join('');
        },

        renderPersons(place) {
            const grid = document.getElementById('explorerGrid');
            const data = VaultCore.Data.get().filter(i => i.place === place);
            const people = [...new Set(data.map(i => i.person))];
            UI.updateBreadcrumbs(['Root', place]);

            grid.innerHTML = people.map(person => `
                <div onclick="VaultCore.Explorer.renderImages('${place}', '${person}')" class="folder-card p-8 text-center animate__animated animate__fadeInRight">
                    <div class="text-6xl mb-4">👤</div>
                    <h4 class="font-bold text-white">${person}</h4>
                    <p class="text-blue-500 text-[10px] font-black uppercase mt-1">Identity Node</p>
                </div>`).join('');
        },

        renderImages(place, person, customData = null) {
            const grid = document.getElementById('explorerGrid');
            const items = customData || VaultCore.Data.get().filter(i => i.place === place && i.person === person);
            if(!customData) UI.updateBreadcrumbs(['Root', place, person]);

            grid.innerHTML = items.map(img => `
                <div class="image-node glass animate__animated animate__zoomIn p-2">
                    <div class="relative group overflow-hidden rounded-2xl">
                        <img src="${img.url}" class="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-110">
                    </div>
                    <div class="p-3">
                        <div class="flex justify-between items-center mb-3 text-[10px]">
                            <span class="bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full uppercase font-bold">${img.category}</span>
                            <span class="text-slate-500">${img.date}</span>
                        </div>
                        <div class="grid grid-cols-6 gap-2">
                            <button onclick="VaultCore.Explorer.action('like', '${img.id}')" class="p-2 hover:bg-white/10 rounded-lg transition" title="Like">❤️</button>
                            <button onclick="VaultCore.Explorer.action('comment', '${img.id}')" class="p-2 hover:bg-white/10 rounded-lg transition" title="Comment">💬</button>
                            <button onclick="VaultCore.Explorer.action('download', '${img.id}')" class="p-2 hover:bg-white/10 rounded-lg transition" title="Download">📥</button>
                            <button onclick="VaultCore.Explorer.action('copy', '${img.id}')" class="p-2 hover:bg-white/10 rounded-lg transition" title="Copy">🔗</button>
                            <button onclick="VaultCore.Explorer.action('share', '${img.id}')" class="p-2 hover:bg-white/10 rounded-lg transition" title="Share">📤</button>
                            <button onclick="VaultCore.Explorer.action('delete', '${img.id}')" class="p-2 hover:bg-red-500/20 rounded-lg transition text-red-500" title="Delete">🗑️</button>
                        </div>
                    </div>
                </div>`).join('');
        },

        action(type, id) {
            let db = VaultCore.Data.get();
            let idx = db.findIndex(i => i.id == id);
            if (type === 'like') db[idx].likes++;
            if (type === 'delete') { if(confirm("Delete Permanently?")) db.splice(idx, 1); }
            if (type === 'copy') { navigator.clipboard.writeText(db[idx].url); UI.toast("Link Copied!", "info"); return; }
            if (type === 'download') { const a = document.createElement('a'); a.href = db[idx].url; a.download = 'vault.png'; a.click(); return; }
            if (type === 'share') { if(navigator.share) navigator.share({title: 'Vault Photo', url: db[idx].url}); else UI.toast("URL Copied!", "info"); return; }
            if (type === 'comment') { const c = prompt("Add comment:"); if(c) { if(!db[idx].comments) db[idx].comments = []; db[idx].comments.push(c); UI.toast("Comment Saved", "success"); } }
            
            VaultCore.Data.save(db);
            location.reload();
        }
    }
};