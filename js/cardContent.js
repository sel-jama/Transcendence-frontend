class CardContent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.loadStyles().then(() => {
            console.log('Styles loaded successfully');
            this.render();
        }).catch(error => {
            console.error('Error loading styles:', error);
        });
    }

    loadStyles() {
        return Promise.all([
            this.loadCSS('https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css'),
            this.loadCSS('css/cardContent.css')
        ]);
    }

    loadCSS(href) {
        return new Promise((resolve, reject) => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = href;
            link.onload = () => resolve();
            link.onerror = () => reject(new Error(`Failed to load CSS: ${href}`));
            this.shadowRoot.appendChild(link);
        });
    }

    render() {
        this.shadowRoot.innerHTML += `
            <div class="tab-content" id="pills-tabContent">
                <div class="tab-pane fade show active" id="pills-sound" role="tabpanel">
                    <div class="mb-3">
                        <label for="sfxVolume" class="form-label">Sound Effects Volume:</label>
                        <input type="range" class="form-range" id="sfxVolume">
                    </div>
                    <div class="mb-3">
                        <label for="musicVolume" class="form-label">Music Volume:</label>
                        <input type="range" class="form-range" id="musicVolume">
                    </div>
                </div>
            </div>
        `;
    }
}

customElements.define('card-content', CardContent);