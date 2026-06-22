import type * as Preset from '@docusaurus/preset-classic';
import type { Config } from '@docusaurus/types';
import { themes as prismThemes } from 'prism-react-renderer';

// Site base URL — must prefix any root-absolute asset paths we emit by hand
// (e.g. the local <source> in rehypeGithubVideos) so they resolve under the
// GitHub Pages subpath both locally (`serve`/`start`) and in production.
const BASE_URL = '/2026-reanimated4-rngh3-workshops/';

// Rehype plugin to turn bare GitHub video URLs into <video> embeds.
// remark-gfm autolinks them to <a> tags; this plugin converts those to <video>.
//
// Local video files in docs-site/static/videos/ (populated by download-videos.sh)
// are emitted as the first <source> so the docs work fully offline.
// The original GitHub URL is kept as a second <source> fallback.
function rehypeGithubVideos() {
  return async (tree: Parameters<import('unified').Transformer>[0]) => {
    const { visit } = await import('unist-util-visit');

    const GITHUB_VIDEO_RE =
      /^https:\/\/(user-images\.githubusercontent\.com\/.+\.(mp4|MP4|mov|MOV|webm)|github\.com\/.+\/assets\/[^/]+\/[a-f0-9-]+|github\.com\/user-attachments\/assets\/[a-f0-9-]+)$/;

    /** Maps a remote GitHub video URL to its local /videos/<file> path, or null. */
    function localPath(url: string): string | null {
      // github.com/user-attachments/assets/<UUID>
      const assetMatch = url.match(/github\.com\/user-attachments\/assets\/([a-f0-9-]+)$/);
      if (assetMatch) return `${BASE_URL}videos/${assetMatch[1]}.mp4`;

      // user-images.githubusercontent.com/<user>/<filename>.<ext>
      const imgMatch = url.match(/user-images\.githubusercontent\.com\/[^/]+\/(.+\.(mp4|MP4|mov|MOV|webm))$/);
      if (imgMatch) return `${BASE_URL}videos/${imgMatch[1].toLowerCase()}`;

      return null;
    }

    visit(tree, 'element', (node: any, index: number | undefined, parent: any) => {
      if (!parent || index === undefined) return;
      if (node.tagName !== 'p') return;
      if (node.children.length !== 1) return;

      const child = node.children[0];
      if (child.tagName !== 'a') return;

      const href: string = child.properties?.href ?? '';
      if (!GITHUB_VIDEO_RE.test(href)) return;

      const local = localPath(href);

      parent.children[index] = {
        type: 'element',
        tagName: 'video',
        properties: {
          controls: true,
          playsinline: true,
          style: 'width:100%;max-width:300px;border-radius:8px;margin:1rem 0',
        },
        children: [
          // Local file first (works offline after running download-videos.sh)
          ...(local ? [{
            type: 'element',
            tagName: 'source',
            properties: { src: local },
            children: [],
          }] : []),
          // GitHub CDN as fallback
          {
            type: 'element',
            tagName: 'source',
            properties: { src: href },
            children: [],
          },
        ],
      };
    });
  };
}

const config: Config = {
  title: 'App.js Reanimated Workshop',
  tagline: 'Advanced React Native animations with Reanimated & Gesture Handler',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
    faster: true,
  },

  url: 'https://software-mansion-labs.github.io',
  baseUrl: BASE_URL,

  organizationName: 'software-mansion-labs',
  projectName: 'appjs-2026-workshop-reanimated',
  trailingSlash: false,

  onBrokenLinks: 'warn',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'setup',
        path: './docs',
        routeBasePath: 'prerequisites',
        sidebarPath: false,
      },
    ],
    [
      '@docusaurus/plugin-pwa',
      {
        debug: false,
        offlineModeActivationStrategies: ['appInstalled', 'standalone', 'queryString'],
        pwaHead: [
          { tagName: 'link', rel: 'icon', href: '/img/favicon.ico' },
          { tagName: 'link', rel: 'manifest', href: '/manifest.json' },
          { tagName: 'meta', name: 'theme-color', content: '#6644ff' },
          { tagName: 'meta', name: 'apple-mobile-web-app-capable', content: 'yes' },
          { tagName: 'meta', name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
        ],
      },
    ],
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          path: '../src/lessons',
          sidebarPath: './sidebars.ts',
          exclude: ['**/steps/**', 'CSSAnimations/**', 'TwitterFeed/**'],
          routeBasePath: 'docs',
          numberPrefixParser: false,
          rehypePlugins: [rehypeGithubVideos],
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Reanimated Workshop',
      items: [
        {
          to: '/prerequisites',
          label: 'Prerequisites',
          position: 'left',
        },
        {
          type: 'docSidebar',
          sidebarId: 'lessons',
          position: 'left',
          label: 'Lessons',
        },
        {
          href: 'https://github.com/software-mansion-labs/appjs-2026-workshop-reanimated',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Workshop',
          items: [
            { label: 'Circle Gestures', to: '/docs/1_CircleGestures' },
            { label: 'Balloon Slider', to: '/docs/2_BalloonSlider' },
            { label: 'FAB Button', to: '/docs/3_FABButton' },
            { label: 'Interpolation', to: '/docs/4_Interpolation' },
          ],
        },
        {
          title: 'More',
          items: [
            { label: 'CSS Animations', to: '/docs/5_1_CSSAnimations' },
            { label: 'CSS Transitions', to: '/docs/5_2_CSSTransitions' },
            { label: 'Dynamic Tabs', to: '/docs/6_DynamicTabs' },
            { label: 'Music', to: '/docs/8_Music' },
            { label: 'Scroll Animation', to: '/docs/Bonus_ScrollAnimation' },
          ],
        },
        {
          title: 'Links',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/software-mansion-labs/appjs-2026-workshop-reanimated',
            },
            {
              label: 'Reanimated Docs',
              href: 'https://docs.swmansion.com/react-native-reanimated/',
            },
          ],
        },
      ],
      copyright: `App.js 2025 · Hosted by Catalin Miron & Bartlomiej Bloniarz · Built with Docusaurus`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['typescript', 'tsx', 'jsx'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
