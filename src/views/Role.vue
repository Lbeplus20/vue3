<template>
    <div>
        <div style="padding: 10px 0">
            <el-input style="width: 200px" placeholder="请输入名称" suffix-icon="el-icon-search"
                      v-model="name"></el-input>
            <!--                        <el-input style="width: 200px" placeholder="请输入邮箱" suffix-icon="el-icon-message"-->
            <!--                                  class="ml-5"></el-input>-->
            <!--                        <el-input style="width: 200px" placeholder="请输入地址" suffix-icon="el-icon-position"-->
            <!--                                  class="ml-5"></el-input>-->
            <el-button class="ml-5" type="primary" @click="load">搜索</el-button>
            <el-button class="ml-5" type="warning" @click="reset">重置</el-button>
        </div>
        <div style="margin: 10px 0">
            <el-button type="primary" @click="handleAdd">新增<i class="el-icon-circle-plus-outline"></i>
            </el-button>
            <el-popconfirm
                    class="ml-5"
                    confirm-button-text='确定'
                    cancel-button-text='再想想'
                    icon="el-icon-info"
                    icon-color="red"
                    title="确定批量删除吗？"
                    @confirm="delBatch"
            >
                <el-button type="danger" slot="reference">批量删除<i class="el-icon-remove-outline"></i></el-button>
            </el-popconfirm>
            <!--            <el-upload action="http://localhost:8088/user/import" :show-file-list="false"-->
            <!--                       :on-success="handleExcelSuccess" accept="xlsx" style="display: inline-block">-->
            <!--                <el-button type="primary">导入<i class="el-icon-bottom"></i></el-button>-->
            <!--            </el-upload>-->
            <!--            <el-button type="primary" @click="exp" class="ml-5">导出<i class="el-icon-top"></i></el-button>-->
        </div>
        <el-table :data="tableData" border stripe @selection-change="handleSelectionChange">>
            <!--                        选项框-->
            <el-table-column type="selection" width="55"></el-table-column>

            <el-table-column prop="id" label="Id" width="80"></el-table-column>
            <el-table-column prop="name" label="名称"></el-table-column>
            <el-table-column prop="flag" label="唯一标识"></el-table-column>
            <el-table-column prop="description" label="描述"></el-table-column>


            <el-table-column label="操作" width="280">
                <template slot-scope="scope">
                    <el-button type="info" @click="selectMenu(scope.row.id)">分配菜单 <i class="el-icon-menu"></i>
                    </el-button>
                    <el-button type="success" @click="handleEdit(scope.row)">编辑<i class="el-icon-edit"></i></el-button>
                    <el-popconfirm
                            class="ml-5"
                            confirm-button-text='确定'
                            cancel-button-text='再想想'
                            icon="el-icon-info"
                            icon-color="red"
                            title="确定删除吗？"
                            @confirm="del(scope.row.id)"
                    >
                        <el-button type="danger" slot="reference">删除 <i class="el-icon-remove-outline"></i></el-button>
                    </el-popconfirm>

                </template>
            </el-table-column>
        </el-table>


        <div style=" padding: 10px 0">
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="pageNum"
                    :page-sizes="[5, 10, 15, 20]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </div>

        <el-dialog title="角色信息" :visible.sync="dialogFormVisible" width="30%">
            <el-form label-width="80px" size="small">
                <el-form-item label="名称">
                    <el-input v-model="form.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="唯一标识">
                    <el-input v-model="form.flag" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="描述">
                    <el-input v-model="form.description" autocomplete="off"></el-input>
                </el-form-item>


            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="save" v-show="qd">确 定</el-button>
                <el-button type="primary" @click="update" v-show="xg">修 改</el-button>
            </div>
        </el-dialog>

        <el-dialog title="菜单分配" :visible.sync="menuDialogVisible" width="30%">
            <el-tree
                    :data="menuData"
                    :props="props"
                    ref="tree"
                    show-checkbox
                    node-key="id"
                    :default-expanded-keys="expends"
                    :default-checked-keys="checks">
                 <span class="custom-tree-node" slot-scope="{ node, data }">
                            <span><i :class="data.icon"/>{{ data.name }}</span>
                 </span>
            </el-tree>


            <div slot="footer" class="dialog-footer">
                <el-button @click="menuDialogVisible= false">取 消</el-button>
                <el-button type="primary" @click="saveRoleMenu" v-show="qd">确 定</el-button>
            </div>
        </el-dialog>


    </div>
