/* Fairy Dust by Tim Holman: https://github.com/tholman/cursor-effects */
function fairyDustCursor(options) {
    let possibleColors = (options && options.colors) || [
      "#9400D3",
      "#00FFFF",
      "#0000FF",
      "#00FF00",
      "#FFFF00",
      "#FF7F00",
      "#FF0000"
    ]
    
    let hasWrapperEl = options && options.element
    let element = hasWrapperEl || document.body
  
    let width = window.innerWidth
    let height = window.innerHeight
    const cursor = { x: width / 2, y: width / 2 }
    const lastPos = { x: width / 2, y: width / 2 }
    const particles = []
    const canvImages = []
    let canvas, context
  
    const char = "+"
  
    function init() {
      canvas = document.createElement("canvas")
      context = canvas.getContext("2d")
      canvas.style.top = "0px"
      canvas.style.left = "0px"
      canvas.style.pointerEvents = "none"
  
      if (hasWrapperEl) {
        canvas.style.position = "absolute"
        element.appendChild(canvas)
        canvas.width = element.clientWidth
        canvas.height = element.clientHeight
      } else {
        canvas.style.position = "fixed"
        element.appendChild(canvas)
        canvas.width = width
        canvas.height = height
      }
  
      context.font = "14px serif"
      context.textBaseline = "middle"
      context.textAlign = "center"
  
      possibleColors.forEach((color) => {
        let measurements = context.measureText(char)
        let bgCanvas = document.createElement("canvas")
        let bgContext = bgCanvas.getContext("2d")
  
        bgCanvas.width = measurements.width
        bgCanvas.height =
          measurements.actualBoundingBoxAscent +
          measurements.actualBoundingBoxDescent
  
        bgContext.fillStyle = color
        bgContext.textAlign = "center"
        bgContext.font = "14px serif"
        bgContext.textBaseline = "middle"
        bgContext.fillText(
          char,
          bgCanvas.width / 2,
          measurements.actualBoundingBoxAscent
        )
  
        canvImages.push(bgCanvas)
      })
  
      bindEvents()
      loop()
    }
  
    // Bind events that are needed
    function bindEvents() {
      element.addEventListener("mousemove", onMouseMove)
      element.addEventListener("touchmove", onTouchMove, { passive: true })
      element.addEventListener("touchstart", onTouchMove, { passive: true })
      window.addEventListener("resize", onWindowResize)
    }
  
    function onWindowResize(e) {
      width = window.innerWidth
      height = window.innerHeight
  
      if (hasWrapperEl) {
        canvas.width = element.clientWidth
        canvas.height = element.clientHeight
      } else {
        canvas.width = width
        canvas.height = height
      }
    }
  
    function onTouchMove(e) {
      if (e.touches.length > 0) {
        for (let i = 0; i < e.touches.length; i++) {
          addParticle(
            e.touches[i].clientX,
            e.touches[i].clientY,
            canvImages[Math.floor(Math.random() * canvImages.length)]
          )
        }
      }
    }
  
    function onMouseMove(e) {
      window.requestAnimationFrame(() => {
        if (hasWrapperEl) {
          const boundingRect = element.getBoundingClientRect()
          cursor.x = e.clientX - boundingRect.left
          cursor.y = e.clientY - boundingRect.top
        } else {
          cursor.x = e.clientX
          cursor.y = e.clientY
        }
  
        const distBetweenPoints = Math.hypot(
          cursor.x - lastPos.x,
          cursor.y - lastPos.y
        )
  
        if (distBetweenPoints > 1.5) {
          addParticle(
            cursor.x,
            cursor.y,
            canvImages[Math.floor(Math.random() * possibleColors.length)]
          )
  
          lastPos.x = cursor.x
          lastPos.y = cursor.y
        }
      })
    }
  
    function addParticle(x, y, color) {
      particles.push(new Particle(x, y, color))
    }
  
    function updateParticles() {
      context.clearRect(0, 0, width, height)
  
      // Update
      for (let i = 0; i < particles.length; i++) {
        particles[i].update(context)
      }
  
      // Remove dead particles
      for (let i = particles.length - 1; i >= 0; i--) {
        if (particles[i].lifeSpan < 0) {
          particles.splice(i, 1)
        }
      }
    }
  
    function loop() {
      updateParticles()
      requestAnimationFrame(loop)
    }
  
    function Particle(x, y, canvasItem) {
      const lifeSpan = Math.floor(Math.random() * 30 + 60)
      this.initialLifeSpan = lifeSpan //
      this.lifeSpan = lifeSpan //ms
      this.velocity = {
        x: (Math.random() < 0.5 ? -1 : 1) * (Math.random() / 2),
        y: Math.random() * 0.7 + 0.9,
      }
      this.position = { x: x, y: y }
      this.canv = canvasItem
  
      this.update = function(context) {
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        this.lifeSpan--
  
        this.velocity.y += 0.005
  
        const scale = Math.max(this.lifeSpan / this.initialLifeSpan, 0)
  
        context.drawImage(
          this.canv,
          this.position.x - (this.canv.width / 2) * scale,
          this.position.y - this.canv.height / 2,
          this.canv.width * scale,
          this.canv.height * scale
        )
      }
    }
  
    init()
  }

  new fairyDustCursor();
