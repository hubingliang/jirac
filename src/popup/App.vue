<template>
  <div id="app">
    <img src="@/assets/main.png" class="border-none logo" alt>
    <h3>{{ name }}</h3>
    <h4 v-if="!isChange" class="margin">
      Project Key
      <span
        class="badge secondary shadow shadow-small shadow-hover project-id"
        @click="resetProjectId"
      >{{projectKey}}</span>
    </h4>
    <input
      class="input-block"
      type="text"
      v-if="isChange"
      placeholder="Project Key"
      v-model="projectKey"
    >

    <section class="parents" v-if="parentTasks && parentTasks.length > 0 && !isCreateTemplate">
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

    <section class="template" ref="template" v-if="isCreateTemplate">
      <div class="card">
        <div class="card-body">
          <h4 class="card-title">{{ title }}</h4>
          <!-- <h5 class="card-subtitle">{{ currentDate() }}</h5> -->
          <p class="card-text">{{ postscript }}</p>
          <table class="table">
            <thead>
              <tr>
                <th>#</th>
                <th>JIRA</th>
                <th>Summary</th>
                <th>Assignee</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item,index) in parentTasks.filter(task=>task.isOnline)" :key="index">
                <td>{{ index + 1 }}</td>
                <td class="key">{{ item.key }}</td>
                <td>{{ item.summary }}</td>
                <td class="name">{{ item.assigneeName }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <h4>
          <span class="badge secondary project-key">{{ projectKey }}</span>
        </h4>
        <div class="title">
          <img src="@/assets/main.png" class="icon border-none" alt>
          <h5>{{ name }}</h5>
        </div>
      </div>
    </section>

    <section v-if="isCreateTemplate">
      <div class="form-group">
        <label>title</label>
        <input type="text" placeholder="title" v-model="title">
      </div>
      <div class="form-group">
        <label>Postscript</label>
        <textarea placeholder="Postscript" v-model="postscript" class="postscript"></textarea>
      </div>
    </section>

    <div class="button-box">
      <button @click="run('sync', projectKey)" v-if="!isChange" class="button">Sync Status</button>
      <button @click="run('getParentTask', projectKey)" v-if="!isChange" class="button">Add Tag</button>
      <button
        class="button"
        @click="isCreateTemplate = true"
        v-if="parentTasks && parentTasks.length > 0 && !isCreateTemplate"
      >Create Template</button>
      <button class="button" @click="exportTemplate" v-if="isCreateTemplate">Export Img</button>
      <button
        v-if="isChange"
        @click="run('updateParentTask', projectKey);isChange = false"
        :disabled="!projectKey"
      >Save</button>
    </div>

    <div class="alert alert-danger" v-if="!isJiraPage">Please open JIRAC on the jira page</div>
  </div>
</template>

<script>
require("babel-polyfill");
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";
import dayjs from "dayjs";

export default {
  name: "app",
  data() {
    return {
      name: "JIRAC",
      projectKey: null,
      isJiraPage: true,
      isChange: false,
      parentTasks: [],
      templateList: [],
      isCreateTemplate: false,
      title: "1.1.1",
      postscript: "PS:"
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
          this.isCreateTemplate = false;
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
      const template = this.$refs.template;
      html2canvas(template).then(canvas => {
        canvas.toBlob(blob => {
          saveAs(blob, "pretty image.png");
        });
      });
    },
    currentDate() {
      return dayjs().format("YYYY-MM-DD HH:mm:ss");
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
    width: 60px;
    height: 60px;
    border: none;
    margin-bottom: 20px;
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
  .postscript {
    width: 25rem;
    height: 200px;
  }
  .template {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    .card {
      width: 27rem;
      position: relative;
      .card-text {
        line-height: 20px;
      }
      .project-key {
        position: absolute;
        right: 25px;
        top: 25px;
      }
      .title {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 20px;
        position: absolute;
        right: 10px;
        bottom: 10px;
        img {
          width: 20px;
          margin: 0;
          margin-right: 5px;
          height: 20px;
        }
      }
      .table {
        margin-bottom: 20px;
        .key {
          width: 60px;
        }
        .name {
          width: 100px;
        }
      }
    }
  }
}
</style>
