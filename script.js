$(document).ready(function () {

    // ======== Navbar Blur on Scroll ========
    $(window).scroll(function () {
        if ($(this).scrollTop() > 50) {
            $('.glass-nav').addClass('scrolled');
        } else {
            $('.glass-nav').removeClass('scrolled');
        }
    });

    // ======== Terminal Typing Effect ========
    const textsToType = [
        "python3 pwn_script.py",
        "nmap -p- -sV target_ip",
        "chmod +x exploit.sh; ./exploit.sh",
        "cat /etc/shadow"
    ];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingSpan = document.querySelector(".typing-text");

    function typeTerminal() {
        const currentText = textsToType[textIndex];

        if (isDeleting) {
            typingSpan.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingSpan.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = 100;

        if (isDeleting) { typeSpeed /= 2; }

        if (!isDeleting && charIndex === currentText.length) {
            typeSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % textsToType.length;
            typeSpeed = 500; // Pause before typing next word
        }

        setTimeout(typeTerminal, typeSpeed);
    }

    if (typingSpan) {
        setTimeout(typeTerminal, 1000); // Initial start typing delay
    }

    // ======== Make the Terminal Tilt on mousemove (3D effect) ========
    const tiltEl = document.querySelector('.tilt-element');

    if (tiltEl) {
        document.addEventListener('mousemove', function (e) {
            const xAxis = (window.innerWidth / 2 - e.pageX) / 40;
            const yAxis = (window.innerHeight / 2 - e.pageY) / 40;
            tiltEl.style.transform = `perspective(1000px) rotateY(${xAxis}deg) rotateX(${yAxis}deg) translateY(-10px)`;
        });

        // Reset on mouse leave
        tiltEl.addEventListener("mouseleave", function () {
            tiltEl.style.transform = "perspective(1000px) rotateY(0deg) rotateX(0deg)";
        });
    }

    // ======== Interactive Network Canvas (Light Theme Particles) ========
    const canvas = document.getElementById('network-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        let particlesArray = [];
        const mouse = {
            x: null,
            y: null,
            radius: 120 // Interaction radius
        }

        window.addEventListener('mousemove', function (event) {
            mouse.x = event.x;
            mouse.y = event.y;
        });

        // Add mouse out event to prevent clumping
        window.addEventListener('mouseout', function () {
            mouse.x = undefined;
            mouse.y = undefined;
        });

        // Create Particle setup
        class Particle {
            constructor(x, y, dx, dy, size, color) {
                this.x = x;
                this.y = y;
                this.dx = dx;
                this.dy = dy;
                this.size = size;
                this.color = color;
                this.baseX = this.x;
                this.baseY = this.y;
                this.density = (Math.random() * 30) + 1;
            }
            // Method to figure out distance between particles and mouse
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
                ctx.fillStyle = this.color;
                ctx.fill();
            }

            // Method to move particles
            update() {
                // Bounce off edges
                if (this.x > canvas.width || this.x < 0) this.dx = -this.dx;
                if (this.y > canvas.height || this.y < 0) this.dy = -this.dy;

                // Move particle
                this.x += this.dx;
                this.y += this.dy;

                // Mouse interactivity
                // uncomment if you want particles to repel from mouse
                /*
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                let forceDirectionX = dx / distance;
                let forceDirectionY = dy / distance;
                
                let maxDistance = mouse.radius;
                let force = (maxDistance - distance) / maxDistance;
                if(force < 0) force = 0;
                let directionX = (forceDirectionX * force * this.density);
                let directionY = (forceDirectionY * force * this.density);

                if (distance < mouse.radius) {
                    this.x -= directionX;
                    this.y -= directionY;
                } else {
                    if(this.x !== this.baseX) {
                        let dx = this.x - this.baseX;
                        this.x -= dx/10;
                    }
                    if (this.y !== this.baseY) {
                        let dy = this.y - this.baseY;
                        this.y -= dy/10;
                    }
                }
                */

                this.draw();
            }
        }

        // Initialize particle array
        function init() {
            particlesArray = [];
            // Amount of dots based on screen width
            let numberOfParticles = (canvas.width * canvas.height) / 12000;

            for (let i = 0; i < numberOfParticles; i++) {
                let size = (Math.random() * 2) + 1;
                let x = Math.random() * (canvas.width - size * 2) + size * 2;
                let y = Math.random() * (canvas.height - size * 2) + size * 2;
                // Movement speed
                let dx = (Math.random() - 0.5) * 1.5;
                let dy = (Math.random() - 0.5) * 1.5;
                let color = 'rgba(196, 139, 255, 0.6)'; // bright glowing purple color

                particlesArray.push(new Particle(x, y, dx, dy, size, color));
            }
        }

        // Check if particles are close enough to draw a line between them
        function connect() {
            let opacityValue = 1;
            for (let a = 0; a < particlesArray.length; a++) {
                for (let b = a; b < particlesArray.length; b++) {
                    let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x))
                        + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));

                    // Connect threshold
                    if (distance < (canvas.width / 10) * (canvas.height / 10)) {
                        opacityValue = 1 - (distance / 20000);
                        ctx.strokeStyle = `rgba(168, 85, 247, ${opacityValue * 0.8})`; // Bright purple connection line
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                        ctx.stroke();
                    }
                }
            }
        }

        // Animation loop
        function animate() {
            requestAnimationFrame(animate);
            ctx.clearRect(0, 0, canvas.width, canvas.height); // clear screen

            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
            }
            connect();
        }

        // Resize event
        window.addEventListener('resize', function () {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            init();
        });

        init();
        animate();
    }

    // ======== Intersection Observer for Scroll Reveals ========
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // run once
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal-up').forEach((el) => {
        observer.observe(el);
    });

    // ======== Smooth Scrolling for Nav Links ========
    $('a.nav-link, a[href^="#"]').on('click', function (event) {
        if (this.hash !== "") {
            event.preventDefault();
            const hash = this.hash;

            // Allow for hash jumping but calculate offset
            $('html, body').animate({
                scrollTop: $(hash).offset().top - 80 // Adjust for navbar height
            }, 800, 'swing', function () {
                // window.location.hash = hash; // prevent layout jump
            });

            // Close mobile menu if open
            if ($('.navbar-collapse').hasClass('show')) {
                $('.navbar-toggler').click();
            }
        }
    });

});
