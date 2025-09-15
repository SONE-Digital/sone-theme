import { ModuleFields, TextField, ImageField } from '@hubspot/cms-components/fields';
import benFranklinImg from './assets/ben-franklin.jpg';

export const fields = (
  <ModuleFields>
    <TextField
      label='Headline'
      name='headline'
      default='Deduct 100% of Your Equipment Investment in 2025'
    />
    <TextField
      label='Button Text'
      name='buttonText'
      default='Explore eligible equipment'
    />
    <ImageField
      label='Hero Image'
      name='heroImage'
      default={{
        alt: 'Ben Franklin',
        src: benFranklinImg,
        width: 874,
        height: 556
      }}
    />
  </ModuleFields>
);