</template>

<script>
    export default {
        name: "Role",
        data() {
            return {
                tableData: [],
                total: 0,
                pageNum: 1,
                pageSize: 5,
                name: '',
                multipleSelection: [],
                dialogFormVisible: false,
                menuDialogVisible: false,
                form: {},
                //确定，修改按钮
                qd: false,
                xg: false,
                menuData: [],
                //将名称映射上去
                props: {
                    label: 'name'
                },
                expends: [],
                checks: [],
                roleId: 0
            }
        },
        created() {
            this.load()
        },
        methods: {
            // 批量删除
            delBatch() {
                let ids = this.multipleSelection.map(v => v.id)  //[{},{}]=>[1,2]
                this.request.delete("/role/del/ids", {data: ids}).then(res => {
                    if (res.code === '200') {
                        this.$message.success("删除成功")
                        this.load()
                    } else {
                        this.$message.success("删除失败")
                    }
                })
            },
            handleSelectionChange(val) {
                this.multipleSelection = val
            },
            //重置
            reset() {
                this.name = ""
                this.load()
            },
            //新增窗口界面
            handleAdd() {
                this.dialogFormVisible = true
                this.qd = true
                this.form = {}

            },
            //编辑
            handleEdit(row) {
                this.form = row
                this.dialogFormVisible = true
                this.xg = true
            },
            //删除
            del(id) {
                this.request.delete("/role/" + id).then(res => {
                    if (res.code === '200') {
                        this.$message.success("删除成功")
                        this.load()
                    } else {
                        this.$message.success("删除失败")
                    }
                })
            },
            //确定按钮
            save() {
                this.request.post("/role", this.form).then(res => {
                    if (res.code === '200') {
                        this.$message.success("新增成功")
                        this.dialogFormVisible = false
                        this.load()
                    } else {
                        this.$message.success("新增失败")
                    }
                })
            },
            //修改按钮
            update() {
                this.request.put("/role", this.form).then(res => {
                    if (res.code === '200') {
                        this.$message.success("修改成功")
                        this.dialogFormVisible = false
                        this.load()
                    } else {
                        this.$message.success("修改失败")
                    }
                })
            },

            load() {
                this.request.get("/role/page", {
                        params: {
                            pageNum: this.pageNum,
                            pageSize: this.pageSize,
                            name: this.name
                        }
                    }
                ).then(res => {
                    this.tableData = res.data.records
                    this.total = res.data.total

                })

            },
            handleSizeChange(pageSize) {
                this.pageSize = pageSize
                this.load()
            },
            handleCurrentChange(pageNum) {
                this.pageNum = pageNum
                this.load()
            },
            exp() {
                window.open("http://localhost:8088/role/export")
            },
            handleExcelSuccess() {
                this.$message.success("文件导入成功！")
                this.load()
            },

            selectMenu(roleId) {
                this.menuDialogVisible = true
                this.qd = true
                this.roleId = roleId
                //请求菜单数据
                this.request.get("/menu").then(res => {
                    this.menuData = res.data
                    //把后台返回的菜单数据处理成id数组
                    this.expends = this.menuData.map(v => v.id)
                })


                this.request.get("/role/roleMenu/" + roleId).then(res => {
                    this.checks = res.data
                })

            },
            //分配菜单的确定
            saveRoleMenu() {
                this.request.post("/role/roleMenu/"+ this.roleId, this.$refs.tree.getCheckedKeys())
                    .then(res => {
                        if (res.code === '200') {
                            this.$message.success("绑定成功")
                            this.menuDialogVisible = false
                        }else {
                            this.$message.error(res.msg)
                        }
                    })
            }
        }
    }
</script>

<style scoped>

</style>