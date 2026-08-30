import { portfolio as content } from './content';

const githubPagesBasePath = '/portfolio';

export const portfolio = {
  ...content,
  personal: {
    ...content.personal,
    resume: `${githubPagesBasePath}/Shivam-Singh-Resume.pdf`,
  },
};

export type Portfolio = typeof portfolio;
