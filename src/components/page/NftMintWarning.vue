<template>
  <div class="container">
    <h1>
      NFT MINT&nbsp;<i
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
                type="primary"
                target="_blank"
                :href="
                  'https://opensea.io/assets/ethereum/' + item.contract + '/1'
                "
              >
                <h2 class="mint-name">{{ item.token_name }}</h2></el-link
              >
              <el-button
                round
                type="primary"
                class="btn-mint"
                icon="el-icon-caret-right"
                @click="showMintPanel(item.contract, item.token_name)"
                >去MINT</el-button
              >
              <p class="mint-info">
                于5分钟内mint了<b>{{ item.mint_count }}</b
                >次
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
    <el-dialog
      id="mint-panel"
      :title="panelTitle"
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
      width="700px"
    >
      <el-form v-loading="loadingContract" label-width="auto">
        <el-form-item label="TOKEN地址：" label-width="120px">
          {{ currentContract.contractAddress }}
          <el-link
            target="_blank"
            icon="el-icon-view"
            :underline="false"
            type="primary"
            :href="
              'https://etherscan.io/token/' + currentContract.contractAddress
            "
          ></el-link>
        </el-form-item>
        <el-form-item label="交互合约地址：" label-width="120px">
          {{ currentContract.interactContractAddress }}
          <el-link
            target="_blank"
            type="primary"
            icon="el-icon-view"
            :underline="false"
            :href="
              'https://etherscan.io/address/' +
              currentContract.interactContractAddress
            "
          ></el-link>
        </el-form-item>
        <el-form-item label="原交易HASH：" label-width="120px">
          {{ currentContract.transactionHash }}
          <el-link
            target="_blank"
            type="primary"
            icon="el-icon-view"
            :underline="false"
            :href="'https://etherscan.io/tx/' + currentContract.transactionHash"
          ></el-link>
        </el-form-item>
        <el-form-item label="执行操作：" label-width="120px">
          <b>{{ currentContract.method }}</b>
        </el-form-item>
        <el-form-item label="16进制数据：" label-width="120px">
          <el-input
            type="textarea"
            :disabled="true"
            :rows="4"
            v-model="currentContract.inputData"
          />
        </el-form-item>
        <el-form-item
          v-for="(item, index) in params"
          :key="index"
          :label="item.name"
          label-width="120px"
        >
          <el-input v-model="item.value" />
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="mint()" :disabled="minting"
          >开始MINT</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Web3 from "web3";
