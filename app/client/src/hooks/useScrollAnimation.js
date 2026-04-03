import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const animations = {
  fadeUp: (element, options) => {
    gsap.fromTo(
      element,
      { opacity: 0, y: 60 },
      {
        opacity: 1,
        y: 0,
        duration: options.duration || 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: element,
          start: options.start || 'top 85%',
          end: options.end || 'bottom 20%',
          toggleActions: 'play none none none',
          ...options.scrollTrigger,
        },
      }
    );
  },

  fadeIn: (element, options) => {
    gsap.fromTo(
      element,
      { opacity: 0 },
      {
        opacity: 1,
        duration: options.duration || 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: element,
          start: options.start || 'top 85%',
          toggleActions: 'play none none none',
          ...options.scrollTrigger,
        },
      }
    );
  },

  stagger: (element, options) => {
    const children = element.querySelectorAll(options.target || ':scope > *');
    gsap.fromTo(
      children,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: options.duration || 0.6,
        stagger: options.stagger || 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: element,
          start: options.start || 'top 85%',
          toggleActions: 'play none none none',
          ...options.scrollTrigger,
        },
      }
    );
  },
};

export default function useScrollAnimation(type = 'fadeUp', options = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const animateFn = animations[type];
    if (animateFn) {
      animateFn(element, options);
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.trigger === element) {
          trigger.kill();
        }
      });
    };
  }, [type]);

  return ref;
}
