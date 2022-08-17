<template>
  <div class="container">
    <h1>
      蓝筹MINT动态&nbsp;<i
        :class="[
          refresh
            ? 'el-icon-refresh go btn-refresh'
            : 'el-icon-refresh btn-refresh',
        ]"
        @click="refreshData"
      ></i>
    </h1>
    <br />
    <el-timeline>
      <el-timeline-item
        v-for="(item, index) in data"
        :key="index"
        :color="index == 0 ? '#0bbd87' : ''"
        :timestamp="showTime(item.create_time)"
        placement="top"
      >
        <el-card>
          <div class="item-container">
            <el-image
              class="token-icon"
              v-if="item.icon != null && item.icon != ''"
              :src="item.icon"
              lazy
            ></el-image>
            <svg-icon v-else icon-class="no-icon" class="token-icon"></svg-icon>
            <div>
              <el-link
                type="success"
                target="_blank"
                :href="'https://opensea.io/' + item.address"
              >
                <h2 class="mint-name">
                  {{
                    item.nickname == null
                      ? item.address.substr(0,7)
                      : item.nickname
                  }}
                </h2></el-link
              >
              <h2 class="minted">&nbsp;minted&nbsp;</h2>
              <el-link
                type="primary"
                target="_blank"
                :href="
                  'https://opensea.io/assets/ethereum/' + item.contract + '/1'
                "
              >
                <h2 class="mint-name">{{ item.token_name }}</h2></el-link
              >
              <p class="mint-info">
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="查看合约"
                  placement="top"
                >
                  <el-link
                    class="info-link"
                    type="info"
                    target="_blank"
                    :underline="false"
                    :href="'https://etherscan.io/address/' + item.contract"
                    ><svg-icon icon-class="etherscan"></svg-icon
                  ></el-link>
                </el-tooltip>

                <el-tooltip
                  class="item"
                  effect="dark"
                  content="在Opensea中查看"
                  placement="top"
                  v-if="item.opensea != null"
                >
                  <el-link
                    class="info-link"
                    type="info"
                    target="_blank"
                    :underline="false"
                    :href="'https://opensea.io/collection/' + item.opensea"
                    ><svg-icon icon-class="opensea"></svg-icon
                  ></el-link>
                </el-tooltip>

                <el-tooltip
                  v-if="item.twitter != null"
                  class="item"
                  effect="dark"
                  content="项目推特"
                  placement="top"
                >
                  <el-link
                    class="info-link"
                    type="info"
                    target="_blank"
                    :underline="false"
                    :href="'https://www.twitter.com/' + item.twitter"
                    ><svg-icon icon-class="twitter"></svg-icon
                  ></el-link>
                </el-tooltip>

                <el-tooltip
                  v-if="item.discord != null && item.discord != ''"
                  class="item"
                  effect="dark"
                  content="项目Discord"
                  placement="top"
                >
                  <el-link
                    class="info-link"
                    type="info"
                    target="_blank"
                    :underline="false"
                    :href="item.discord"
                    ><svg-icon icon-class="discord"></svg-icon
                  ></el-link>
                </el-tooltip>

                <el-tooltip
                  v-if="item.website != null && item.website != ''"
                  class="item"
                  effect="dark"
                  content="项目网站"
                  placement="top"
                >
                  <el-link
                    class="info-link"
                    type="info"
                    target="_blank"
                    :underline="false"
                    :href="item.website"
                    ><svg-icon icon-class="website"></svg-icon
                  ></el-link>
                </el-tooltip>
              </p>
            </div>
          </div>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>
<script>
import api from "../../api/whale";
import common from "../common/common";
export default {
  data() {
    return {
      refresh: false,
      data: {},
      refreshHandle: null,
      loading: false,
    };
  },
  mounted() {
    this.refreshData();
  },
  methods: {
    showTime(time) {
      return common.computedTime(time);
    },
    query() {
      if (this.loading) return;
      this.loading = true;
      var self = this;
      api.getBlueChipMintList().then(function (res) {
        self.loading = false;
        if (res.success) {
          self.data = res.data;
        } else {
          self.$message.error(data.message);
        }
        if (self.refreshHandle != null) clearTimeout(self.refreshHandle);
        self.refreshHandle = setTimeout(() => {
          self.refreshData();
        }, 30000);
      });
    },
    refreshData() {
      if (this.refresh) return;
      this.refresh = !this.refresh;
      setTimeout(() => {
        this.refresh = !this.refresh;
      }, 1000);
      this.query();
    },
  },
};
</script>
<style scoped scss>
.go {
  transform: rotate(360deg);
  transition: all 1s;
}
.btn-refresh {
  color: #07c4a8;
}
.mint-info {
  font-size: 1.2em;
  margin-top: 1em;
}
.minted {
  height: 24px;
  display: inline-flex;
  vertical-align: middle;
  justify-content: center;
  flex-direction: column;
}
.item-container {
  display: flex;
}
#mint-panel p {
  margin-top: 10px;
}
.info-link {
  margin-left: 10px;
}
.token-icon {
  width: 5em;
  height: 5em;
  border-radius: 50%;
  margin-right: 1em;
}
</style>

