import { About, Blog, Gallery, Home, Newsletter, Person, Social, Work } from "@/types";
import { Line, Row, Text } from "@once-ui-system/core";

const person: Person = {
  firstName: "GixMix",
  lastName: "",
  name: "GixMix Tools",
  role: "Free Online Tools",
  avatar: "/images/avatar.jpg",
  email: "hello@gixmix.com",
  location: "America/New_York",
  languages: [],
};

const newsletter: Newsletter = {
  display: false,
  title: <>Subscribe to GixMix Newsletter</>,
  description: <>Get new tools and updates delivered to your inbox</>,
};

const social: Social = [
  {
    name: "GitHub",
    icon: "github",
    link: "https://github.com",
    essential: true,
  },
  {
    name: "Email",
    icon: "email",
    link: `mailto:${person.email}`,
    essential: true,
  },
];

const home: Home = {
  path: "/",
  image: "/images/og/home.jpg",
  label: "Home",
  title: "GixMix - Free Online Tools",
  description: "Free online tools including calculator, YouTube converter, QR code generator, and more. All tools are free to use.",
  headline: <>Free online tools for everyone</>,
  featured: {
    display: false,
    title: "",
    href: "/",
  },
  subline: (
    <>
    A collection of free, fast, and easy-to-use online tools.<br /> No sign-ups, no ads, just tools that work.
    </>
  ),
};

const about: About = {
  path: "/about",
  label: "About",
  title: "About – GixMix Tools",
  description: "About GixMix - free online tools for everyone",
  tableOfContent: {
    display: true,
    subItems: false,
  },
  avatar: {
    display: false,
  },
  calendar: {
    display: false,
    link: "",
  },
  intro: {
    display: true,
    title: "About GixMix",
    description: (
      <>
        GixMix is a collection of free online tools designed to help you get things done quickly.
        From calculators to converters, we provide simple, fast, and reliable tools - all completely free to use.
      </>
    ),
  },
  work: {
    display: false,
    title: "",
    experiences: [],
  },
  studies: {
    display: false,
    title: "",
    institutions: [],
  },
  technical: {
    display: false,
    title: "",
    skills: [],
  },
};

const blog: Blog = {
  path: "/blog",
  label: "Blog",
  title: "GixMix Blog - Tool Guides & Updates",
  description: "Guides, tips, and updates for GixMix tools",
};

const work: Work = {
  path: "/work",
  label: "Tools",
  title: "All Tools – GixMix",
  description: "Browse all free online tools from GixMix",
};

const gallery: Gallery = {
  path: "/gallery",
  label: "Gallery",
  title: "Gallery – GixMix",
  description: "Screenshots and previews of GixMix tools",
  images: [],
};

export { person, social, newsletter, home, about, blog, work, gallery };
