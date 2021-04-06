export enum AppView {
  main = 'main',
  search = 'search',
  searchJobs = 'searchJobs',
  addLead = 'addLead',
  addContact = 'addContact',
  searchResult = 'searchResult',
  searchJobsResult = 'searchJobsResult',
};
export type AppViewLiteral = keyof typeof AppView;
