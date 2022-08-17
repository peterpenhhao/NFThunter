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
        :timestamp="showTime(item.first_mint)"
        placement="top"
      >
        <el-card>
          <div class="item-container">
            <span class="avatar">
              <h1>{{ index + 1 }}</h1>
              <el-image
                class="token-icon"
                v-if="item.icon != null && item.icon != ''"
                :src="item.icon"
                lazy
              ></el-image>
              <svg-icon
                v-else
                icon-class="no-icon"
                class="token-icon"
              ></svg-icon
            ></span>
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
              <span class="icon-links">
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
                  v-if="item.twitter != null && item.twitter != ''"
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
              </span>

              <p class="mint-info">
                于5分钟内free mint了<b>{{ item.mint_count }}</b
                >次

                <span v-if="item.total_supply > 0">
                  ，总共已Mint：<b
                    >{{ item.total_supply
                    }}<span
                      v-if="item.max_supply != null && item.max_supply != 0"
                      >/{{ item.max_supply }}</span
                    ></b
                  >
                  <b v-if="item.total_supply > 0 && item.max_supply > 0"
                    >（
                    {{
                      Math.floor((item.total_supply / item.max_supply) * 100)
                    }}% ） </b
                  >个
                </span>
                <span v-if="item.owners > 0">
                  ，独立钱包地址：<b>{{ item.owners }}</b
                  >&nbsp;
                  <b v-if="item.total_supply > 0"
                    >（
                    {{ Math.floor((item.owners / item.total_supply) * 100) }}%
                    ） </b
                  >个
                </span>
                <span v-if="item.blue_chip_mint > 0">
                  ，独立蓝筹地址：<el-link
                    @click="showMintCountPanel(item.contract)"
                    class="blue-chip"
                    ><b>{{ item.blue_chip_mint }}</b></el-link
                  >&nbsp;个
                </span>
                <span v-if="item.whale_mint > 0">
                  ，独立巨鲸地址：<b class="whale">{{ item.whale_mint }}</b
                  >&nbsp;个
                </span>
                <span
                  v-if="
                    item.total_supply != null &&
                    item.max_supply != null &&
                    item.max_supply != 0
                  "
                >
                </span>
                <span
                  v-if="
                    item.floor_price != null &&
                    item.floor_price != '0' &&
                    item.floor_price != ''
                  "
                >
                  ，当前地板价：<el-tag type="danger"
                    >{{ item.floor_price }}&nbsp;ETH</el-tag
                  >
                </span>
              </p>
            </div>
          </div>
          <div class="pic-list">
            <div
              class="pic-item"
              v-for="(pic, picIndex) in item.pics"
              :key="picIndex"
            >
              <el-image
                class="pic-item-img"
                v-if="
                  pic.image_url != null &&
                  pic.image_url != '' &&
                  pic.image_url.indexOf('lh3.googleusercontent.com') > 0
                "
                :src="pic.image_url + '=w150'"
                lazy
              ></el-image>
              <el-image
                class="pic-item-img"
                v-else-if="pic.image_url != null && pic.image_url != ''"
                :src="pic.image_url"
                lazy
              >
              </el-image>
              <el-image
                v-else
                class="pic-item-img"
                :src="item.icon"
                lazy
              ></el-image>
              <div>#{{ pic.token_id }}</div>
            </div>
          </div>
          <el-badge
            style="margin-top: 20px"
            :value="item.is_free == true ? 'Free' : ''"
          >
            <el-button
              round
              type="primary"
              class="btn-mint"
              :icon="item.open ? 'el-icon-caret-bottom' : 'el-icon-caret-right'"
              @click="showMintList(item.contract)"
              :loading="item.loading"
              >去MINT</el-button
            ></el-badge
          >
          <div
            class="mint-detail"
            v-if="item.mint_list != null && item.mint_list.length > 0"
          >
            <div
              class="mint-list"
              v-if="item.mint_list != null && item.mint_list.length > 0"
            >
              <el-button
                v-for="(mintItem, mintIndex) in item.mint_list"
                :key="mintIndex"
                type="primary"
                class="btn-mint-item"
                icon="el-icon-caret-right"
                @click="
                  showMintPanel(
                    item.contract,
                    item.token_name,
                    mintItem.nft_count,
                    mintItem.method,
                    mintItem.mint_value
                  )
                "
                >{{
                  mintItem.mint_value == "0 Ether"
                    ? "Free "
                    : "花费 " + mintItem.mint_value + " "
                }}Mint <b>&nbsp;{{ mintItem.nft_count }}&nbsp;</b>个（方法名：{{
                  mintItem.method
                }}）</el-button
              >
            </div>
            <div
              class="top-minters"
              v-if="
                item.top_minter_list != null && item.top_minter_list.length > 0
              "
            >
              <el-card class="box-card">
                <div slot="header" class="clearfix">
                  <b>Top Minters</b>
                </div>
                <div
                  class="top-minter-item"
                  v-for="(topMinter, minterIndex) in item.top_minter_list"
                  :key="minterIndex"
                >
                  <el-link
                    target="_blank"
                    :href="
                      'https://etherscan.io/address/' + topMinter.to_address
                    "
                    type="primary"
                    >{{ topMinter.to_address }}</el-link
                  >&nbsp;Mint&nbsp;了<b>{{ topMinter.mint_count }}</b
                  >个
                </div>
              </el-card>
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
        <!-- <el-form-item label="交互合约地址：" label-width="120px">
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
        </el-form-item> -->
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

    <el-dialog
      id="mint-count-panel"
      title="蓝筹 Mints"
      :close-on-click-modal="false"
      :visible.sync="dialogMintCountVisible"
    >
      <el-table
        height="550"
        :data="blueChipMintCountData"
        style="width: 100%"
        v-loading="loadingMintCount"
      >
        <el-table-column prop="nickname" label="蓝筹">
          <template slot-scope="scope">
            <span style="margin-left: 10px"
              ><el-link
                target="_blank"
                type="primary"
                :href="'https://etherscan.io/address/' + scope.row.address"
                >{{
                  scope.row.nickname == null || scope.row.nickname == ""
                    ? scope.row.address.substring(0, 6) +
                      "..." +
                      scope.row.address.substring(scope.row.address.length - 4)
                    : scope.row.nickname
                }}</el-link
              ></span
            >
          </template>
        </el-table-column>
        <el-table-column prop="source_list" label="参与项目">
          <template slot-scope="scope">
            {{ scope.row.source_list.toString() }}
          </template>
        </el-table-column>
        <el-table-column prop="mint_count" label="Mint 个数" width="100">
        </el-table-column>
      </el-table>
      <!-- <el-pagination
        :page-size="10"
        :pager-count="11"
        layout="prev, pager, next"
        :total="mintCountTotalItems"
      >
      </el-pagination> -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogMintCountVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Web3 from "web3";
