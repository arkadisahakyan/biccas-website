gsap.registerPlugin(MotionPathPlugin);
gsap.registerPlugin(DrawSVGPlugin);
gsap.registerPlugin(SplitText);
gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", (event) => {
  startHeroSectionAnimation();
  initializeHeroSectionAnimations();
  initializeRatingsSectionAnimations();
  initializeFeaturesSectionAnimations();
  initializeBenefitsSectionAnimations();
});

function startHeroSectionAnimation() {
  const heroTimeline = gsap.timeline();

  // animate the logo
  const logo = document.querySelector(".hero-section__logo");
  const logoChars = SplitText.create(logo, {
    type: "chars",
    autoSplit: true,
    onSplit: (self) => {
      return heroTimeline.from(self.chars, {
        duration: 0.5,
        x: logo.clientWidth,
        opacity: 0,
        stagger: 0.15,
        ease: "power1.in",
      });
    },
  });

  // animate the curved line
  heroTimeline.fromTo(
    ".curved-line path",
    { drawSVG: "0" },
    {
      duration: 0.8,
      drawSVG: "100%",
      ease: "power2.inOut",
      delay: 0.3,
    },
  );

  // animate the try for free button
  heroTimeline.to(".try-for-free", {
    scale: 1.1,
    duration: 0.2,
    delay: 0.3,
    repeat: 1,
    yoyo: true,
    ease: "power1.out",
  });
}

function initializeAnimatedHamburgerMenu() {
  const toggleButton = document.querySelector(".hero-section__menu-toggle svg");
  const hamburgerButton = new HamburgerButton(toggleButton);
  const buttonAnimator = new HamburgerButtonAnimator(hamburgerButton);

  const hamburgerMenu = new HamburgerMenu(
    document.querySelector(".hero-section__menu"),
    document.querySelector(".hero-section__nav"),
    hamburgerButton,
  );
  const menuAnimator = new HamburgerMenuAnimator(hamburgerMenu);

  toggleButton.addEventListener("click", (event) => {
    hamburgerButton.isOpen = !hamburgerButton.isOpen;
    buttonAnimator.animateButtonToggle();
    menuAnimator.animateHamburgerMenu();
  });

  window.addEventListener("resize", () => {
    menuAnimator.clearProps();
  });
}

function initializeAnimatedMarqueeBlock() {
  const marqueeBlock = new MarqueeBlock(
    document.querySelector(".hero-section__partners"),
  );
  const marqueeAnimator = new MarqueeBlockAnimator(marqueeBlock);
  marqueeAnimator.animateMarqueeBlock();
}

function initializeHeroSectionAnimations() {
  initializeAnimatedHamburgerMenu();
  initializeAnimatedMarqueeBlock();
}

function initializeRatingsSectionAnimations() {
  createRevealOnScrollAnimation(
    [".ratings-section__title", ".ratings-section__subtext"],
    ".ratings-section__title",
  );

  const features = document.querySelectorAll(".ratings-section__feature");
  features.forEach((feature) => {
    createRevealOnScrollAnimation(feature, feature);
  });

  const ratingsBlocks = document.querySelectorAll(
    ".ratings-section__rating-block",
  );
  ratingsBlocks.forEach((ratingsInstance) => {
    const ratingsBlock = new RatingsBlock(ratingsInstance);
    ratingsBlock.stars.forEach((star, index) => {
      if (star.classList.contains("ratings-section__star--inactive")) return;
      gsap.to(star, {
        duration: 0.2,
        scrollTrigger: {
          trigger: ratingsBlock.ratingsInstance,
          start: "bottom bottom",
          toggleActions: "play none none reset",
        },
        scale: 1.4,
        yoyo: true,
        repeat: 1,
        delay: index * 0.2,
      });
    });
  });
}

function initializeFeaturesSectionAnimations() {
  const featuresHeader = document.querySelector(".features-section__header");
  createRevealOnScrollAnimation(featuresHeader, featuresHeader);

  // animate the features
  const features = document.querySelectorAll(".features-section__feature");
  features.forEach((feature) => {
    gsap.from(feature, {
      duration: 0.8,
      scrollTrigger: {
        trigger: feature,
        start: "30% bottom",
        toggleActions: "play none none reverse",
      },
      x: feature.parentElement.clientWidth,
      opacity: 0,
      ease: "back.out(0.5)",
    });
  });
}

