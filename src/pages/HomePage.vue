<template>
  <article>
    <section>
      <div class="container">
        <div
          id="intro"
          class="bg-image content"
        >
          <div class="row">
            <p class="homepage_title">
              Lettres
            </p>
          </div>
          <div class="row">
            <p class="homepage_subtitle">
              de la Première Modernité
            </p>
          </div>
          <div class="row is-flex is-justify-content-center mt-5">
            <b-button
              tag="router-link"
              to="/about"
              class="portail_button"
            >
              Le portail
            </b-button>
          </div>
          <!--<div class="row">
            <p class="title has-text-centered">
              Lettres
            </p>
            <p class="subtitle has-text-centered">
              de la Première Modernité
            </p>
            <div class="columns is-centered mx-5">
              <div class="column is-4">
                <b-button
                  tag="router-link"
                  to="/about"
                  type="is-primary is-fullwidth"
                >
                  Le portail
                </b-button>
              </div>
              <div class="column is-4">
                <b-button
                  tag="router-link"
                  to="/search"
                  type="is-primary is-fullwidth"
                >
                  Faire une recherche
                </b-button>
              </div>
              <div class="column is-4">
                <b-button
                  tag="router-link"
                  to="/collections"
                  type="is-primary is-fullwidth"
                >
                  Découvrir les collections
                </b-button>
              </div>
            </div>
          </div>-->
        </div>
        <div class="row search_row">
          <search-box
            class="m-5"
          />
        </div>
      </div>
    </section>
    <section>
      <div class="container">
        <!--<div class="row">
          {{ allCollections }}
        </div>-->
        <div
          class="row m-auto is-flex is-justify-content-center"
          style="text-align: center"
        >
          <div class="column col_meta is-inline-block my-5">
            <div class="row">
              <span class="has-text-grey has-text-weight-bold">LETTRES</span>
            </div>
            <div class="row">
              <router-link
                :to="{ name: 'search' }"
                class="navbar-start-item"
              >
                <span class="metadata">{{ lettersCount }}</span>
              </router-link>
            </div>
          </div>
          <div class="column col_meta is-inline-block my-5">
            <div class="row">
              <span class="has-text-grey has-text-weight-bold">COLLECTIONS</span>
            </div>
            <div class="row">
              <router-link
                :to="{ name: 'collections' }"
                class="navbar-start-item"
              >
                <span class="metadata">{{ collectionsCount }}</span>
              </router-link>
            </div>
          </div>
          <div class="column col_meta is-inline-block my-5">
            <div class="row">
              <span class="has-text-grey has-text-weight-bold">PERSONNES</span>
            </div>
            <div class="row">
              <router-link
                :to="{ name: 'persons' }"
                class="navbar-start-item"
              >
                <span class="metadata">{{ personsCount }}</span>
              </router-link>
            </div>
          </div>
          <div class="column col_meta is-inline-block my-5">
            <div class="row">
              <span class="has-text-grey has-text-weight-bold">LIEUX</span>
            </div>
            <div class="row">
              <router-link
                :to="{ name: 'places' }"
                class="navbar-start-item"
              >
                <span class="metadata">{{ placesCount }}</span>
              </router-link>
            </div>
          </div>
        </div>
        <div
          class="row m-auto is-flex is-justify-content-center"
        >
          <div class="content is-inline-block m-5 p-1">
            <h3>Des correspondances <br> du XV<sup>e</sup> au XVII<sup>e</sup> siècle</h3>
            <p class="has-text-justified">
              LPM présente le contenu de lettres missives de la fin du Moyen Âge et du début de l’époque moderne (vers
              1460-vers 1660). Il réunit des correspondances de toute nature – politiques, diplomatiques, commerciales ou
              savantes –, émanant d’hommes et de femmes d’État ou de personnages plus humbles, à travers des collections
              qui
              rassemblent des milliers de lettres ou qui contiennent quelques lettres seulement.
            </p>
          </div>
          <div class="content is-inline-block m-5 p-1">
            <h3>Un portail d’éditions <br> collaboratives</h3>
            <p class="has-text-justified mb-2">
              LPM rassemble des projets conduits par des partenaires différents qui mettent en commun leurs apports
              éditoriaux à travers une unique application de recherche. La participation aux entreprises éditoriales peut
              se
              faire à différents niveaux, conception et proposition de nouvelles collections, signalisation et
              téléchargement d’images d’originaux, renseignement des métadonnées, transcription et annotation éditoriale.
            </p>
          </div>
        </div>
      </div>
    </section>
    <section>
      <div class="container">
        <div class="row m-auto is-flex">
          <div class="content is-inline-block m-5 p-1">
            <h3>Focus</h3>
            <!--<p class="has-text-justified mb-2">
              [Boutons de nouvelles collections et une ou des collections plus anciennes de manière aléatoire et
              changeante]
            </p>-->
          </div>
        </div>
        <div class="row m-auto">
          <div
            class="container columns is-vcentered m-5"
            v-for="featured in featured_collections"
            v-bind:key="featured.id"
          >
            <div class="column is-4 padding-5 is-inline-block">
              <div class="card has-text-centered">
                <router-link
                  :to="{ name: 'collection', params: {collectionId: featured.id } }"
                >
                  <img
                    id="card_image"
                    class="card-img-top m-5 is-inline-block"
                    src="../assets/images/collections/collection1.jpg"
                    alt="Card image cap"
                  >
                  <div class="card-body has-text-centered">
                    <h5 class="card-title px-6">
                      collection {{featured.id}}
                    </h5>
                    <p class="card-text">
                      4708 documents
                    </p>
                  </div>
                  <div class="card-footer is-flex is-justify-content-center">
                    <b-button
                      tag="router-link"
                      to="/collections/1"
                      type="is-primary"
                    >
                      Découvrir la collection
                    </b-button>
                  </div>
                </router-link>
              </div>
            </div>
          </div>
        </div>
        <div class="row m-auto">
          <div class="container columns is-vcentered m-5">
            <div class="column is-4 padding-5">
              <div class="card has-text-centered">
                <router-link
                  :to="{ name: 'collection', params: { collectionId: 1 } }"
                >
                  <img
                    id="card_image"
                    class="card-img-top m-5 is-inline-block"
                    src="../assets/images/collections/collection1.jpg"
                    alt="Card image cap"
                  >
                  <div class="card-body has-text-centered">
                    <h5 class="card-title px-6">
                      La correspondance de Catherine de Médicis
                    </h5>
                    <p class="card-text">
                      4708 documents
                    </p>
                  </div>
                  <div class="card-footer is-flex is-justify-content-center">
                    <b-button
                      tag="router-link"
                      to="/collections/1"
                      type="is-primary"
                    >
                      Découvrir la collection
                    </b-button>
                  </div>
                </router-link>
              </div>
            </div>
            <div class="column is-4 padding-5">
              <div class="card has-text-centered">
                <img
                  id="card_image"
                  class="card-img-top m-5 is-inline-block"
                  src="../assets/images/collections/collection2.jpg"
                  alt="Card image cap"
                >
                <div class="card-body has-text-centered">
                  <h5 class="card-title px-6">
                    La correspondance de Catherine de Médicis de 1571
                  </h5>
                  <p class="card-text">
                    257 documents
                  </p>
                </div>
                <div class="card-footer is-flex is-justify-content-center">
                  <b-button
                    tag="router-link"
                    to="/collections/2"
                    type="is-primary"
                  >
                    Découvrir la sous-collection
                  </b-button>
                </div>
              </div>
            </div>
            <div class="column is-4 padding-5">
              <div class="card has-text-centered">
                <img
                  id="card_image"
                  class="card-img-top m-5 is-inline-block"
                  src="../assets/images/collections/collection3.jpg"
                  alt="Card image cap"
                >
                <div class="card-body has-text-centered">
                  <h5 class="card-title px-6">
                    La correspondance de Henri IV
                  </h5>
                  <p class="card-text">
                    XXX documents
                  </p>
                </div>
                <div class="card-footer is-flex is-justify-content-center">
                  <b-button
                    tag="router-link"
                    to="/collections/3"
                    type="is-primary"
                  >
                    Découvrir la collection
                  </b-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>  
    </section>
  </article>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import SearchBox from "@/components/SearchBox";