import api from "../../api/mint.js";
import apiWhale from "../../api/whale";
import common from "../common/common";
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
      dialogMintCountVisible: false,
      currentContract: {},
      loading: false,
      loadingContract: false,
      loadingMintCount: false,
      params: [],
      //panelLoading: false,
      panelTitle: "",
      mintCountTotalItems: 0,
      blueChipMintCountData: [],
    };
  },
  mounted() {
    this.refreshData();
  },
  beforeDestroy() {
    console.log("beforeDestroy");
    if (this.refreshHandle) clearInterval(this.refreshHandle);
  },
  methods: {
    showMintList(contract) {
      let self = this;
      //收起
      for (var i in self.data) {
        if (self.data[i].contract == contract) {
          if (
            self.data[i].mint_list != null &&
            self.data[i].mint_list.length > 0
          ) {
            self.data[i].mint_list = [];
            self.data[i].open = false;
            self.$forceUpdate();
            return;
          } else {
            self.data[i].loading = true;
            self.$forceUpdate();
            break;
          }
        }
      }
      //打开
      var param = {};
      param.contract_address = contract;

      api.getMintList(param).then(function (res) {
        if (res.success) {
          for (var i in self.data) {
            if (self.data[i].contract == contract) {
              self.data[i].mint_list = res.data.mint_sample_list;
              self.data[i].top_minter_list = res.data.top_minter_list;
              self.data[i].loading = false;
              self.data[i].open = true;
              self.$forceUpdate();
              break;
            }
          }
          self.data.mint_list = res.data.mint_sample_list;
        } else {
          self.$message.error("获取MINT列表失败，请稍后再试...");
        }
      });
    },
    showTime(time) {
      return common.computedTime(time);
    },
    decodeABI(input, contractABI) {
      abiDecoder.addABI(contractABI);
      let decodedData = abiDecoder.decodeMethod(input); //获得解析数据
      return decodedData; //返回解析后的数据
    },
    showMintCountPanel(contract) {
      this.blueChipMintCountData = [];
      this.dialogMintCountVisible = true;
      this.loadingMintCount = true;
      let self = this;
      var param = { page: 1, rows: 1000, contract: contract };
      apiWhale.getBlueChipMintCount(param).then(function (res) {
        self.loadingMintCount = false;
        if (res.success) {
          self.blueChipMintCountData = res.data.Items;
          self.mintCountTotalItems = res.data.TotalItems;
        } else {
          self.$message.error("获取蓝筹mint信息失败，请稍后再试...");
          self.dialogMintCountVisible = false;
        }
      });
    },
    showMintPanel(contract, title, nftCount, method, mintValue) {
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
      param.contract_address = contract;
      param.nft_count = nftCount;
      param.method = method;
      param.mint_value = mintValue;
      api.getSampleMint(param).then(function (res) {
        if (res.success) {
          mintInfo.transactionHash = res.data.transaction_hash;
          mintInfo.method = res.data.method;
          mintInfo.inputData = res.data.input_data;
          mintInfo.interactContractAddress = res.data.interact_contract;
          self.currentContract = mintInfo;
          //if (res.data.is_compiled) {
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
          //}
          // else {
          //   api.getAbi(mintInfo.interactContract).then(function (apiRes) {
          //     if (apiRes.status == "0" && apiRes.message == "NOTOK") {
          //       self.$message.error("交互合约未编译");
          //     } else if (apiRes.status == "1") {
          //       let abi = JSON.parse(apiRes.result);
          //       var decodeResult = self.decodeABI(res.data.input_data, abi);
          //       if (decodeResult == null) {
          //         self.$message.error("解析mint参数失败");
          //       } else {
          //         self.params = decodeResult.params;
          //         self.currentContract.abi = abi;
          //       }
          //     }
          //     self.loadingContract = false;
          //   });
          // }
        } else {
          self.$message.error("获取MINT方法失败，请稍后再试...");
          self.dialogVisible = false;
        }
      });
    },
    mint() {
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
      this.refresh = true;
      setTimeout(() => {
        this.refresh = false;
      }, 1000);
      this.loading = true;
      var self = this;
      try {
        api.getFreeMintList().then(function (res) {
          self.loading = false;
          if (res.success) {
            if (res.data != null && res.data.length > 0) {
              if (self.data != null && self.data.length > 0) {
                for (var i in res.data) {
                  var matchItem = self.data.filter(function (m) {
                    return m.contract === res.data[i].contract;
                  });

                  if (
                    matchItem != null &&
                    matchItem.length > 0 &&
                    matchItem[0].mint_list != null &&
                    matchItem[0].mint_list.length > 0
                  ) {
                    res.data[i].mint_list = matchItem[0].mint_list;
                    res.data[i].top_minter_list = matchItem[0].top_minter_list;
                    res.data[i].loading = matchItem[0].loading;
                    res.data[i].open = matchItem[0].open;
                  }
                }
              }
              self.data = res.data;
            }
          } else {
            self.$message.error(data.message);
          }
          // if (self.refreshHandle != null) clearTimeout(self.refreshHandle);
          // self.refreshHandle = setTimeout(() => {
          //   self.refreshData();
          // }, 30000);
        });
      } catch { self.loading = false;}
    },
    refreshData() {
      if (this.refreshHandle) clearInterval(this.refreshHandle);
      this.refreshHandle = setInterval(this.query, 30000);
      this.query();
    },
  },
};
</script>
<style scoped scss>
.avatar {
  display: flex;
  align-items: center;
}
.avatar h1 {
  display: block;
  width: 2em;
  color: #00d1b2;
}
.icon-links {
  margin-top: 0.5em;
}
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
.btn-mint-item {
  margin-bottom: 10px;
  margin-left: 0 !important;
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
.pic-list {
  display: flex;
}
.pic-item {
  padding: 20px 10px 20px 10px;
}
.pic-item-img {
  width: 150px !important;
  height: 150px !important;
}
.mint-detail {
  display: flex;
  background: #f5f5f5;
  padding: 10px;
  margin-top: 20px;
}
.mint-list {
  width: 450px;
  display: flex;
  flex-direction: column;
}
.mint-list button {
  width: 450px;
}
.top-minters {
  display: flex;
  flex-direction: column;
  padding-left: 20px;
}
.top-minter-item {
  padding-bottom: 10px;
}
.blue-chip {
  color: #409eff;
  font-size: 1.1em;
}
.whale {
  color: #f56c6c;
}
</style>
<style>
.el-dialog__header {
  background: #f5f5f5;
}
.el-timeline-item__tail {
  display: none;
}
</style>