function initializeBenefitsSectionAnimations() {
  const title = document.querySelector(".benefits-section__benefits-block h2");
  const benefits = document.querySelectorAll(
    ".benefits-section__benefits-block ul > li",
  );

  createRevealOnScrollAnimation(title, title);
  benefits.forEach((benefitItem) => {
    createRevealOnScrollAnimation(benefitItem, benefitItem);
  });
}

function createRevealOnScrollAnimation(objects, trigger) {
  gsap.from(objects, {
    duration: 0.8,
    scrollTrigger: {
      trigger: trigger,
      start: "top bottom",
      toggleActions: "play none none reverse",
    },
    y: 50,
    opacity: 0,
    ease: "power1.inOut",
  });
}

class RatingsBlock {
  constructor(ratingsInstance) {
    this.ratingsInstance = ratingsInstance;
    this.stars = this.ratingsInstance.querySelectorAll(
      ".ratings-section__star",
    );
  }
}

class MarqueeBlock {
  constructor(marqueeInstance) {
    this.marqueeInstance = marqueeInstance;
    this.marqueeOriginalPart = marqueeInstance.children[0];
    this.marqueeClonedPart = this.marqueeOriginalPart.cloneNode(true);
  }
}

class MarqueeBlockAnimator {
  constructor(marqueeBlock) {
    this.marqueeBlock = marqueeBlock;
    this.marqueeBlock.marqueeInstance.appendChild(
      this.marqueeBlock.marqueeClonedPart,
    );
  }

  animateMarqueeBlock() {
    gsap.to(
      [
        this.marqueeBlock.marqueeOriginalPart,
        this.marqueeBlock.marqueeClonedPart,
      ],
      {
        duration: 15,
        xPercent: -100,
        repeat: -1,
        ease: "none",
      },
    );
  }
}

class HamburgerButton {
  constructor(buttonInstance) {
    this.buttonInstance = buttonInstance;
    this.topLine = buttonInstance.children[0];
    this.middleLine = buttonInstance.children[1];
    this.bottomLine = buttonInstance.children[2];
    this.isOpen = false;
  }
}

class HamburgerButtonAnimator {
  static yOffset = 5;
  static buttonToggleDuration = 0.2;

  constructor(hamburgerButton) {
    this.hamburgerButton = hamburgerButton;
  }

  animateButtonToggle() {
    gsap.to(this.hamburgerButton.topLine, {
      duration: HamburgerButtonAnimator.buttonToggleDuration,
      y: this.hamburgerButton.isOpen ? HamburgerButtonAnimator.yOffset : 0,
      rotation: this.hamburgerButton.isOpen ? 45 : 0,
      transformOrigin: "center",
    });
    gsap.to(
      this.hamburgerButton.middleLine,
      {
        duration: HamburgerButtonAnimator.buttonToggleDuration,
        opacity: this.hamburgerButton.isOpen ? 0 : 1,
      },
      "<",
    );
    gsap.to(
      this.hamburgerButton.bottomLine,
      {
        duration: HamburgerButtonAnimator.buttonToggleDuration,
        y: this.hamburgerButton.isOpen ? -HamburgerButtonAnimator.yOffset : 0,
        rotation: this.hamburgerButton.isOpen ? -45 : 0,
        transformOrigin: "center",
      },
      "<",
    );
  }
}

class HamburgerMenu {
  constructor(menuInstance, navBar, hamburgerButton) {
    this.menuInstance = menuInstance;
    this.navBar = navBar;
    this.hamburgerButton = hamburgerButton;
  }
}

class HamburgerMenuAnimator {
  constructor(hamburgerMenu) {
    this.hamburgerMenu = hamburgerMenu;
  }

  animateHamburgerMenu() {
    if (this.hamburgerMenu.hamburgerButton.isOpen) {
      gsap.to(this.hamburgerMenu.menuInstance, {
        duration: 0.3,
        yPercent: 150,
        ease: "expo.out",
      });
      gsap.from(this.hamburgerMenu.navBar, {
        duration: 0.3,
        y: -50,
        ease: "power1.inOut",
      });
    } else {
      gsap.to(this.hamburgerMenu.menuInstance, {
        duration: 0.3,
        yPercent: -150,
        ease: "expo.in",
      });
    }
  }

  clearProps() {
    gsap.set(
      [
        this.hamburgerMenu.menuInstance,
        this.hamburgerMenu.hamburgerButton.buttonInstance,
      ],
      { clearProps: "all" },
    );
  }
}
