import { ModuleMeta } from '../../types/modules.js';
import { withUrlPath } from '@hubspot/cms-components';
import BlogCardComponent from '../../BlogCardComponent/index.js';
import fetchGatedPosts from '../../utils/ServerSideProps/fetchGatedBlogPosts.js';
import { HeadingStyleFieldLibraryType } from '../../fieldLibrary/HeadingStyle/types.js';
import { CardStyleFieldLibraryType } from '../../fieldLibrary/CardStyle/types.js';
import { HeadingAndTextFieldLibraryType } from '../../fieldLibrary/HeadingAndText/types.js';

// Types
type BlogSectionProps = HeadingAndTextFieldLibraryType & {
  hublData: {
    blogPosts: {
      id: number;
      title: string;
      featuredImage: string;
      featuredImageAltText: string;
      featuredImageWidth: number;
      featuredImageHeight: number;
      topicNames: string[];
      absoluteUrl: string;
    }[];
    currentPageNumber: number;
    nextPageNumber: number;
    totalPageCount: number;
    use_featured_image_in_summary: boolean;
  };
  serverSideProps: {
    gatedContentIds: number[];
  };
  groupStyle: CardStyleFieldLibraryType & HeadingStyleFieldLibraryType;
  sectionHeading?: string;
  maxPosts?: number;
  showViewAllButton?: boolean;
  viewAllButtonText?: string;
  viewAllButtonUrl?: string;
};

export const Component = (props: BlogSectionProps) => {
  if (!props?.hublData?.blogPosts) {
    return null;
  }

  const {
    hublData: { blogPosts, use_featured_image_in_summary },
    serverSideProps: { gatedContentIds = [] },
    groupStyle: { headingStyleVariant, cardStyleVariant } = {},
    headingAndTextHeadingLevel,
    sectionHeading = "Latest Blog Posts",
    maxPosts = 6,
    showViewAllButton = true,
    viewAllButtonText = "View All Posts",
    viewAllButtonUrl = "/blog"
  } = props;

  // Limit posts if maxPosts is specified
  const displayedPosts = maxPosts > 0 ? blogPosts.slice(0, maxPosts) : blogPosts;

  return (
    <div className="max-w-[1440px] mx-auto">
      <section className="py-16 px-4">
        {/* Section Heading */}
        {sectionHeading && (
          <div className="text-center mb-12">
            <h2 className="text-h2 text-black mb-4">
              {sectionHeading}
            </h2>
          </div>
        )}

        {/* Blog Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {displayedPosts.map(post => (
            <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              {/* Featured Image */}
              {post.featuredImage && use_featured_image_in_summary && (
                <div className="aspect-video overflow-hidden">
                  <img
                    src={post.featuredImage}
                    alt={post.featuredImageAltText || post.title}
                    width={post.featuredImageWidth}
                    height={post.featuredImageHeight}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}

              {/* Card Content */}
              <div className="p-6">
                {/* Topics/Tags */}
                {post.topicNames && post.topicNames.length > 0 && (
                  <div className="mb-3">
                    {post.topicNames.slice(0, 2).map((topic, index) => (
                      <span
                        key={index}
                        className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-2 mb-1"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                )}

                {/* Post Title */}
                <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 hover:text-blue-600 transition-colors">
                  <a href={post.absoluteUrl} className="no-underline">
                    {post.title}
                  </a>
                </h3>

                {/* Read More Link */}
                <a
                  href={post.absoluteUrl}
                  className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
                >
                  Read More →
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        {showViewAllButton && viewAllButtonUrl && (
          <div className="text-center">
            <a
              href={viewAllButtonUrl}
              className="btn btn-primary inline-flex items-center px-6 py-3"
            >
              {viewAllButtonText}
            </a>
          </div>
        )}
      </section>
    </div>
  );
};

export { fields } from './fields.js';

export { default as hublDataTemplate } from '../BlogListing/hubl_data.hubl.html?raw';

export const getServerSideProps = withUrlPath(fetchGatedPosts);

export const meta: ModuleMeta = {
  label: 'Blog Section',
  content_types: ['SITE_PAGE', 'LANDING_PAGE'],
  icon: 'blog',
  categories: ['blog'],
};

export const defaultModuleConfig = {
  moduleName: 'sone/components/modules/BlogSection',
  version: 0,
  themeModule: true,
};