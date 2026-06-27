/**
 * APPLICATION LOGIC: MEMOPAL
 * Handles: Catalog Rendering, Category Filtering, FAQs Accordion,
 *          Wholesale Inquiry Modal, Mobile Nav, and WhatsApp Obfuscation
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. WhatsApp Number Obfuscation ---
    // Splitting the phone number to prevent basic web scraper bots from detecting it.
    const cc = '56';         // Chile Country Code
    const prefix = '9';     // Mobile Prefix
    const block1 = '4249';   // Number segment 1
    const block2 = '4302';   // Number segment 2
    const targetPhone = `${cc}${prefix}${block1}${block2}`; // "56942494302"

    /**
     * Helper to open WhatsApp in a new tab with custom pre-filled message
     * @param {string} textMessage - Message to send
     */
    function sendWhatsAppMessage(textMessage) {
        const encodedText = encodeURIComponent(textMessage);
        const waUrl = `https://api.whatsapp.com/send?phone=${targetPhone}&text=${encodedText}`;
        window.open(waUrl, '_blank', 'noopener,noreferrer');
    }

    // --- 2. Products Dataset (Static Catalog Model) ---
    const products = [
        {
            id: 1,
            name: "Palta Hass Mayorista (Caja)",
            category: "paltas",
            referencePrice: "$12.500 / Kilo",
            unit: "Venta mínima: 1 Caja (10 kg aprox.)",
            image: "assets/palta_hass.png",
            description: "Palta Hass seleccionada de calidad premium. Piel texturada y pulpa cremosa de excelente calidad, ideal para maduración controlada y venta en local."
        },
        {
            id: 2,
            name: "Palta Hass Calibre Primera (Malla)",
            category: "paltas",
            referencePrice: "$13.200 / Kilo",
            unit: "Venta mínima: 1 Malla (5 kg aprox.)",
            image: "assets/palta_hass.png",
            description: "Paltas Hass listas para comercialización inmediata, empacadas en mallas de alta resistencia. Calidad y calibre uniforme."
        },
        {
            id: 3,
            name: "Limón Sutil Seleccionado",
            category: "frutas",
            referencePrice: "$850 / Kilo",
            unit: "Venta mínima: 1 Malla (10 kg aprox.)",
            image: "assets/limon_sutil.png",
            description: "Limones sutiles frescos y jugosos, de color verde intenso. Cosechados recientemente, ideales para pescaderías, restaurantes y verdulerías."
        },
        {
            id: 4,
            name: "Tomate Larga Vida (Cajón)",
            category: "verduras",
            referencePrice: "$900 / Kilo",
            unit: "Venta mínima: 1 Cajón (15 kg aprox.)",
            image: "assets/tomate_larga_vida.png",
            description: "Tomates rojos y firmes, con excelente poscosecha. Perfectos para almacenamiento y distribución minorista en Cauquenes y Linares."
        },
        {
            id: 5,
            name: "Cebolla de Guarda de Primera",
            category: "verduras",
            referencePrice: "$750 / Kilo",
            unit: "Venta mínima: 1 Saco (15 kg aprox.)",
            image: "assets/cebolla_guarda.png",
            description: "Cebollas secas y firmes con piel dorada uniforme. Larga duración ideales para abastecimiento de temporada."
        },
        {
            id: 6,
            name: "Papa Patagonia Lavada",
            category: "verduras",
            referencePrice: "$680 / Kilo",
            unit: "Venta mínima: 1 Saco (20 kg aprox.)",
            image: "assets/papa_patagonia.png",
            description: "Papas seleccionadas y limpias, listas para la venta. Excelente cocción, muy demandadas por clientes de comida rápida y hogares."
        }
    ];

    let selectedProduct = null;

    // --- 3. Render Catalog Function ---
    const catalogGrid = document.getElementById('catalog-grid');

    /**
     * Renders products filtered by category
     * @param {string} filter - Category to filter ('todos', 'paltas', 'frutas', 'verduras')
     */
    function renderProducts(filter = 'todos') {
        catalogGrid.innerHTML = '';
        
        const filteredProducts = filter === 'todos' 
            ? products 
            : products.filter(p => p.category === filter);
        
        if (filteredProducts.length === 0) {
            catalogGrid.innerHTML = `
                <div class="no-products text-center w-full" style="padding: 40px 0;">
                    <p style="color: var(--color-text-muted);">No hay productos disponibles en esta categoría en este momento.</p>
                </div>
            `;
            return;
        }

        filteredProducts.forEach(product => {
            const card = document.createElement('article');
            card.className = 'product-card';
            card.innerHTML = `
                <div class="product-img-wrapper">
                    <img src="${product.image}" alt="${product.name}" class="product-img" loading="lazy">
                    <span class="product-tag">${product.category}</span>
                </div>
                <div class="product-body">
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-desc">${product.description}</p>
                    <div class="product-footer">
                        <div class="product-price-container">
                            <span class="price-label">Precio Referencial</span>
                            <span class="price-value">${product.referencePrice}</span>
                            <span class="price-unit">${product.unit}</span>
                        </div>
                        <button class="btn btn-primary product-cta-btn" data-product-id="${product.id}">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="btn-icon"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                            <span>Consultar Stock y Precio</span>
                        </button>
                    </div>
                </div>
            `;
            catalogGrid.appendChild(card);
        });

        // Bind click event to trigger the Inquiry Modal
        document.querySelectorAll('.product-cta-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const productId = parseInt(btn.getAttribute('data-product-id'), 10);
                openInquiryModal(productId);
            });
        });
    }

    // --- 4. Category Filter Event Listeners ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const category = button.getAttribute('data-category');
            renderProducts(category);
        });
    });

    // Initial catalog render
    renderProducts();

    // --- 5. Wholesale Inquiry Modal Logic ---
    const modalBackdrop = document.getElementById('inquiry-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalImg = document.getElementById('modal-product-image');
    const modalCategory = document.getElementById('modal-product-category');
    const modalName = document.getElementById('modal-product-name');
    const modalDesc = document.getElementById('modal-product-desc');
    const modalPrice = document.getElementById('modal-product-price');
    const modalUnit = document.getElementById('modal-product-unit');
    const qtyInput = document.getElementById('modal-qty');
    const locationSelect = document.getElementById('modal-location');
    
    const qtyMinus = document.getElementById('qty-minus');
    const qtyPlus = document.getElementById('qty-plus');
    const modalSubmitBtn = document.getElementById('modal-submit-btn');

    /**
     * Opens modal populated with selected product details
     * @param {number} id - Product ID
     */
    function openInquiryModal(id) {
        selectedProduct = products.find(p => p.id === id);
        if (!selectedProduct) return;

        // Populate details
        modalImg.src = selectedProduct.image;
        modalImg.alt = selectedProduct.name;
        modalCategory.textContent = selectedProduct.category;
        modalName.textContent = selectedProduct.name;
        modalDesc.textContent = selectedProduct.description;
        modalPrice.textContent = selectedProduct.referencePrice;
        modalUnit.textContent = selectedProduct.unit;
        
        // Reset form inputs
        qtyInput.value = "1";
        locationSelect.selectedIndex = 0;

        // Open transition
        modalBackdrop.classList.add('open');
        document.body.style.overflow = 'hidden'; // prevent background scrolling
    }

    function closeInquiryModal() {
        modalBackdrop.classList.remove('open');
        document.body.style.overflow = '';
        selectedProduct = null;
    }

    // Modal Close Triggers
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeInquiryModal);
    }
    
    if (modalBackdrop) {
        modalBackdrop.addEventListener('click', (e) => {
            if (e.target === modalBackdrop) {
                closeInquiryModal();
            }
        });
    }

    // Quantity Picker Actions
    if (qtyMinus && qtyInput) {
        qtyMinus.addEventListener('click', () => {
            let val = parseInt(qtyInput.value, 10) || 1;
            if (val > 1) {
                qtyInput.value = (val - 1).toString();
            }
        });
    }

    if (qtyPlus && qtyInput) {
        qtyPlus.addEventListener('click', () => {
            let val = parseInt(qtyInput.value, 10) || 1;
            qtyInput.value = (val + 1).toString();
        });
    }

    if (qtyInput) {
        qtyInput.addEventListener('change', () => {
            let val = parseInt(qtyInput.value, 10) || 1;
            if (val < 1) val = 1;
            qtyInput.value = val.toString();
        });
    }

    // Modal WhatsApp Submission
    if (modalSubmitBtn) {
        modalSubmitBtn.addEventListener('click', () => {
            if (!selectedProduct) return;
            
            const qty = qtyInput.value;
            const location = locationSelect.value;
            
            const msg = `Hola! Vengo de su sitio web mayorista. Quisiera cotizar el siguiente producto:
- *Producto:* ${selectedProduct.name}
- *Cantidad estimada:* ${qty} cajas/sacos
- *Comuna de despacho:* ${location}

¿Me podrían indicar precio final para entrega y coordinar disponibilidad? Muchas gracias!`;
            
            sendWhatsAppMessage(msg);
            closeInquiryModal();
        });
    }

    // --- 6. FAQs Accordion Toggle Logic ---
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Close other items
                faqItems.forEach(otherItem => otherItem.classList.remove('active'));
                
                // Toggle current
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        }
    });

    // --- 7. General Navigation & Layout Listeners ---
    
    // Smooth scroll for Hero CTA button
    const heroCtaBtn = document.getElementById('hero-cta-btn');
    if (heroCtaBtn) {
        heroCtaBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const targetSection = document.getElementById('catalog');
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // General WhatsApp Triggers
    const navWhatsAppBtn = document.getElementById('nav-whatsapp-btn');
    if (navWhatsAppBtn) {
        navWhatsAppBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const message = "Hola! Me gustaría recibir el listado completo de productos mayoristas disponibles y cotizar precios de despacho.";
            sendWhatsAppMessage(message);
        });
    }

    const contactWhatsAppBtn = document.getElementById('contact-whatsapp-btn');
    if (contactWhatsAppBtn) {
        contactWhatsAppBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const message = "Hola! Quisiera hablar con un vendedor sobre disponibilidad de despacho de paltas, frutas y verduras en las comunas de Cauquenes y Linares.";
            sendWhatsAppMessage(message);
        });
    }

    const floatingWhatsAppBtn = document.getElementById('floating-whatsapp-btn');
    if (floatingWhatsAppBtn) {
        floatingWhatsAppBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const message = "Hola, quiero información sobre sus productos mayoristas y el área de despacho.";
            sendWhatsAppMessage(message);
        });
    }

    // --- 8. Mobile Menu Logic ---
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navLinks = document.getElementById('nav-links');
    const menuIcon = document.getElementById('menu-icon');

    if (mobileMenuToggle && navLinks) {
        mobileMenuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            
            const isOpen = navLinks.classList.contains('active');
            if (isOpen) {
                menuIcon.setAttribute('data-lucide', 'x');
            } else {
                menuIcon.setAttribute('data-lucide', 'menu');
            }
            if (window.lucide) {
                window.lucide.createIcons();
            }
        });

        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                menuIcon.setAttribute('data-lucide', 'menu');
                if (window.lucide) {
                    window.lucide.createIcons();
                }
            });
        });
    }

    // --- 9. Initialize Lucide Icons ---
    if (window.lucide) {
        window.lucide.createIcons();
    }
});
