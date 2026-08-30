import { portfolio as content } from './content';

export const portfolio = {
  ...content,
  personal: {
    ...content.personal,
    resume: '/Shivam-Singh-Resume.html',
  },
};

export type Portfolio = typeof portfolio;
