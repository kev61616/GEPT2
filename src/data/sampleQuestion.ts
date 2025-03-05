import { Question } from '@/types/quiz';

export const sampleQuestion: Question = {
  id: '1',
  text: `In a study of urban physical expansion, Richa Mahtta et al. conducted a meta-analysis of more than 300 cities worldwide to determine whether urban land expansion (ULE) was more strongly influenced by urban population growth or by growth in gross domestic product (GDP) per capita, a measure of economic activity. Because efficient national government is necessary to provide urban services and infrastructure that attract economic investment, Mahtta et al. propose that absent other factors, the importance of GDP per capita growth to ULE would likely increase relative to the importance of population growth as governments become more efficient. If true, this suggests the possibility that _______`,
  choices: [
    {
      id: 'a',
      text: 'national governments of countries in Region 1 experienced declines in efficiency in the period from 2000 to 2014, relative to the period from 1970 to 2000.'
    },
    {
      id: 'b',
      text: 'countries in Region 1 experienced a slower rate of economic growth in the period from 2000 to 2014 than countries in Region 2 did, despite increasing national government efficiency in Region 1.'
    },
    {
      id: 'c',
      text: 'national governments of most countries in Region 2 became more efficient in the period from 2000 to 2014 than they had been in the period from 1970 to 2000, but those of several countries in this region did not.'
    },
    {
      id: 'd',
      text: 'national governments of countries in Region 1 and in Region 2 generally became more efficient in the period from 2000 to 2014 than they had been in the period from 1970 to 2000, but at different rates.'
    }
  ]
};
