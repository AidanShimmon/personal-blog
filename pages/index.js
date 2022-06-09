import React from "react";
import { staticRequest } from "tinacms";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import { Layout } from "../components/Layout";
import { useTina } from "tinacms/dist/edit-state";

const query = `{
  page(relativePath: "home.mdx"){
     blocks{
       __typename
         ... on PageBlocksHero {
           heading
           subheading
           description
         }
         ... on PageBlocksProjects {
            heading,
            subheading,
            items{
              image,
              name,
              description,
              href
            }
         }
     }
 }
}`;

export default function Home(props) {
  // data passes though in production mode and data is updated to the sidebar data in edit-mode
  const { data } = useTina({
    query,
    variables: {},
    data: props.data,
  });

  return (
    <Layout>
      {data.page.blocks 
        ? data.page.blocks.map(function (block, i) {
        switch (block.__typename) {
          case "PageBlocksHero":
            return (
              <React.Fragment className="Hero" key={i + block.__typename}>
                <div>{block.heading}</div>
                <div>{block.subheading}</div>
                <div>{block.description}</div>
              </React.Fragment>
            );
          case "PageBlocksProjects":
            return (
              <React.Fragment className="Projects" key={i + block.__typename}>
                <div>{block.heading}</div>
                <div>{block.subheading}</div>
                {block.items?.map((item) => {
                  return (
                    <React.Fragment key={item.name}>
                      <div>{item.image}</div>
                      <div>{item.name}</div>
                      <div>{item.description}</div>
                      <div>{item.href}</div>
                    </React.Fragment>
                  );
                })}
              </React.Fragment>
            )
        }
      })
      : null}
    </Layout>
  );
}

export const getStaticProps = async () => {
  const variables = {};
  let data = {};
  try {
    data = await staticRequest({
      query,
      variables,
    });
  } catch {
    // swallow errors related to document creation
  }

  return {
    props: {
      data,
      //myOtherProp: 'some-other-data',
    },
  };
};
