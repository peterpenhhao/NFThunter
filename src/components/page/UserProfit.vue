<template>
  <div class="container">
    <h1>NFT 收益统计</h1>
    <div style="margin-top: 25px">
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
        <el-table-column type="index" width="50" :index="calcIndex">
        </el-table-column>
        <el-table-column label="钱包地址">
          <template slot-scope="scope">
            <div style="display: flex">
              {{
                scope.row.address.substring(0, 7) +
                "..." +
                scope.row.address.substring(scope.row.address.length - 4)
              }}
              &nbsp;<el-link :underline="false"
                ><i
                  class="el-icon-copy-document"
                  @click="handelCopyLink(scope.row.address)"
                ></i>
              </el-link>
              <el-link
                target="_blank"
                :href="'https://etherscan.io/address/' + scope.row.address"
                :underline="false"
                ><i class="el-icon-view el-icon--right"></i>
              </el-link>
            </div>
          </template>
        </el-table-column>
         <el-table-column prop="mint_count" label="Mint次数"></el-table-column>
        <el-table-column label="盈利（次）">
          <template slot-scope="scope">
            <b class="win">{{ scope.row.win }}</b>
          </template>
        </el-table-column>
        <el-table-column label="亏损（次）">
          <template slot-scope="scope">
            <b class="lose">{{ scope.row.lose }}</b>
          </template>
        </el-table-column>
        <el-table-column prop="win" label="胜率">
          <template slot-scope="scope">
            <b class="win">
              {{
                scope.row.win + scope.row.lose > 0
                  ? Math.round(
                      (scope.row.win * 100) / (scope.row.win + scope.row.lose)
                    ) + "%"
                  : "--"
              }}</b
            >
          </template>
        </el-table-column>
        <el-table-column label="总花费（Ether）">
          <template slot-scope="scope">
            <b class="lose">
              {{ scope.row.total_spend.toFixed(5) }}</b
            ></template
          >
        </el-table-column>
        <el-table-column label="总盈利（Ether）">
          <template slot-scope="scope">
            <b class="win">
              {{ scope.row.total_profit.toFixed(5) }}</b
            ></template
          >
        </el-table-column>
        <el-table-column label="更新时间">
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px">{{
              showTime(scope.row.last_update_time)
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="明细">
          <template slot-scope="scope">
            <router-link
              class="operation"
              :to="'/user-profit-detail?address=' + scope.row.address"
            >
              查看
            </router-link>
          </template>
        </el-table-column>
      </el-table>
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
  </div>
</template>
<script>
import api from "../../api/userProfit.js";
import common from "../common/common";
export default {
  name: "UserProfit",
  data() {
    return {
      page: 1,
      rows: 10,
      searchAddress: "",
      tableData: [],
      loading: false,
      totalItems: 0,
    };
  },
  mounted() {
    this.query();
  },
  methods: {
    calcIndex(index) {
      return (this.page - 1) * this.rows + index + 1;
    },
    handelCopyLink(val) {
      let self = this;
      this.$copyText(val).then(
        function (e) {
          self.$notify({
            title: "地址复制成功",
            type: "success",
            duration: 2000,
          });
        },
        function (e) {
          self.$notify({
            title: "地址复制失败",
            type: "error",
            duration: 2000,
          });
        }
      );
    },
    handleChangePage(currentPage) {
      this.page = currentPage;
      this.query();
    },
    showDetail(address) {
      console.log(address);
    },
    query() {
      if (this.loading) return;
      this.loading = true;
      var self = this;
      var param = {
        page: this.page,
        rows: this.rows,
        address: this.searchAddress,
      };
      try {
        api.searchUserProfit(param).then(function (res) {
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
    showTime(time) {
      return common.computedTime(time);
    },
  },
};
</script>
<style scoped scss>
.input-search-address {
  width: 400px;
}
.operation {
  color: #409eff;
  text-decoration: n;
}
.lose {
  color: #ff494a;
}
.win {
  color: #17c964;
}
</style>
