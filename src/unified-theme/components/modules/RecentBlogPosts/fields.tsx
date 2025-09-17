import { ModuleFields, BlogField, FieldGroup, TextField, BooleanField } from '@hubspot/cms-components/fields';
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

const headingVisibility: AdvancedVisibility = {
  boolean_operator: 'AND',
  criteria: [
    {
      controlling_field_path: 'showHeading',
      operator: 'EQUAL',
      controlling_value_regex: 'true',
    },
  ],
};

export const fields = (
  <ModuleFields>
    <BlogField label="Blog" name="blog" />
    <BooleanField
      label="Show heading"
      name="showHeading"
      default={false}
      help_text="Display a heading above the blog posts"
    />
    <HeadingAndText
      headingLevelDefault="h3"
      textVisibility={textVisibility}
      visibility={headingVisibility}
      headingLevelLabel="Heading style"
      headingLabel="Heading text"
    />
    <StyleFields />
    <FieldGroup label="Placeholder text" name="groupPlaceholderText" locked={true}>
      <TextField label="Title" name="placeholderTitle" default="No posts found" />
      <TextField label="Description" name="placeholderDescription" default="Select a blog in the sidebar" />
    </FieldGroup>
  </ModuleFields>
);
