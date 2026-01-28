import { Mastra } from '@mastra/core/mastra';
import { photographyBIAgent } from './agents/photography-bi-agent';

export const mastra = new Mastra({
  agents: { photographyBIAgent },
});
