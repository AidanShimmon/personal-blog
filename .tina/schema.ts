import { defineConfig, defineSchema } from "tinacms";
import type {TinaTemplate} from "tinacms";

const heroBlock:TinaTemplate = {
  name: "hero",
  label: "Hero Block",
  fields: [
    {
      type: "string",
      label: "Heading",
      name: "heading",
    },
    {
      type: "string",
      label: "Sub Heading",
      name: "subheading",
    },
    {
      type: "string",
      label: "Description",
      name: "description",
      ui: {
        component: "textarea"
      },
    },
  ],
}

const projectBlock:TinaTemplate = {
  name: "projects",
  label: "Projects Section",
  fields: [
    {
      type: "string",
      label: "Heading",
      name: "heading",
    },
    {
      type: "string",
      label: "Sub Heading",
      name: "subheading",
    },
    {
      type: "object",
      label: "Project Items",
      name: "items",
      list: true,
      fields: [
        {
          name: "image",
          label: "Project Image",
          type: "image",
        },
        {
          name: "name",
          label: "Content name",
          type: "string",
        },
        {
          type: "string",
          label: "Description",
          name: "description",
          ui: {
            component: "textarea"
          },
        },
        {
          name: "href",
          label: "Link URL",
          type: "string",
        },
      ]
    }
  ]
}

const schema = defineSchema({
  collections: [
    {
      label: "Page Content",
      name: "page",
      path: "content/page",
      format: "mdx",
      fields: [
        {
          type: "object",
          list: true,
          name: "blocks",
          label: "Sections",
          templates: [heroBlock, projectBlock],
        },
      ],
    },
    {
      label: "Blog Posts",
      name: "post",
      path: "content/post",
      fields: [
        {
          type: "string",
          label: "Title",
          name: "title",
        },
        {
          type: "string",
          label: "Blog Post Body",
          name: "body",
          isBody: true,
          ui: {
            component: "textarea",
          },
        },
      ],
    },
  ],
});

export default schema;

const branch = process.env.NEXT_PUBLIC_EDIT_BRANCH || "main";
const apiURL =
  process.env.NODE_ENV == "development"
    ? "http://localhost:4001/graphql"
    : `https://content.tinajs.io/content/${process.env.NEXT_PUBLIC_TINA_CLIENT_ID}/github/${branch}`;

export const tinaConfig = defineConfig({
  apiURL,
  schema,
  cmsCallback: (cms) => {
    import("tinacms").then(({ RouteMappingPlugin }) => {
      const RouteMapping = new RouteMappingPlugin((collection, document) => {
        if (["page"].includes(collection.name)) {
          if (document._sys.filename === "home") {
            return "/";
          }
        }

        if (["post"].includes(collection.name)) {
          return `/posts/${document._sys.filename}`;
        }

        return undefined;
      });

      cms.plugins.add(RouteMapping);
    });
    return cms;
  },
});
