const site = {
  name: "Alex Smith",
  role: "Architect",
  title: "Alex Smith — Architect Portfolio",
  description:
    "Alex Smith is an architect and interior designer creating elegant, functional and timeless residential and commercial spaces.",
  email: "alex@example.com",
  phone: "(880) 1000 000 000",
  address: "4140 Parker Rd. Allentown, New Mexico 31134",
  hero: {
    eyebrow: "I'm Alex Smith",
    title: "Building Elegant & Functional Spaces",
    text: "Architectural styles and trends evolve over time, influenced by culturalshifts, technological advancements, and changingsocietal needs.",
    image: "/images/hero-2-AsPce.png",
    person: "/images/hero-man-iN3UM.png",
  },
  innerHero: {
    image: "/images/inner-hero-Hyqz4.png",
    text: "I focus on creating functional, beautiful homes that seamlessly blend with your vision, ensuring every detail enhances both comfort and elegance.",
  },
  social: [
    { name: "Facebook", href: "https://facebook.com/", icon: "facebook" },
    { name: "X", href: "https://twitter.com/", icon: "x" },
    { name: "LinkedIn", href: "https://linkedin.com/", icon: "linkedin" },
    { name: "Instagram", href: "https://www.google.com/", icon: "instagram" },
  ],
};

const features = [
  {
    title: "Creative Ideas",
    text: "From boutiques to community spaces, everything I do is inspired by you.",
    icon: "/images/CreativeIdeas-bHrMg.svg",
  },
  {
    title: "Uniqueness",
    text: "You'll get a unique, custom design made just for you.",
    icon: "/images/Uniqueness-4r2sx.svg",
  },
  {
    title: "High Efficiency",
    text: "Your project will be highly effective with few revisions and on time.",
    icon: "/images/HighEfficiency-ch3my.svg",
  },
  {
    title: "Best Solution",
    text: "You'll get all the design solutions and top planning advice strategically.",
    icon: "/images/BestSolution-sMPi6.svg",
  },
];

const about = {
  title: "About My Studio",
  text: "My passionate architecture and interior design studio dedicated to crafting innovative residential and commercial spaces. With a focus on detail, sustainability, and modern aesthetics, we transform ideas into meaningful environments.",
  image: "/images/AboutMyStudio-OECfn.png",
  stats: [
    { value: "250K", label: "Home Services", href: "/services" },
    { value: "12M", label: "Customers", href: "/projects" },
    { value: "20+", label: "Years Experience", href: "/projects" },
  ],
};

const services = [
  {
    slug: "architecture-design-solutions",
    title: "Architecture & Design Solutions",
    image: "/images/PropertySalesMarketing-vCB3F.png",
    number: "/images/1-thHjN.svg",
    text: "My services are tailored to meet the diverse needs of clients across the real estate landscape. From strategic planning and design to execution and delivery, I bring deep expertise, industry insight, and a commitment to quality in every step of the process. Discover how we turn vision into value.",
  },
  {
    slug: "residential-commercial-leasing",
    title: "Residential & Commercial Leasing",
    image: "/images/ResidentialCommercialLeasing-NFe4E.png",
    number: "/images/2-p93zJ.svg",
    text: "My services are tailored to meet the diverse needs of clients across the real estate landscape. From strategic planning and design to execution and delivery, I bring deep expertise, industry insight, and a commitment to quality in every step of the process. Discover how we turn vision into value.",
  },
  {
    slug: "construction-management",
    title: "Construction Management",
    image: "/images/ConstructionManagement-YX8Zs.png",
    number: "/images/3-FdLyF.svg",
    text: "My services are tailored to meet the diverse needs of clients across the real estate landscape. From strategic planning and design to execution and delivery, I bring deep expertise, industry insight, and a commitment to quality in every step of the process. Discover how we turn vision into value.",
  },
  {
    slug: "building-management",
    title: "Building Management",
    image: "/images/BuildingManagement-cLxHX.png",
    number: "/images/4-U_bu8.svg",
    text: "My services are tailored to meet the diverse needs of clients across the real estate landscape. From strategic planning and design to execution and delivery, I bring deep expertise, industry insight, and a commitment to quality in every step of the process. Discover how we turn vision into value.",
  },
  {
    slug: "property-valuation-appraisal",
    title: "Property Valuation & Appraisal",
    image: "/images/PropertyValuationAppraisal-R20tS.png",
    number: "/images/5-Jd7LQ.svg",
    text: "My services are tailored to meet the diverse needs of clients across the real estate landscape. From strategic planning and design to execution and delivery, I bring deep expertise, industry insight, and a commitment to quality in every step of the process. Discover how we turn vision into value.",
  },
  {
    slug: "architecture-design",
    title: "Architecture & Design",
    image: "/images/ArchitectureDesign-ccLKS.png",
    number: "/images/6-l_-pe.svg",
    text: "My services are tailored to meet the diverse needs of clients across the real estate landscape. From strategic planning and design to execution and delivery, I bring deep expertise, industry insight, and a commitment to quality in every step of the process. Discover how we turn vision into value.",
  },
];

