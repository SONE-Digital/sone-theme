import { ModuleMeta } from '../../types/modules.js';
import { ImageFieldType } from '@hubspot/cms-components/fields';

type HeroSection1Props = {
  headline?: string;
  buttonText?: string;
  heroImage?: ImageFieldType['default'];
};

export const Component = (props: HeroSection1Props) => {
  const { 
    headline = "Deduct 100% of Your Equipment Investment in 2025",
    buttonText = "Explore eligible equipment",
    heroImage
  } = props;
  return (
    <div className="max-w-[1440px] mx-auto">
      <section
        className="relative w-full h-[556px] overflow-hidden max-[600px]:h-auto"
      >
        {/* Layout container */}
        <div
          className="relative mx-auto max-w-[1440px] h-full flex max-[600px]:flex-col max-[600px]:items-center max-[600px]:justify-center max-[600px]:py-5 max-[600px]:pt-10"
        >
          {/* Text Container */}
          <div
            className="pl-[120px] flex items-center z-10 max-[600px]:pl-4 max-[600px]:pr-4 max-[600px]:w-full max-[600px]:justify-center w-[566px]"
          >
            <div className="w-[446px] max-[600px]:w-full max-[600px]:text-center">
              <h1
                className="text-h1 text-black max-[600px]:text-[40px] max-[480px]:text-[44px]"
              >
{headline}
              </h1>
              <a
                href="#next-steps"
                className="btn btn-primary mt-6 inline-flex whitespace-nowrap max-[600px]:mx-auto"
              >
{buttonText}
              </a>
            </div>
          </div>

          {/* Image Container */}
          <div
            className="h-full w-[874px] max-[600px]:hidden"
            style={{clipPath: 'polygon(20% 0%, 100% 0%, 100% 100%, 0% 100%)'}}
          >
            {heroImage?.src && (
              <img
                src={heroImage.src}
                alt={heroImage.alt || "Hero image"}
                width={heroImage.width}
                height={heroImage.height}
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </div>
      </section>
      {/* Mobile-only image */}
      <div className="hidden max-[600px]:block px-4 pb-4">
        <img
          src="https://www.lexjet.com/images/thumbs/00419/0041958_wad-of-cash-scroller.jpeg"
          alt="Wad of cash"
          className="mx-auto max-w-full h-auto max-h-[200px] object-contain"
        />
      </div>
    </div>
  );
};

export { fields } from './fields.tsx';

export const meta: ModuleMeta = {
  label: 'Hero Section 1',
  content_types: [],
  icon: 'hero',
  categories: ['hero'],
};

export const defaultModuleConfig = {
  moduleName: 'sone/components/modules/HeroSection1',
  version: 0,
  themeModule: true,
};