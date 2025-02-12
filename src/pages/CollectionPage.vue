<template>
  <div class="container">
    <!--<router-link
      :to="{ name: 'collections' }"
      class="mt-5 mb-5"
    >
      <i class="fas fa-arrow-left ml-1 mr-3" />
      Toutes les collections
    </router-link>-->
    <router-link v-if="current_user && current_user.isAdmin" to="create" custom v-slot="{ navigate }" append>
      <b-button @click="navigate" type="is-primary" label="Créer une sous-collection"/>
    </router-link>

    <!--<b-button @click="showHierarchy = !showHierarchy" class="ml-auto">
      Hiérarchie
    </b-button>-->
    <div>
      <collection-interactive-card
        :collection-id="collectionId"
        :editable="true"
        class="m-3"
      />
      <b-sidebar
        v-model="showHierarchy"
        position="fixed"
        :right="true"
        :fullheight="true"
        class="m-3"
        style="width: 500px"
      >
        <div class="m-3">
          <p class="menu-label">
            Hiérarchie
          </p>
          <collection-hierarchy
            :collection-id="collectionId"
          />
        </div>
      </b-sidebar>
    </div>

    <section>
      <span class="pagination-goto">
        <span> Page : </span>
        <input
          v-model="currentPage"
          name="page"
          class="input"
          type="text"
          placeholder="Page..."
          @change.prevent="currentPage = parseInt(p)"
        >
      </span>
      <div class="">
        <b-table
          ref="multiSortTable"
          :data="tableData"
          paginated
          backend-pagination
          :loading="isLoading"
          :total="totalCount"
          :per-page="pageSize"
          :current-page.sync="currentPage"
          pagination-position="both"
          aria-next-label="Page suivante"
          aria-previous-label="Page précédente"
          aria-page-label="Page"
          aria-current-label="Page courante"
          detailed
          :backend-sorting="true"
          :sort-multiple="true"
          :sort-multiple-data="sortingPriority"
          detail-key="id"
          show-detail-icon
          :narrowed="true"
          :mobile-cards="true"
          @sort="sortPressed"
          @sorting-priority-removed="sortingPriorityRemoved"
          @page-change="onPageChange"
        >
          <b-table-column
            v-slot="props"
            field="id"
            label="Document"
            sortable
          >
            <document-tag-bar :doc-id="props.row.id" />
          </b-table-column>

          <b-table-column
            v-slot="props"
            field="creation"
            label="Date de rédaction"
            sortable
          >
            {{ props.row.creation }}
          </b-table-column>

          <b-table-column
            v-slot="props"
            field="title"
            label="Titre"
          >
            <router-link :to="{ name: 'document', params: { docId: props.row.id } }">
              <h2
                class="document-preview-card__title"
                v-html="props.row.title"
              />
            </router-link>
          </b-table-column>

          <template #empty>
            <div class="has-text-centered">
              Aucun résultat
            </div>
          </template>

          <template #detail="props">
            <document
              class="document-page"
              :doc-id="props.row.id"
              :preview="true"
            />
          </template>
        </b-table>
      </div>
    </section>
  </div>
</template>

<script>
import CollectionInteractiveCard from "@/components/CollectionInteractiveCard.vue";
import { mapActions, mapState } from "vuex";
import CollectionHierarchy from "@/components/CollectionHierarchy.vue";

export default {
  name: "CollectionPage",
  components: {
    CollectionInteractiveCard,
    CollectionHierarchy,
    DocumentTagBar: () => import("@/components/document/DocumentTagBar"),
    Document: () => import("@/components/sections/Document"),
  },
  props: {
    "collectionId": {
      type: Number,
      required: true,
    }
  },
  data() {
    return {
      fetchedData: [],
      tableData: [],
      sortingPriority: [{ field: "creation", order: "desc" }],
      numPage: 1,
      pageSize: 25,
      totalCount: 0,
      isLoading: false,
      showHierarchy: false
    };
  },
  computed: {
    currentPage: {
      get: function () {
        return this.numPage;
      },
      set: async function (newValue, oldValue) {
        newValue = parseInt(newValue);
        if (newValue && newValue !== oldValue) {
          this.numPage = newValue;
          await this.fetchData();
        }
      },
    },
    ...mapState("user", ["current_user"]),
  },
  watch: {
    collectionId: async function () {
      await this.fetchData();
    },
  },
  async created() {
    await this.fetchData();
  },
  methods: {
    ...mapActions("collections", ["fetchOne", "fetchAll"]),

    async fetchData() {
      this.isLoading = true;
      await this.fetchAll();
      this.fetchedData = await this.fetchOne({
        id: this.collectionId,
        numPage: this.numPage,
        pageSize: this.pageSize,
        sortingPriority: this.sortingPriority,
      });
      this.loadAsyncData();
      this.isLoading = false;
    },
    async resetPriority() {
      console.log("reset");
      this.$refs.multiSortTable.resetMultiSorting();
      // reset local backend sorting
      if (this.backendSortingEnabled) {
        this.sortingPriority = [];
        await this.fetchData();
      }
    },

    // Backend sorting
    async sortingPriorityRemoved(field) {
      const newPriority = this.sortingPriority.filter(
        (priority) => priority.field !== field
      );
      this.sortingPriority = [...newPriority];
      console.log(newPriority, this.sortingPriority);
      await this.fetchData();
    },

    async sortPressed(field, order, event) {
      if ((this.customKey && event[this.customKey]) || !this.customKey) {
        let existingPriority = this.sortingPriority.filter((i) => i.field === field)[0];
        if (existingPriority) {
          existingPriority.order = existingPriority.order === "desc" ? "asc" : "desc";
        } else {
          // request sorted data from backend
          this.sortingPriority.push({ field, order });
        }
      } else {
        // request regular sorted data from backend
        this.sortingPriority = []; // [{field, order}]
      }
      // will reload the data
      this.currentPage = 1;
    },

    loadAsyncData() {
      if (this.fetchedData) {
        this.totalCount = this.fetchedData.totalCount;
        this.tableData = this.fetchedData.documents.map((d) => {
          return {
            id: d.id,
            title: d.attributes.title,
            creation: d.attributes.creation,
          };
        });
      }
    },
    /*
     * Handle page-change event
     */
    onPageChange(page) {
      this.currentPage = page;
    },
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/sass/main.scss";

::v-deep .sidebar-content {
  width: 500px;
}

.pagination-goto {
  display: flex;
  float: right;
  position: relative;
  width: 120px;
  margin-left: 50px;
  span {
    width: 100px;
    align-self: center;
  }
  input {
    margin-left: 4px;
    display: inline;
  }
}
progress {
  margin-top: 30px;
}
</style>
