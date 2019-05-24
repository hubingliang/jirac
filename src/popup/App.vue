<template>
  <div id="app">
    <img src="@/assets/main.png" class="border-none" alt>
    <h3 class="margin">{{ msg }}</h3>
    <h4 v-if="!isChange" class="margin">
      Project Key
      <span
        class="badge secondary shadow shadow-small shadow-hover project-id"
        @click="resetProjectId"
      >{{projectKey}}</span>
    </h4>
    <div class="row">
      <input
        class="input-block"
        type="text"
        v-if="isChange"
        placeholder="Project Key"
        v-model="projectKey"
      >
      <button
        v-if="isChange"
        @click="run('updateParentTask', projectKey);isChange = false"
        :disabled="!projectKey"
      >Save</button>
    </div>
    <section class="parents" v-if="parentTasks && parentTasks.length>0">
      <div
        class="card"
        v-for="(task,index) in parentTasks"
        :key="index"
        @click="run('changeStatus',{ task, projectKey })"
      >
        <div class="card-body" :class="{'background-warning': task.isOnline}">
          <h4 class="card-title">{{ task.key }}</h4>
          <h5 class="card-subtitle">{{ task.assigneeName }}</h5>
          <p class="card-text">{{ task.summary }}</p>
        </div>
        <div class="card-footer">
          <span>{{ task.statusName }}</span>
        </div>
      </div>
    </section>

    <div class="button-box">
      <button @click="run('sync', projectKey)" :disabled="isChange" class="button">Sync Status</button>
      <button @click="run('getParentTask', projectKey)" :disabled="isChange" class="button">Add Tag</button>
      <button
        class="button"
        @click="exportTemplate"
        v-if="parentTasks && parentTasks.length>0"
      >Export Template</button>
    </div>
    <div class="alert alert-danger" v-if="!isJiraPage">Please click the button on the jira page</div>
  </div>
</template>

<script>
require("babel-polyfill");
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";

export default {
  name: "app",
  data() {
    return {
      msg: "JIRA SYNC",
      projectKey: null,
      isJiraPage: true,
      isChange: false,
      parentTasks: []
    };
  },
  created() {
    const projectKey = localStorage.getItem("projectKey");
    if (projectKey) {
      this.projectKey = projectKey;
      this.run("updateParentTask", projectKey);
    } else {
      this.isChange = true;
    }
  },
  methods: {
    async run(action, payload) {
      switch (action) {
        case "sync":
          localStorage.setItem("projectKey", payload);
          this.callJira(action, payload);
          break;
        case "updateParentTask":
          localStorage.setItem("projectKey", payload);
          this.callJira(action, payload);
          break;
        case "getParentTask":
          await this.callJira("updateParentTask", payload);
          this.callJira("getParentTask", payload);
          break;
        case "changeStatus":
          this.callJira(action, payload);
          break;
        case "reset":
          this.callJira(action);
        default:
          break;
      }
    },
    resetProjectId() {
      localStorage.removeItem("projectKey");
      this.parentTasks = [];
      this.isChange = true;
      this.run("reset");
    },
    callJira(action, value = null) {
      chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        if (!tabs[0].url.includes("jira")) {
          this.isJiraPage = false;
        } else {
          chrome.tabs.sendMessage(
            tabs.length ? tabs[0].id : null,
            { action, value },
            response => {
              this.parentTasks = response;
            }
          );
        }
      });
    },
    exportTemplate() {
      html2canvas(document.body).then(canvas => {
        canvas.toBlob(blob => {
          saveAs(blob, "pretty image.png");
        });
      });
    }
  }
};
</script>
<style lang="scss">
@import "../paper.min.css";
html,
body {
  min-width: 300px;
}
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
*::-webkit-scrollbar {
  width: 0 !important;
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
  .project-id {
    cursor: pointer;
  }
  .button-box {
    display: flex;
    justify-content: space-around;
    min-width: 300px;
    button {
      margin: 20px 10px;
    }
  }
  .parents {
    display: flex;
    width: 600px;
    flex-wrap: wrap;
    justify-content: space-around;
    padding: 20px;
    .card {
      cursor: pointer;
      width: 240px;
      margin-bottom: 20px;
    }
  }
}
</style>