/* End of FairyDust */


/* Barba transition */
function init() {
    const loader = document.querySelector('.loader');

    // Initialize loader screen
    gsap.set(loader, {
        scaleY: 0,
        transformOrigin: 'bottom center',
        autoAlpha: 1
    });

    function loaderIn() {
        // GSAP tween to stretch the loading screen across the whole screen
        return gsap.fromTo(loader,
            {
                scaleY: 0,
            },
            {
                duration: 1.2,
                scaleY: 1,
                ease: 'Expo.easeInOut',
                transformOrigin: 'bottom center'
            });
    }

    function loaderAway() {
        // GSAP tween to hide the loading screen
        return gsap.to(loader, {
            duration: 1.5,
            scaleY: 0,
            ease: 'Expo.easeInOut',
            transformOrigin: 'top center'
        });
    }

    // Scroll to top of page
    barba.hooks.beforeEnter(() => {
        window.scrollTo(0, 0);
    });

    // Run transition
    barba.init({
        /* debug: true, */
        transitions: [{
            async leave() {
                await loaderIn();
            },
            enter() {
                loaderAway();
            }
        }]
    })

}

// Run Barba
window.addEventListener('load', function () {
    console.log('loaded');
    init();
});
/* End of Barba transition */

/* Timed fade-in */
function fade() {
    $('.timed-fadein').hide().delay(1200).fadeIn(1000);
}

function fade2() {
    $('.about-fadein').hide().delay(1500).fadeIn(1000);
}

$(document).ready(function () {
    fade();
    fade2();
})
/* End of timed fade-in */

/* Navigation bar placement detection */
$(document).ready(function () {
    var scroll_pos = 0;
    $(document).scroll(function () {
        scroll_pos = $(this).scrollTop();
        if (scroll_pos <= 270 && document.getElementById("light-bg") !== null) {
            $(".portfolio-piece .nav-link").css('color', '#5c5c5c');
            $(".portfolio-piece #nav-ul").css({
                'background-color': 'transparent',
                'border-bottom': 'none'
            });
        } else if (scroll_pos <= 270 && document.getElementById("light-bg") == null) {
            $(".portfolio-piece .nav-link").css('color', 'white');
            $(".portfolio-piece #nav-ul").css({
                'background-color': 'transparent',
                'border-bottom': 'none'
            });
        } else {
            $(".portfolio-piece .nav-link").css('color', '#5c5c5c');
            $(".portfolio-piece #nav-ul").css({
                'background-color': 'white',
                'border-bottom': '1px #ebebeb solid'
            });
        }
    });
});
/* End of navbar placement detect */

/* Fade-in on scroll: https://codepen.io/annalarson/pen/GesqK */
$(document).ready(function () {
    $(window).scroll(function () {
        $('.fadein').each(function (i) {

            var bottom_of_object = $(this).position().top + $(this).outerHeight();
            var bottom_of_window = $(window).scrollTop() + $(window).height();

            if (bottom_of_window > bottom_of_object) {
                $(this).animate({ 'opacity': '1' }, 800);
            }
        });
    });
});
/* End of fade-in on scroll */