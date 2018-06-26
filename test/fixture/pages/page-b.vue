<template>
  <div>
    Page B
    {{ slides }}
    <nuxt-link to="/"> home </nuxt-link>
  </div>
</template>

<script>
  import gql from 'graphql-tag'

  export default {
    apollo: {
      slides: {
        query: gql`
          query slides($top: Int, $skip: Int) {
            querySlideContents(top: $top, skip: $skip) {
              id
              data {
                linkUrl {
                  iv
                }
                image {
                  iv {
                    url
                  }
                }
              }
            }
          }
        `,
        variables: { top: 3 },
        prefetch: true
      }
    }
  }
</script>
