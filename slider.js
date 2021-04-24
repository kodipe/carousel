class Slider {
    constructor(el, options = {
        slides
    }) {
        this.ui = {};
        this.options = options;
        this.current = 0;

        this.instance = el;
        this.slides = this.instance.querySelectorAll(this.options.slides ? this.options.slides : ".item");

        this.build();
        this.addListeners();

        this.update();
    }

    getConfig() {
        return Object.assign({}, this.options, this.options.responsive.find(r => r.breakpoint >= window.innerWidth)?.settings);
    }

    build() {
        
        /* Buttons */

        if(this.slides.length > this.getConfig().show) {
            this.ui.prev = document.createElement("button");
            this.ui.prev.innerHTML = "Prev";

            this.instance.parentNode.insertBefore(this.ui.prev, this.instance)

            this.ui.next = document.createElement("button");
            this.ui.next.innerHTML = "Next";

            this.instance.parentNode.append(this.ui.next)

            /* Track */

            this.ui.track = document.createElement("div");
            this.ui.track.classList.add("track");

            this.instance.append(this.ui.track);

            this.slides.forEach(slide => {
                this.ui.track.appendChild(slide);
                slide.classList.add("slide")
            });

            window.addEventListener("resize", () => this.update());
        }
    }

    update() {
        this.slides.forEach(slide => slide.style.flex = `0 0 ${100/this.getConfig().show}%`)
        this.ui.track.style.transform = `translate(-${this.current * (100/this.getConfig().show)}%, 0)`;

        this.slides.forEach((slide, index) => {
            if(index >= this.current && index < this.current + this.getConfig().show) {
                slide.classList.add('active')
            } else {
                slide.classList.remove('active')
            }
        })
    }

    addListeners() {
        this.ui.next.addEventListener("click", () => {
            if(this.current === this.slides.length - this.getConfig().show) {
                this.current = 0;
            } else {
                this.current = Math.min(this.current + this.getConfig().scroll, this.slides.length - this.getConfig().show);
            }
            this.update();
        })

        this.ui.prev.addEventListener("click", () => {
            if(this.current === 0 ) {
                this.current = this.slides.length - this.getConfig().show;
            } else {
                this.current = Math.max(this.current - this.getConfig().scroll, 0);
            }
            this.update();
        })
    }
}