import api from "../../api/mint.js";
import common from "../common/common.js";
const abiDecoder = require("abi-decoder");
window.Web3 = Web3;
export default {
  data() {
    return {
      minting: false,
      refresh: false,
      data: {},
      refreshHandle: null,
      dialogVisible: false,
      currentContract: {},
      loading: false,
      loadingContract: false,
      params: [],
      panelLoading: false,
      panelTitle: "",
    };
  },
  mounted() {
    this.refreshData();
  },
  methods: {
    showTime(time){
      return common.computedTime(time);
    },
    decodeABI(input, contractABI) {
      abiDecoder.addABI(contractABI);
      let decodedData = abiDecoder.decodeMethod(input); //获得解析数据
      return decodedData; //返回解析后的数据
    },
    showMintPanel(contract, title) {
      if (
        document.getElementById("span_account") == undefined ||
        document.getElementById("span_account").title == undefined
      ) {
        this.$message.error("请先连接metamask钱包");
        return;
      }
      var account = document.getElementById("span_account").title;
      this.minting = false;
      this.dialogVisible = true;
      this.panelTitle = title;
      this.loadingContract = true;
      this.currentContract = {};
      this.params = [];
      let self = this;
      let mintInfo = {};
      mintInfo.contractAddress = contract;
      var param = {};
      param.contract = contract;
      param.is_free = false;
      api.getMintMethod(param).then(function (res) {
        if (res.success) {
          mintInfo.transactionHash = res.data.transaction_hash;
          mintInfo.method = res.data.method;
          mintInfo.inputData = res.data.input_data;
          mintInfo.interactContractAddress = res.data.interact_contract;
          self.currentContract = mintInfo;
          if (res.data.is_compiled) {
            let abi = JSON.parse(res.data.abi);
            var decodeResult = self.decodeABI(res.data.input_data, abi);
            if (decodeResult == null) {
              self.$message.error("解析mint参数失败");
            } else {
              for (var i = 0; i < decodeResult.params.length; i++) {
                var paramItem = decodeResult.params[i];
                var paramValue = paramItem.value.toString();
                if (paramItem.type == "address") paramItem.value = account;
                else paramItem.value = paramValue;
                self.params.push(paramItem);
              }
              console.log("self.params", self.params);
              self.currentContract.abi = abi;
              console.log("currentContract", self.currentContract);
            }
            self.loadingContract = false;
          } else {
            api.getAbi(mintInfo.interactContract).then(function (apiRes) {
              if (apiRes.status == "0" && apiRes.message == "NOTOK") {
                self.$message.error("交互合约未编译");
              } else if (apiRes.status == "1") {
                let abi = JSON.parse(apiRes.result);
                var decodeResult = self.decodeABI(res.data.input_data, abi);
                if (decodeResult == null) {
                  self.$message.error("解析mint参数失败");
                } else {
                  self.params = decodeResult.params;
                  self.currentContract.abi = abi;
                }
              }
              self.loadingContract = false;
            });
          }
        } else {
          self.$message.error("获取MINT方法失败，请稍后再试...");
          self.dialogVisible = false;
        }
      });
    },
    mint() {
      console.log(this.params);
      if (
        document.getElementById("span_account") == undefined ||
        document.getElementById("span_account").title == undefined
      ) {
        this.$message.error("请先连接metamask钱包");
        return;
      }
      var account = document.getElementById("span_account").title;
      if (window.web3 != null) {
        this.minting = true;
        let contractInfo = this.currentContract;
        if (contractInfo.abi != null && contractInfo.abi != "") {
          this.createScrpit(
            account,
            contractInfo.interactContractAddress,
            contractInfo.abi,
            contractInfo.method,
            this.params
          );
          runScript();
        }
      } else {
        self.$message.error("请先安装metamask钱包");
      }
    },
    createScrpit(account, contract, abi, method, params) {
      console.log("params", params);
      var scriptId = "dynamicScript";
      var scriptTag = document.getElementById(scriptId);
      if (scriptTag != null) scriptTag.remove();
      var script = document.createElement("script");
      script.id = scriptId;
      script.type = "text/javascript";
      let param = "";
      for (var i = 0; i < params.length; i++) {
        if (i != 0) {
          param += ",";
        }
        param += `"${params[i].value + ""}"`;
      }
      var code = `function runScript(){
        var web3js = new window.Web3(window.web3.currentProvider);
        var contractAddress = "${contract}";
        var abi = ${JSON.stringify(abi)};
        var myContract = new web3js.eth.Contract(abi, contractAddress,{from:"${account}"});
        myContract.methods.${method}(${param}).send();
      }`;
      console.log("code", code);
      script.text = code;
      var head = document.getElementsByTagName("head").item(0);
      head.appendChild(script);
      //console.log(script);
    },
    query() {
      if (this.loading) return;
      this.loading = true;
      var self = this;
      api.getMintList().then(function (res) {
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
.mint-info {
  font-size: 1.2em;
  margin-top: 1em;
}
.go {
  transform: rotate(360deg);
  transition: all 1s;
}
.btn-refresh {
  color: #07c4a8;
}
.item-container {
  display: flex;
}
.btn-mint {
  margin-left: 20px;
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
<style>
.el-dialog__header {
  background: #f5f5f5;
}
</style>
