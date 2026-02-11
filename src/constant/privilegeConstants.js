// privilegeConstants.js

export const OPERATIONS = Object.freeze({
  VIEW: 'view',
  ADD: 'add',
  EDIT: 'edit',
  DELETE: 'delete',
  PUBLISH: 'publish'
});

export const RESOURCES = Object.freeze({
  PROFESSION: 'profession',
  LANGUAGE: 'language',
  TRIVIA_TYPE: 'triviaType',
  SOCIAL_LINK: 'socialLink',
  GENRE: 'genre',
  CELEBRITY: 'celebrity',
  SECTION_TYPE: 'sectionType',
  SECTION_TEMPLATE: 'sectionTemplate',
  ROLE_MANAGEMENT: 'roleManagement',
  USER_MANAGEMENT: 'userManagement',
});

export const PRIVILEGE_RESOURCES = Object.freeze({
  
  CELEBRITY_BASIC_INFO: 'celebrity.basic',
  CELEBRITY_PROFESSION_SECTIONS: 'celebrity.professionSection',
  CELEBRITY_DYNAMIC_SECTIONS: 'celebrity.dynamicSection',
  CELEBRITY_CUSTOM_SECTIONS: 'celebrity.customSection',
  CELEBRITY_TIMELINE: 'celebrity.timeline',
  CELEBRITY_TRIVIA: 'celebrity.trivia',
  CELEBRITY_RELATED_PERSONALITIES: 'celebrity.relation',
  CELEBRITY_REFERENCES: 'celebrity.reference',

  LANGUAGE: 'language',
  TRIVIA_TYPE: 'triviaType',
  SOCIAL_LINK: 'socialLink',
  GENRE: 'genre',
  SECTION_TYPE: 'sectionType',
  SECTION_TEMPLATE: 'sectionTemplate',
});

export const ALL_RESOURCES = Object.values(RESOURCES);

// Helper: All common operations for listing pages
export const ALL_OPERATIONS = Object.values(OPERATIONS);