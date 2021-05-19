<template>
  <el-card style="min-height: calc(100vh - 126px);">
    <!-- 表格操作 -->
    <div class="operation-container">
      <el-button
              type="danger"
              size="small"
              icon="el-icon-deleteItem"
              :disabled="articleIdList.length === 0"
              @click="isDelete = true"
      >
        批量删除
      </el-button>

      <div style="margin-left:auto">
        <el-input
                v-model="title"
                prefix-icon="el-icon-search"
                size="small"
                placeholder="请输入博客标题"
                style="width:200px"
        />
        <el-button
                type="primary"
                size="small"
                icon="el-icon-search"
                style="margin-left:1rem"
                @click="getList"
        >
          搜索
        </el-button>
      </div>
    </div>

    <!-- 表格展示 -->
    <el-table
        border
        :data="articleList"
        @selection-change="selectionChange"
    >
      <!-- 表格列 -->
      <el-table-column type="selection" width="55" />

      <!-- 标签名 -->
      <el-table-column prop="articleTitle" label="标题" align="center">
        <template slot-scope="scope">
          <el-tag>
            {{ scope.row.title }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="categoryName" label="分类" align="center" width="100px">
        <template slot-scope="scope">
          <el-tag>
            {{ scope.row.categoryName}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="tagsName" label="标签" align="center" width="200px">
        <template slot-scope="scope">
            <el-tag
                    v-for="item of scope.row.tagsName"
                    :key="item.tagsName"
                    style="display: inline-flex;margin-right:0.2rem;font-size: 5px"
            >
              {{ item }}
            </el-tag>
        </template>
      </el-table-column>
      <!-- 标签创建时间 -->
      <el-table-column prop="createTime" label="创建时间" align="center">
        <template slot-scope="scope">
          <i   class="el-icon-time" style="margin-right:5px" />
          {{ scope.row.createTime }}
        </template>
      </el-table-column>
      <!-- 标签更新时间 -->
      <el-table-column prop="updateTime" label="更新时间" align="center">
        <template slot-scope="scope">
          <i class="el-icon-time" style="margin-right:5px" />
          {{ scope.row.updateTime }}
        </template>
      </el-table-column>
<!--      置顶-->
      <el-table-column prop="isTop" label="置顶" width="100" align="center">
        <template slot-scope="scope">
          <el-switch
                  v-model="scope.row.isTop"
                  active-color="#13ce66"
                  inactive-color="#F4F4F5"
                  :active-value="1"
                  :inactive-value="0"

          />
        </template>
      </el-table-column>
      <!-- 列操作 -->
      <el-table-column label="操作" align="center" width="160">
        <template slot-scope="scope">
          <el-button type="primary" size="mini"
                     @click="editArticle(scope.row.id)">
            编辑
          </el-button>

          <el-popconfirm
                  title="确定删除吗？"
                  style="margin-left:1rem"
                  @onConfirm="deleteArticles(scope.row.id)"
          >
            <el-button size="mini" type="danger" slot="reference">
              删除
            </el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="current"
            :page-sizes="[5, 10, 20, 30]"
            :page-size="size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            background
    />
    <!-- 批量逻辑删除对话框 -->
    <el-dialog :visible.sync="isDelete" width="30%">
      <div class="dialog-title-container" slot="title">
        <i class="el-icon-warning" style="color:#ff9900" />提示
      </div>
      <div style="font-size:1rem">是否删除选中项？</div>
      <div slot="footer">
        <el-button @click="isDelete = false">取 消</el-button>
        <el-button type="primary" @click="deleteArticles(null)">
          确 定
        </el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>


  import {deleteArticles, listArticle} from "../../api/blogList";

  export default {
    created() {
      //获取分类列表
      this.getList() ;
    },
    name: "blogList",
    data(){
      return{
        isDelete: false,
        articleList: [],
        articleIdList: [],
        title: "", //模糊搜索的
        current: 1 ,//当前页
        size: 5 ,//一页的条数
        total: 100,//总条数
      }
    },
    methods:{
      selectionChange(articleList) {
        this.articleIdList = []
        articleList.forEach(res => {
          this.articleIdList.push(res.id)
        })
      },
       async getList(){
        await  listArticle(this.current, this.size, this.title).then(({data})=>{
         // debugger
         if(data.status){
           this.articleList=data.data.data.items;
           this.total=data.data.data.total;
         }
       }).catch(()=>{
         this.$message.error("请求博客列表失败");
       });
      },
      editArticle(id){
        this.$router.push({ path: "/article/" + id });
      } ,
     async deleteArticles(id){
        let param = {}
        if (id == null) {
          param = this.articleIdList
        }else {
          param = [id]
        }
        var str = param.join(",")
        const {data} =  await deleteArticles(str);
        if(data.status){
          this.$message.success("删除成功");
          this.getList()
        }else{
          this.$message.error("删除失败");
        }
       this.isDelete = false
      },
      handleSizeChange(val) {
        //把val复制给size 重新在后台查询数据
        this.size=val;
        this.getList();
      },
      //当页面改边的时候
      handleCurrentChange(val) {
        this.current=val;
        this.getList();
      },
    },
  }
</script>

<style scoped>
  .operation-container {
    display: flex;
    align-items: center;
    margin-bottom: 1.25rem;
  }
</style>
