<template>
  <div v-if="collection">
    <div class="collection-card card">
      <div class="columns is-vcentered">
        <div class="column is-2 has-text-centered">
          <img
            id="card_image"
            class="card-img-left m-2 is-inline-block"
            :src="require('../assets/images/collections/collection'+collectionId+'.jpg')"
            alt="Card image cap"
          >
        </div>
        <div class="column">
          <div class="card-content">
            <div class="is-flex is-justify-content-space-between mb-4">
              <span class="title is-flex is-justify-content-space-between">
                <span v-if="!editMode">
                  <router-link
                    :to="{ name: 'collection', params: { collectionId: collection.id } }"
                    class="mt-3 mb-5"
                  >
                    {{ collection.title }}
                  </router-link>
                </span>
                <span v-else>
                  <div class="field has-addons">
                    <div class="control">
                      <input
                        v-model="collection.title"
                        class="input collection-card__title-input"
                        type="text"
                        placeholder="Titre de la collection"
                      >
                    </div>
                    <div class="control">
                      <a
                        class="button is-primary"
                        :class="saving === 'loading' ? 'is-loading' : ''"
                        @click.stop="save"
                      >
                        <save-button-icon />
                      </a>
                    </div>
                    <router-link
                      tag="button"
                      class="button control ml-2 is-primary"
                      :to="{ name: 'collection', params: { collectionId: collection.id } }"
                    ><i class="fas fa-arrow-right" /></router-link>
                  </div>
                </span>
              </span>
            </div>

            <div class="collection-card__dates mb-2">
              <u>Dates :</u> {{ collection.dateMin || "..." }} -
              {{ collection.dateMax || "..." }}
            </div>

            <div class="columns">
              <div class="column">
                <p v-if="!editMode">
                  <span v-html="collection.description" /> ({{
                    collection.documentCount
                  }}
                  documents)
                </p>
                <p v-else>
                  <title-field-in-place
                    :tabulation-index="0"
                    label="Titre"
                    name="title"
                    not-set="Non renseigné"
                    :initial-value="collection.description"
                    :editable="true"
                    :formats="descriptionFormats"
                    @changed="saveDescription"
                  /> ({{
                    collection.documentCount
                  }}
                  documents)
                </p>

                <div class="collection-card__children mt-2 mb-2 pl-3 ml-3">
                  <ul>
                    <li
                      v-for="child in collection.children"
                      :key="child.id"
                    >
                      <router-link
                        :to="{ name: 'collection', params: { collectionId: child.id } }"
                        class="mt-5 mb-5"
                      >
                        {{ child.title }} ({{ child.nb_docs }} documents)
                      </router-link>
                    </li>
                  </ul>
                </div>
              </div>
              <div
                v-if="collection.parents && collection.parents.length > 0"
                class="column"
              >
                <span>Collections parentes :</span>
                <ul class="collection-card__children mt-2 mb-2 pl-3 ml-3">
                  <li
                    v-for="parent in collection.parents"
                    :key="parent.id"
                  >
                    <router-link
                      :to="{ name: 'collection', params: { collectionId: parent.id } }"
                      class="mt-5 mb-5"
                    >
                      {{ parent.title }}
                    </router-link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <footer class="card-footer is-flex is-justify-content-end">
        <p class="pt-2 pr-2 pb-2 pl-3">
          Collection curated by <a>{{ collection.admin.username }}</a>
        </p>
      </footer>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import TitleFieldInPlace from "@/components/forms/fields/TitleFieldInPlace";
import SaveButtonIcon from "@/components/ui/SaveButtonIcon";

export default {
  name: "CollectionCard",
  components: { TitleFieldInPlace, SaveButtonIcon },
  props: {
    collectionId: { type: String, required: true },
    editable: { type: Boolean, default: false },
  },
  data() {
    return {
      saving: "normal",
      collection: null,
    };
  },
  computed: {
    ...mapState("user", ["current_user"]),

    editMode() {
      return (
        this.editable &&
        this.collection &&
        this.current_user &&
        this.current_user.id === this.collection.admin.id
      );
    },
  },
  watch: {
    "collection.title"() {
      this.saving = "normal";
    },
    collectionId: async function () {
      await this.load();
    },
  },
  async created() {
    await this.load();
  },
  methods: {
    ...mapActions("collections", ["saveCollection", "fetchOne"]),

    descriptionFormats() {
      return [["superscript"]];
    },

    async load() {
      const data = await this.fetchOne({
        id: this.$props.collectionId,
        numPage: null,
      });
      this.collection = data.collection;
    },
    async save() {
      this.saving = "loading";
      await this.saveCollection({
        id: this.collection.id,
        title: this.collection.title,
        description: this.collection.description,
      });
      await this.load();
      this.saving = "normal";
    },

    saveDescription(evt) {
      this.collection.description = evt.value;
      this.save();
    },
  },
};
</script>

<style lang="scss">
@import "@/assets/sass/main.scss";
#card_image {
  max-width: 100px;
}
.collection-card {
  background-color: whitesmoke !important;
  box-shadow: none !important;
  -webkit-box-shadow: none !important;
  border: 1px solid $coffee;

  &__actions {
    width: 50px;
  }

  &__children {
    border-left: 1px solid $coffee;
  }

  .collection-card__head-border {
    height: 10px;
    width: 100%;
    &__selected {
      background-color: $primary !important;
    }
  }

  &__title-input {
    min-width: 420px;
  }

  &__dates {
    line-height: 2rem;
    white-space: nowrap;
    font-weight: normal;
    font-size: 1rem;
    color: $brown;
  }

  .title {
    font-size: 1.5rem;
  }

  .card-footer {
    border-top: 1px solid $coffee;
  }
}
</style>
