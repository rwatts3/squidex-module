<template>
  <div>
    Home
    {{ slides }}
    <nuxt-link to="page-b"> page b </nuxt-link>
  </div>
</template>

<script>
  import gql from 'graphql-tag'

  export default {
    apollo: {
      slides () {
        return {
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
          variables: { top: 5 },
          prefetch: true
        }
      }
    }
  }
</script>
