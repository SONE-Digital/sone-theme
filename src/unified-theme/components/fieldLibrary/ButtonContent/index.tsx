import {
  TextField,
  LinkField,
  IconField,
  ChoiceField,
  AdvancedVisibility,
  BooleanField,
} from '@hubspot/cms-components/fields';
import {
  IconFieldType,
  LinkFieldType,
  TextFieldType,
} from '@hubspot/cms-components/fields';

type ButtonContent = {
  textDefault: TextFieldType['default'];
  linkDefault?: LinkFieldType['default'];
  iconDefault?: IconFieldType['default'];
  iconPositionDefault?: 'left' | 'right';
  textVisibility?: AdvancedVisibility;
  linkVisibility?: AdvancedVisibility;
};

export default function ButtonContent(props: ButtonContent) {
  const {
    textDefault = 'Learn more',
    linkDefault = {
      open_in_new_tab: true,
    },
    iconDefault = {
      name: 'arrow-right',
    },
    iconPositionDefault = 'right',
    textVisibility = null,
    linkVisibility = null,
  } = props;

  return (
    <>
      <TextField
        label='Button text'
        name='buttonContentText'
        visibilityRules='ADVANCED'
        advancedVisibility={textVisibility}
        required
        default={textDefault}
      />
      <LinkField
        label='Link'
        name='buttonContentLink'
        visibilityRules='ADVANCED'
        advancedVisibility={linkVisibility}
        supportedTypes={[
          'EXTERNAL',
          'CONTENT',
          'FILE',
          'EMAIL_ADDRESS',
          'CALL_TO_ACTION',
          'BLOG',
          'PAYMENT',
        ]}
        default={linkDefault}
      />
      <BooleanField
        label='Show icon'
        name='buttonContentShowIcon'
        id='buttonContentShowIcon'
        display='toggle'
        default={false}
      />
      <IconField
        label='Icon'
        name='buttonContentIcon'
        id='buttonContentIcon'
        visibility={{
          controlling_field: 'buttonContentShowIcon',
          controlling_value_regex: 'true',
          operator: 'EQUAL',
        }}
        iconSet='fontawesome-6.4.2'
        default={iconDefault}
      />
      <ChoiceField
        label='Icon position'
        name='buttonContentIconPosition'
        visibility={{
          controlling_field: 'buttonContentShowIcon',
          controlling_value_regex: 'true',
          operator: 'EQUAL',
        }}
        choices={[
          ['left', 'Left'],
          ['right', 'Right'],
        ]}
        display='select'
        default={iconPositionDefault}
      />
    </>
  );
}
