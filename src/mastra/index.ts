import { Mastra } from '@mastra/core/mastra';
import { photographyBIAgent } from './agents/photography-bi-agent';
import { yearEndReviewWorkflow } from './workflows/year-end-review-workflow';

export const mastra = new Mastra({
  agents: { photographyBIAgent },
  workflows: { yearEndReviewWorkflow },
});