const projectIntro =
  "What sets us apart is our integrated approach—combining creativity, data-driven strategy, and hands-on execution. Whether you're launching a new residential project, investing in commercial spaces, or refining your property’s market presence, our team works closely with you to deliver results that are not only functional but future-focused.";

const lorem =
  "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.";

const projects = [
  {
    slug: "elmwood-grand-heights",
    legacySlug: "Elmwood-Grand-Heights",
    name: "Elmwood Grand Heights",
    image: "/images/ElmwoodGrandHeights-3C1Ms.png",
    excerpt:
      "Building a real estate development is a complicated task requiring both deep understanding…",
    status: "Jan 4, 2026",
    price: "$500 - $1.5M",
    intro: projectIntro,
    description: [lorem, lorem, lorem, lorem],
  },
  {
    slug: "riverstone-edge-residences",
    legacySlug: "Riverstone-Edge-Residences",
    name: "Riverstone Edge Residences",
    image: "/images/RiverstoneEdgeResidences-O89Y5.png",
    excerpt:
      "Building a real estate development is a complicated task requiring both deep understanding…",
    status: "Jan 4, 2026",
    price: "$500 - $1.5M",
    intro: projectIntro,
    description: [lorem, lorem, lorem, lorem],
  },
  {
    slug: "willow-park-residences",
    legacySlug: "Willow-Park-Residences",
    name: "Willow Park Residences",
    image: "/images/WillowParkResidences-tGxJq.png",
    excerpt:
      "Building a real estate development is a complicated task requiring both deep understanding…",
    status: "Jan 4, 2026",
    price: "$500 - $1.5M",
    intro: projectIntro,
    description: [lorem, lorem, lorem, lorem],
  },
  {
    slug: "celestia-grand-residences",
    legacySlug: "Celestia-Grand-Residences",
    name: "Celestia Grand Residences",
    image: "/images/CelestiaGrandResidences-OjYSu.png",
    excerpt:
      "Building a real estate development is a complicated task requiring both deep understanding…",
    status: "Jan 4, 2026",
    price: "$500 - $1.5M",
    intro: projectIntro,
    description: [lorem, lorem, lorem, lorem],
  },
  {
    slug: "the-arborea-collection",
    legacySlug: "The-Arborea-Collection",
    name: "The Arboréa Collection",
    image: "/images/TheArboraCollection-Vz01g.png",
    excerpt:
      "Building a real estate development is a complicated task requiring both deep understanding…",
    status: "Jan 4, 2026",
    price: "$500 - $1.5M",
    intro: projectIntro,
    description: [lorem, lorem, lorem, lorem],
  },
  {
    slug: "the-havenstone-residences",
    legacySlug: "The-Havenstone-Residences",
    name: "The Havenstone Residences",
    image: "/images/TheHavenstoneResidences-oTFbQ.png",
    excerpt:
      "Building a real estate development is a complicated task requiring both deep understanding…",
    status: "Jan 4, 2026",
    price: "$500 - $1.5M",
    intro: projectIntro,
    description: [lorem, lorem, lorem, lorem],
  },
];

const process = [
  {
    number: "01",
    title: "Thoughtful Design",
    text: "Your vision guides us—from first meeting to final delivery, we ensure clear, transparent, and thoughtful service.",
  },
  {
    number: "02",
    title: "Client-Focused",
    text: "Your vision guides us—from first meeting to final delivery, we ensure clear, transparent, and thoughtful service.",
  },
  {
    number: "03",
    title: "Sustainable Development",
    text: "Your vision guides us—from first meeting to final delivery, we ensure clear, transparent, and thoughtful service.",
  },
];

