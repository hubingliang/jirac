<template>
  <div id="app">
    <img src="@/assets/main.png" class="border-none" alt>
    <h3>{{ msg }}</h3>
    <h4 v-if="!isChange">
      Project Key
      <span class="badge secondary">{{projectKey}}</span>
    </h4>
    <input
      class="input-block"
      type="text"
      v-if="isChange"
      placeholder="Project Key"
      v-model="projectKey"
    >
    <div class="row">
      <button @click="reset" v-if="!isChange" class="button">Reset project key</button>
      <button @click="sync" :disabled="!projectKey" class="button">Start sync</button>
    </div>

    <div class="alert alert-danger" v-if="!isJiraPage">Please click the button on the jira page</div>

    <!-- <button @click="sync">sync</button> -->
  </div>
</template>

<script>
export default {
  name: "app",
  data() {
    return {
      msg: "JIRA SYNC",
      projectKey: null,
      isJiraPage: true,
      isChange: false
    };
  },
  created() {
    const projectKey = localStorage.getItem("projectKey");
    if (projectKey) {
      this.projectKey = projectKey;
    } else {
      this.isChange = true;
    }
  },
  methods: {
    sync() {
      localStorage.setItem("projectKey", this.projectKey);
      chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        if (!tabs[0].url.includes("jira")) {
          this.isJiraPage = false;
        } else {
          chrome.tabs.sendMessage(
            tabs.length ? tabs[0].id : null,
            this.projectKey,
            function(response) {}
          );
          this.isChange = false;
        }
      });
    },
    reset() {
      this.isChange = true;
    }
  }
};
</script>
<style lang="scss">
@import "../paper.min.css";
html,
body {
  width: 300px;
}

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-wrap: wrap;
  padding-top: 30px;
  img {
    width: 80px;
    height: 80px;
    border: none;
  }
  button {
    margin-top: 20px;
  }
}
</style>
