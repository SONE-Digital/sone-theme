import { ModuleFields, TextField, NumberField, BooleanField, UrlField, ChoiceField, FieldGroup } from '@hubspot/cms-components/fields';
import HeadingStyle from '../../fieldLibrary/HeadingStyle/index.js';
import HeadingAndText from '../../fieldLibrary/HeadingAndText/index.js';
import { CardStyle } from '../../fieldLibrary/index.js';

export const fields = (
  <ModuleFields>
    <TextField
      name="sectionHeading"
      label="Section Heading"
      default="Latest Blog Posts"
      help_text="The main heading for the blog section"
    />

    <NumberField
      name="maxPosts"
      label="Maximum Posts to Display"
      default={6}
      min={1}
      max={12}
      help_text="Number of blog posts to show in the section"
    />

    <BooleanField
      name="showViewAllButton"
      label="Show 'View All' Button"
      default={true}
      help_text="Display a button linking to the full blog listing"
    />

    <TextField
      name="viewAllButtonText"
      label="View All Button Text"
      default="View All Posts"
      visibility={{
        controlling_field_path: 'showViewAllButton',
        operator: 'EQUAL',
        controlling_value_regex: 'true'
      }}
    />

    <UrlField
      name="viewAllButtonUrl"
      label="View All Button URL"
      default={{
        url: {
          href: "/blog"
        }
      }}
      visibility={{
        controlling_field_path: 'showViewAllButton',
        operator: 'EQUAL',
        controlling_value_regex: 'true'
      }}
    />

    <ChoiceField
      label="Card elements to display"
      name="displayForEachListItem"
      display="checkbox"
      multiple={true}
      reorderingEnabled={false}
      choices={[['tags', 'Tags'], ['featuredImage', 'Featured Image']]}
      default={['tags', 'featuredImage']}
    />

    <HeadingAndText
      headingLevelDefault="h2"
      headingLevelLabel="Section heading level"
      textVisibility={{
        boolean_operator: 'AND',
        criteria: [
          {
            operator: 'EQUAL',
            controlling_field_path: 'defaultRules.lockHeadingTextField',
            controlling_value_regex: 'false',
          },
        ],
      }}
    />

    <FieldGroup name="defaultRules" label="Default Rules" locked={true}>
      <BooleanField name="lockHeadingTextField" label="Lock heading text field" default={true} locked={true} />
    </FieldGroup>

    <FieldGroup name="groupStyle" label="Style" tab="STYLE">
      <CardStyle cardStyleDefault="card_variant_2" />
      <HeadingStyle headingStyleAsDefault="h3" headingStyleAsLabel="Post title heading style" />
    </FieldGroup>
  </ModuleFields>
);