import background_image from "@/assets/images/about.jpg";


export default {
  name: "HomePage",
  components: {
    SearchBox,
  },

  data: function () {
    return {
      background_image: background_image,
      //featured_collectionIds : [73, 74, 75]
    }
  },
  computed: {
    ...mapState("collections", {
      collectionTree: "fullHierarchy",
      isCollectionLoading: "isLoading",
      allCollectionsWithParents: "allCollectionsWithParents",
      allCollections: "collectionsById",
    }),
    /*...mapState("persons", {
      persons: "documents",
      allPersons : "totalCount"
    }),*/
    /*...mapState("persons", [
      "loadingStatus",
      "totalCount",
    ]),*/
    /*...mapGetters("persons", {
      personsHavingRoles: "getIncluded",
      functionsByPerson: "getFunctionsByPerson",
    }),*/

    collectionsCount: function () {
      console.log('allCollections # keys : ', Object.keys(this.allCollections).length);
      return Object.keys(this.allCollections).length - 1;
      /*.reduce((sum, collection ) => {
            return sum += collection.documentCount;
        }, 0);*/
    },
    lettersCount: function () {
      return Object.values(this.allCollections).reduce((sum, collection) => sum + collection.documentCount, 0);
    },
    personsCount: function () {
      console.log('All persons : ', this.$store.state.persons.persons);
      return this.$store.state.persons.persons.length;
    },
    placesCount: function () {
      console.log('All places : ', this.$store.state.placenames.placenames);
      return this.$store.state.placenames.placenames.length;
    },
    featured_collections: function () {
      //console.log('featured_collectionIds : ', this.featured_collectionIds);
      let featured=[];
      let featured_collectionIds=[73, 74, 75];
      console.log('length keys : ', Object.keys(this.allCollections).length);
      for (let i=1; i< Object.keys(this.allCollections).length; i++){
        console.log('i : ', i);

        if (featured_collectionIds.includes(parseInt(Object.values(this.allCollections)[i][0]))) {
          console.log('Object i : ', i, Object.values(this.allCollections)[i][0] );
          console.log('Object i : ', Object.values(this.allCollections[i]) );
          // here STATE selected in previous drop down, match it with state from json and get COUNTY
          featured = [Object.keys(this.allCollections[i])];
        }
      }
      return featured;
    },
  },
  created() {
    this.fetchCollections();
    this.fetchPersons();
    this.fetchPlaces();
  },
  methods: {
    ...mapActions("search", ["performSearch"]),
    ...mapActions("collections", { fetchCollections: "fetchAll" }),
    //...mapState("collections", ["collectionsById"]),
    ...mapActions("persons", { fetchPersons: "fetchAllPersons" }),
    ...mapActions("placenames", { fetchPlaces: "fetchAllPlacenames"})
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/sass/main.scss";
#intro {
  background-image: url('../assets/images/about.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  height:300px;
  width:auto;
  display:flex;
  flex-direction: column;
  justify-content: center;
  margin-bottom: 0px !important;
}
#card_image {
  max-width: 200px;
}
.homepage_title {
  font-size: xxx-large;
  font-width: bolder;
  text-shadow: 0px 2px, 2px 0px, 2px 2px;
  color: white;
  text-align: center;
}
.homepage_subtitle {
  font-size: x-large;
  color: white;
  text-align: center;
}
.metadata {
  font-size: xx-large;
  font-width: bolder;
  text-shadow: 0px 2px, 2px 0px, 2px 2px;
  color: rgb(255, 0, 83);
  text-align: center;
}
.col_meta:not(:last-of-type) {
  border-right: solid 5px;
  border-right-color: rgba(180, 0, 80);
}
.card {
  overflow: hidden;
  border-radius: 0.5em;
}
.card-title {
  color: rgb(255, 0, 83);
}
.portail_button {
  background-color: transparent;
  color: white;
}
.search_row {
  background-color: rgba(35, 9, 20);
  padding: 5px;
}
/*a.button {
  border: none !important;
  outline: none !important;
}*/
.search_button {
  border-color: white !important;
  outline: none !important;
  box-shadow:none !important;
  color: rgba(35, 9, 20) !important;
 }
</style>
