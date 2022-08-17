<template>
  <div class="container">
    <h1>NFT 收益明细</h1>
    <div class="main">
      <div class="main-left">
        <el-input
          placeholder="请输入钱包地址"
          v-model="searchAddress"
          clearable
          class="input-search-address"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="query()"
          ></el-button>
        </el-input>
        <el-table
          :data="tableData"
          stripe
          style="width: 100%; margin-top: 20px"
          v-loading="loading"
        >
          <el-table-column label="NFT">
            <template slot-scope="scope">
              <el-link
                target="_blank"
                :underline="false"
                :href="
                  'https://opensea.io/assets/ethereum/' +
                  scope.row.contract_address +
                  '/' +
                  scope.row.token_id
                "
              >
                <b>{{ scope.row.token_name }}</b>
                <div class="token-id">#{{ scope.row.token_id }}</div>
              </el-link>
            </template>
          </el-table-column>
          <el-table-column label="买入价（Ether）">
            <template slot-scope="scope">
              <el-link
                target="_blank"
                :underline="false"
                :href="'https://etherscan.io/tx/' + scope.row.in_transaction"
              >
                <b class="nft-value">{{ scope.row.in_value.toFixed(5) }}</b>
                <div class="gas">gas:{{ scope.row.in_gas.toFixed(5) }}</div>
              </el-link>
            </template>
          </el-table-column>
            <el-table-column label="买入方式">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.from_address=='0x0000000000000000000000000000000000000000'" >Mint</el-tag>
              <el-tag v-else-if="scope.row.in_value==0" type="success">Receive</el-tag>
              <el-tag v-else-if="scope.row.in_value>0" type="info">Buy</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="in_date" label="买入日期"></el-table-column>
          <el-table-column prop="out_value" label="卖出价（Ether）">
            <template slot-scope="scope"
              ><el-link
                target="_blank"
                :underline="false"
                :href="'https://etherscan.io/tx/' + scope.row.out_transaction"
              >
                <b class="nft-value">{{ scope.row.out_value.toFixed(5) }}</b>
                <div class="gas">gas:{{ scope.row.out_gas.toFixed(5) }}</div>
              </el-link></template
            >
          </el-table-column>
          <el-table-column prop="out_date" label="卖出日期"></el-table-column>
          <el-table-column label="盈利（Ether）">
            <template slot-scope="scope">
              <b
                v-if="
                  scope.row.out_value - scope.row.in_value - scope.row.in_gas >
                  0
                "
                class="win nft-value"
                >+{{
                  (
                    scope.row.out_value -
                    scope.row.in_value -
                    scope.row.in_gas
                  ).toFixed(5)
                }}</b
              >
              <b
                v-else-if="
                  scope.row.out_value - scope.row.in_value - scope.row.in_gas <
                  0
                "
                class="lose nft-value"
                >{{
                  (
                    scope.row.out_value -
                    scope.row.in_value -
                    scope.row.in_gas
                  ).toFixed(5)
                }}</b
              >
              <b v-else> 0 </b>
            </template></el-table-column
          >
          <el-table-column label="持有时间" width="200">
            <template slot-scope="scope">
              <i class="el-icon-time"></i>
              <span style="margin-left: 10px">{{
                showTime(scope.row.in_date, scope.row.out_date)
              }}</span>
            </template></el-table-column
          ></el-table
        >
        <el-pagination
          style="margin-top: 20px"
          background
          layout="prev, pager, next"
          :total="totalItems"
          :page-size="rows"
          @current-change="handleChangePage"
        >
        </el-pagination>
      </div>

      <div class="main-right">
        <div class="main-right-row main-right-title">
          <div>盈利次数</div>
          <div>亏损次数</div>
        </div>
        <div class="main-right-row">
          <div>
            <b class="win">{{ winCount }}</b>
          </div>
          <div>
            <b class="lose">{{ loseCount }}</b>
          </div>
        </div>
        <div class="main-right-row main-right-sub">
          <div>
            {{
              winCount + loseCount > 0
                ? Math.round((winCount * 100) / (winCount + loseCount)) + "%"
                : ""
            }}
          </div>
          <div>
            {{
              winCount + loseCount > 0
                ? Math.round((loseCount * 100) / (winCount + loseCount)) + "%"
                : ""
            }}
          </div>
        </div>
        <div class="main-right-row main-right-title">
          <div>总支出</div>
          <div>总收益</div>
        </div>
        <div class="main-right-row main-right-content">
          <div>
            <b>{{ totalSpend }}</b>
          </div>
          <div>
            <b>{{ totalProfit }}</b>
          </div>
        </div>
        <div>Mint次数：{{mintCount}}</div>
      </div>
    </div>
  </div>
</template>
<script>
import api from "../../api/userProfit.js";
import common from "../common/common";
export default {
  data() {
    return {
      page: 1,
      rows: 10,
      searchAddress: "",
      tableData: [],
      loading: false,
      totalItems: 0,
      winCount: "--",
      loseCount: "--",
      totalSpend: "--",
      totalProfit: "--",
      mintCount:"--"
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      console.log(this.$route.query.address);
      this.searchAddress =
        this.$route.query.address == null ? "" : this.$route.query.address;
      this.query();
      this.queryGeneralData();
    },
    handleChangePage(currentPage) {
      this.page = currentPage;
      this.query();
    },
    queryGeneralData() {
      if (this.searchAddress == null || this.searchAddress == "") return;
      var self = this;
      var param = {
        page: 1,
        rows: 1,
        address: this.searchAddress,
      };
      try {
        api.searchUserProfit(param).then(function (res) {
          if (res.success) {
            if (res.data.TotalItems > 0) {
              var genData = res.data.Items[0];
              console.log(genData);
              self.totalProfit = genData.total_profit.toFixed(5);
              self.totalSpend = genData.total_spend.toFixed(5);
              self.winCount = genData.win;
              self.loseCount = genData.lose;
              self.mintCount = genData.mint_count;
            }
          } else {
            self.$message.error(res.message);
          }
        });
      } catch {}
    },
    query() {
      if (
        this.loading ||
        this.searchAddress == null ||
        this.searchAddress == ""
      )
        return;
      this.loading = true;
      var self = this;
      var param = {
        page: this.page,
        rows: this.rows,
        address: this.searchAddress,
      };
      try {
        api.searchUserProfitDetail(param).then(function (res) {
          self.loading = false;
          if (res.success) {
            self.tableData = res.data.Items;
            self.totalItems = res.data.TotalItems;
          } else {
            self.$message.error(res.message);
          }
        });
      } catch {
        self.loading = false;
      }
    },
    showTime(from, to) {
      return common.computeTimespan(from, to);
    },
  },
};
</script>
<style scoped scss>
.main {
  margin-top: 25px;
  display: flex;
}
.main-left {
  flex-grow: 1;
}
.main-right {
  border: 2px solid #eee;
  border-radius: 10px;
  margin-left: 20px;
  width: 200px;
  height: 200px;
  padding: 25px;
  background: #fcfcfc;
  color: #333;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.main-right-row {
  display: flex;
}
.main-right-title {
  height: 30px;
}
.main-right-sub {
  height: 30px;
  color:#888;
  padding-top: 10px;
}
.main-right-content {
  height: 50px;
}
.main-right-row div {
  flex-grow: 1;
}
.main-right b {
  font-size: 20px;
}
.nft-value {
  font-size: 18px;
}
.input-search-address {
  width: 400px;
}
.token-id {
  color: #3e71f6;
}
.win {
  color: #17c964;
}
.lose {
  color: #ff494a;
}
</style>
