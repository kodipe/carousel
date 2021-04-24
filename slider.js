class Slider {
    constructor(el, options = {
        slides
    }) {
        this.ui = {};
        this.options = options;
        this.current = 0;

        this.instance = el;
        this.slides = this.instance.querySelectorAll(this.options.slides ? this.options.slides : ".item");
        
        this.tailClones = [];
        this.startClones = [];

        if(this.slides.length > this.getConfig().show) {
            this.build();
            this.addListeners();

            this.update();
        }
    }

    getConfig() {
        return Object.assign({}, this.options, this.options.responsive.find(r => r.breakpoint >= window.innerWidth)?.settings);
    }

    build() {

        /* Buttons */

        this.ui.prev = document.createElement("button");
        this.ui.prev.innerHTML = "Prev";

        this.instance.parentNode.insertBefore(this.ui.prev, this.instance)

        this.ui.next = document.createElement("button");
        this.ui.next.innerHTML = "Next";

        this.instance.parentNode.append(this.ui.next)

        /* Track */

        this.ui.track = document.createElement("div");
        this.ui.track.classList.add("track");
        this.ui.track.style.transition = ".3s ease transform";

        this.instance.append(this.ui.track);

        this.slides.forEach(slide => {
            this.ui.track.appendChild(slide);
            slide.classList.add("slide")
            slide.style.transition = ".3s ease transform, .3s ease opacity";
        });

        /* Clones */

        this.createClones();

        window.addEventListener("resize", () => {
            this.createClones();
            this.update()
        });
    }

    createClones() {
        this.tailClones.forEach(clone => {
            this.ui.track.removeChild(clone);
        })
        this.tailClones = [];

        this.startClones.forEach(clone => {
            this.ui.track.removeChild(clone);
        })
        this.startClones = [];
        // if(this.current === 0) {
            const tailClonesFragment = document.createDocumentFragment();
            [...this.slides].slice(-this.getConfig().show).map(slide => slide.cloneNode(true)).forEach(clone => {
                clone.classList.add("slide-clone");
                clone.style.flex = `0 0 ${100/this.getConfig().show}%`;
                tailClonesFragment.append(clone);
                this.tailClones = [...this.tailClones, clone];
            })
            this.ui.track.insertBefore(tailClonesFragment, this.slides[0]);
        // }

        // if(this.current === this.slides.length - this.getConfig().show) {
            const startClonesFragment = document.createDocumentFragment();
            [...this.slides].slice(0, this.getConfig().show).map(slide => slide.cloneNode(true)).forEach(clone => {
                clone.classList.add("slide-clone");
                clone.style.flex = `0 0 ${100/this.getConfig().show}%`;
                startClonesFragment.append(clone);
                this.startClones = [...this.startClones, clone];
            })
            this.ui.track.append(startClonesFragment);
        // }
    }

    update() {
        this.slides.forEach(slide => {
            slide.style.flex = `0 0 ${100/this.getConfig().show}%`;
        })
        this.ui.track.style.transform = `translate(-${(this.current + this.getConfig().show) * (100/this.getConfig().show)}%, 0)`;

        if(this.current < 0) {
            this.tailClones.forEach((clone) => {
                clone.classList.add('active');
            })
        } else {
            this.tailClones.forEach((clone) => {
                clone.classList.remove('active');
            })
        }

        if(this.current > this.slides.length - 1) {
            this.startClones.forEach((clone) => {
                clone.classList.add('active');
            })
        } else {
            this.startClones.forEach((clone) => {
                clone.classList.remove('active');
            })
        }

        this.slides.forEach((slide, index) => {
            if(index >= this.current && index < this.current + this.getConfig().show) {
                slide.classList.add('active')
            } else {
                slide.classList.remove('active')
            }
        })

        // Move to truthy slides from clones

        if(this.current < 0) {
            setTimeout(() => {
                this.disableAnimations();
                this.current = this.slides.length - this.getConfig().show;

                this.ui.track.style.transform = `translate(-${(this.current + this.getConfig().show) * (100/this.getConfig().show)}%, 0)`;

                this.slides.forEach((slide, index) => {
                    if(index >= this.current && index < this.current + this.getConfig().show) {
                        slide.classList.add('active')
                    } else {
                        slide.classList.remove('active')
                    }
                })
                setTimeout(() => {
                    this.enableAnimations();
                }, 100)
            }, 300)
        } 

        if(this.current > this.slides.length - this.getConfig().show) {
            setTimeout(() => {
                this.disableAnimations();
                this.current = 0;

                this.ui.track.style.transform = `translate(-${(this.current + this.getConfig().show) * (100/this.getConfig().show)}%, 0)`;

                this.slides.forEach((slide, index) => {
                    if(index >= this.current && index < this.current + this.getConfig().show) {
                        slide.classList.add('active')
                    } else {
                        slide.classList.remove('active')
                    }
                })
                setTimeout(() => {
                    this.enableAnimations();
                }, 100)
            }, 300)
        }
    }

    enableAnimations() {
        this.ui.track.style.transition = ".3s ease transform";

        this.slides.forEach(slide => {
            slide.style.transition = ".3s ease transform, .3s ease opacity";
        })
        this.startClones.forEach(clone => {
            clone.style.transition = ".3s ease transform, .3s ease opacity";
        })
        this.tailClones.forEach(clone => {
            clone.style.transition = ".3s ease transform, .3s ease opacity";
        })
    }

    disableAnimations() {
        this.ui.track.style.transition = null;
        this.slides.forEach(slide => {
            slide.style.transition = null;
        })
        this.startClones.forEach(clone => {
            clone.style.transition = null;
        })
        this.tailClones.forEach(clone => {
            clone.style.transition = null;
        })
    }

    addListeners() {
        this.ui.next.addEventListener("click", () => {
            if(this.current === this.slides.length - this.getConfig().show) {
                this.current = this.slides.length;
            } else {
                this.current = Math.min(this.current + this.getConfig().scroll, this.slides.length - this.getConfig().show);
            }
            this.update();
        })

        this.ui.prev.addEventListener("click", () => {
            if(this.current === 0 ) {
                this.current = -this.getConfig().show;
            } else {
                this.current = Math.max(this.current - this.getConfig().scroll, 0);
            }
            this.update();
        })
    }
}