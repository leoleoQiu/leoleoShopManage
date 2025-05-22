<script setup>
import { initTableData, skusGoodsList } from '@/composables/SkusCard.js'
const { skusLables, tableLables } = initTableData()
</script>
<template>
  <el-form-item style="margin-top: 20px">
    <table border="1">
      <thead>
        <tr>
          <th
            v-for="item in tableLables"
            :key="item.name"
            :style="{ width: item.width + 'px' }"
            :colspan="item.colspan"
            :rowspan="item.rowspan"
          >
            {{ item.name }}
          </th>
        </tr>
        <tr>
          <th v-for="item in skusLables" :key="item.id" width="100">
            {{ item.name }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in skusGoodsList" :key="item.id">
          <td v-for="o in item.skus" :key="o.id">{{ o.value }}</td>
          <td>
            <el-input
              size="small"
              v-model="item.pprice"
              type="number"
            ></el-input>
          </td>
          <td>
            <el-input
              size="small"
              v-model="item.oprice"
              type="number"
            ></el-input>
          </td>
          <td>
            <el-input
              size="small"
              v-model="item.cprice"
              type="number"
            ></el-input>
          </td>
          <td>
            <el-input
              size="small"
              v-model="item.stock"
              type="number"
            ></el-input>
          </td>
          <td>
            <el-input
              size="small"
              v-model="item.volume"
              type="number"
            ></el-input>
          </td>
          <td>
            <el-input
              size="small"
              v-model="item.weight"
              type="number"
            ></el-input>
          </td>
          <td>
            <el-input size="small" v-model="item.code" type="number"></el-input>
          </td>
        </tr>
      </tbody>
    </table>
  </el-form-item>
</template>

<style lang="scss" scoped></style>
