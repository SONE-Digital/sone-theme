import { ModuleFields, BlogField, FieldGroup, TextField } from '@hubspot/cms-components/fields';
import StyleFields from './styleFields.js';
import { HeadingAndText } from '../../fieldLibrary/index.js';
import { AdvancedVisibility } from '@hubspot/cms-components/fields';

const textVisibility: AdvancedVisibility = {
  boolean_operator: 'AND',
  criteria: [
    {
      controlling_field_path: 'headingAndTextHeadingLevel',
      operator: 'EQUAL',
      controlling_value_regex: 'ThisFieldShouldAlwaysBeHidden',
    },
  ],
};

export const fields = (
  <ModuleFields>
    <BlogField label="Blog" name="blog" />
    <HeadingAndText headingLevelDefault="h3" textVisibility={textVisibility} />
    <StyleFields />
    <FieldGroup label="Placeholder text" name="groupPlaceholderText" locked={true}>
      <TextField label="Title" name="placeholderTitle" default="No posts found" />
      <TextField label="Description" name="placeholderDescription" default="Select a blog in the sidebar" />
    </FieldGroup>
  </ModuleFields>
);