const testimonials = [
  {
    quote:
      "“Lorem ipsum dolor sit amet consectetur. Venenatis arcu viverra elit vel elementum etiam.Lorem ipsum dolor sit amet consectetur.",
    name: "Gwen Waelchi",
    avatar: "/images/GwenWaelchi-K8l9s.png",
  },
  {
    quote:
      "“Lorem ipsum dolor sit amet consectetur. Venenatis arcu viverra elit vel elementum etiam.Lorem ipsum dolor sit amet consectetur.",
    name: "Denise Ward",
    avatar: "/images/DeniseWard-YRkXn.png",
  },
  {
    quote:
      "“Lorem ipsum dolor sit amet consectetur. Venenatis arcu viverra elit vel elementum etiam.Lorem ipsum dolor sit amet consectetur.",
    name: "Natalie Stark",
    avatar: "/images/NatalieStark-2UUmj.png",
  },
];

const awards = [
  {
    number: "01",
    title: "Design Excellence Award",
    year: "2021",
    image: "/images/AwardsandIndustryHonors-O0idy.png",
  },
  {
    number: "02",
    title: "Architectural Innovation Prize",
    year: "2022",
    image: "/images/AwardsandIndustryHonors2-WzFhw.png",
  },
  {
    number: "03",
    title: "Creative Space Award",
    year: "2023",
    image: "/images/AwardsandIndustryHonors3-BLRdv.png",
  },
];

const loremParagraphs = [lorem, lorem, lorem, lorem];

const posts = [
  {
    slug: "understanding-property-taxes-before-you-buy",
    legacySlug: "Understanding-Property-Taxes-Before-You-Buy",
    title: "Understanding Property Taxes Before You Buy",
    image: "/images/UnderstandingPropertyTaxesBeforeYouBuy-6l79h.png",
    date: "June 4, 2026",
    published: "8 June 2026",
    author: "Craft Theme",
    excerpt:
      "Building a real estate development is a complicated task requiring both deep understanding…",
    intro: loremParagraphs,
    description: loremParagraphs,
    quote: lorem,
    quoteAuthor: "Jhon Doe",
  },
  {
    slug: "essential-steps-before-buying-your-first-property",
    legacySlug: "Essential-Steps-Before-Buying-Your-First-Property",
    title: "Essential Steps Before Buying Your First Property",
    image: "/images/EssentialStepsBeforeBuyingYourFirstProperty-_rmtU.png",
    date: "June 4, 2026",
    published: "8 June 2026",
    author: "Craft Theme",
    excerpt:
      "Building a real estate development is a complicated task requiring both deep understanding…",
    intro: loremParagraphs,
    description: loremParagraphs,
    quote: lorem,
    quoteAuthor: "Jhon Doe",
  },
  {
    slug: "how-to-choose-the-right-location-for-your-home",
    legacySlug: "How-to-Choose-the-Right-Location-for-Your-Home",
    title: "How to Choose the Right Location for Your Home",
    image: "/images/HowtoChoosetheRightLocationforYourHome-_78xY.png",
    date: "June 4, 2026",
    published: "8 June 2026",
    author: "Craft Theme",
    excerpt:
      "Building a real estate development is a complicated task requiring both deep understanding…",
    intro: loremParagraphs,
    description: loremParagraphs,
    quote: lorem,
    quoteAuthor: "Jhon Doe",
  },
  {
    slug: "top-mistakes-to-avoid-when-selling-your-home",
    legacySlug: "Top-Mistakes-to-Avoid-When-Selling-Your-Home",
    title: "Top Mistakes to Avoid When Selling Your Home",
    image: "/images/TopMistakestoAvoidWhenSellingYourHome-tR_RM.png",
    date: "June 4, 2026",
    published: "8 June 2026",
    author: "Craft Theme",
    excerpt:
      "Building a real estate development is a complicated task requiring both deep understanding…",
    intro: loremParagraphs,
    description: loremParagraphs,
    quote: lorem,
    quoteAuthor: "Jhon Doe",
  },
];

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Projects", href: "/projects" },
  { label: "Blog", href: "/blog" },
  { label: "Contact Me", href: "/contact" },
];

const serviceLinks = [
  "Residential Design",
  "Co. Architecture",
  "Interior Design",
  "Renovation",
  "3D Visualization",
];

module.exports = {
  site,
  navLinks,
  features,
  about,
  services,
  projects,
  process,
  testimonials,
  awards,
  posts,
  serviceLinks,
};
