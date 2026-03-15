module.exports = {
  siteTitle: 'Yeshwanth Toluva',
  siteDescription:
    'Yeshwanth Toluva is an AI + DevOps Engineer with hands-on experience in Kubernetes, Docker, Terraform, CI/CD, and cloud infrastructure.',
  siteKeywords:
    'Yeshwanth Toluva, DevOps Engineer, AI Engineer, AWS, Kubernetes, Docker, Terraform, CI/CD, Cloud, Linux, Arch Linux, Python, Hyderabad',
  siteUrl: 'https://yeshwanthtoluva.vercel.app/',
  siteLanguage: 'en_US',
  googleAnalyticsID: 'UA-45666519-2',
  googleVerification: 'DCl7VAf9tcz6eD9gb67NfkNnJ1PKRNcg8qQiwpbx9Lk',
  name: 'Yeshwanth Toluva',
  location: 'Hyderabad, India',
  email: 'yeshwanthtoluva@gmail.com',
  github: 'https://github.com/YeshwanthToluva',
  twitterHandle: '@',
  socialMedia: [
    {
      name: 'GitHub',
      url: 'https://github.com/YeshwanthToluva',
    },
    {
      name: 'Linkedin',
      url: 'https://www.linkedin.com/in/yeshwanth-toluva-6b0335242/',
    },
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/yeshwanth_toluva/',
    },
  ],

  navLinks: [
    {
      name: 'About',
      url: '/#about',
    },
    {
      name: 'Experience',
      url: '/#jobs',
    },
    {
      name: 'Projects',
      url: '/#projects',
    },
    {
      name: 'Certifications',
      url: '/#certifications',
    },
    {
      name: 'Contact',
      url: '/#contact',
    },
  ],

  navHeight: 100,

  colors: {
    green: '#ffd700',
    navy: '#0a0a0a',
    darkNavy: '#000000',
  },

  srConfig: (delay = 200) => ({
    origin: 'bottom',
    distance: '20px',
    duration: 500,
    delay,
    rotate: { x: 0, y: 0, z: 0 },
    opacity: 0,
    scale: 1,
    easing: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
    mobile: true,
    reset: false,
    useDelay: 'always',
    viewFactor: 0.25,
    viewOffset: { top: 0, right: 0, bottom: 0, left: 0 },
  }),
};
