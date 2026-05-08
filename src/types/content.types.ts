import { IconName } from "@/resources/icons";
import { zones } from "tzdata";

export type IANATimeZone = Extract<keyof typeof zones, string>;

export type Person = {
  firstName: string;
  lastName: string;
  name: string;
  role: string;
  avatar: string;
  email: string;
  location: IANATimeZone;
  languages?: string[];
};

export type Newsletter = {
  display: boolean;
  title: React.ReactNode;
  description: React.ReactNode;
};

export type Social = Array<{
  name: string;
  icon: IconName;
  link: string;
  essential?: boolean;
}>;

export interface BasePageConfig {
  path: `/${string}` | string;
  label: string;
  title: string;
  description: string;
  image?: `/images/${string}` | string;
}

export interface Home extends BasePageConfig {
  image: `/images/${string}` | string;
  headline: React.ReactNode;
  featured: {
    display: boolean;
    title: React.ReactNode;
    href: string;
  };
  subline: React.ReactNode;
}

export interface About extends BasePageConfig {
  tableOfContent: {
    display: boolean;
    subItems: boolean;
  };
  avatar: {
    display: boolean;
  };
  calendar: {
    display: boolean;
    link: string;
  };
  intro: {
    display: boolean;
    title: string;
    description: React.ReactNode;
  };
  work: {
    display: boolean;
    title: string;
    experiences: Array<{
      company: string;
      timeframe: string;
      role: string;
      achievements: React.ReactNode[];
      images?: Array<{
        src: string;
        alt: string;
        width: number;
        height: number;
      }>;
    }>;
  };
  studies: {
    display: boolean;
    title: string;
    institutions: Array<{
      name: string;
      description: React.ReactNode;
    }>;
  };
  technical: {
    display: boolean;
    title: string;
    skills: Array<{
      title: string;
      description?: React.ReactNode;
      tags?: Array<{
        name: string;
        icon?: string;
      }>;
      images?: Array<{
        src: string;
        alt: string;
        width: number;
        height: number;
      }>;
    }>;
  };
}

export interface Blog extends BasePageConfig {}

export interface Work extends BasePageConfig {}

export interface Gallery extends BasePageConfig {
  images: Array<{
    src: string;
    alt: string;
    orientation: string;
  }>;
}

export type ToolCategory = "calculators" | "converters" | "generators" | "text" | "security" | "developer" | "fun" | "utilities";

export type Tool = {
  slug: string;
  name: string;
  description: string;
  icon: IconName;
  category: ToolCategory;
  featured?: boolean;
};

export type ToolsData = {
  title: string;
  description: string;
  tools: Tool[];
};
