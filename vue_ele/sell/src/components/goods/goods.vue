<template>
  <div class="goods">
    <div class="menu-wrapper" ref='menuWrapper'>
      <ul>
        <li v-for="(item,index) in goods" :key="index" class="menu-item"
        :class="{'current': currentIndex === index}"
        @click="selectMenu(index,$event)"
        >
            <span class="text border-1px">
              <span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>{{ item.name }}
            </span>
        </li>
      </ul>
    </div>
    <div class="foods-wrapper" ref="foodWrapper">
      <ul>
        <li v-for="(item,index) in goods" :key="index" class="food-list food-list-hook">
          <h1 class="title">{{ item.name }}</h1>
          <ul>
            <li v-for="(food,index) in item.foods" :key="index" class="food-item border-1px">
              <div class="icon">
                <img :src="food.icon" alt="#" width="57" height="57">
              </div>
              <div class="content">
                <h2 class="name">{{ food.name }}</h2>
                <p class="desc">{{ food.description }}</p>
                <div class="extra">
                  <span class="count">月售{{food.sellCount}}</span><span>好评率{{food.rating}}%</span>
                </div>
                <div class="price">
                  <span class="now">￥{{food.price}}</span><span  class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import BScroll from 'better-scroll';
const ERR_OK = 0;
export default {
  props: {
    seller: {
      type: Object
    }
  },
  data () {
    return {
      goods: [],
      listHeight: [],
      scrollY: 0
    };
  },
  computed: {
    currentIndex () {
      for (let i = 0; i < this.listHeight.length; i++) {
        // 获取当前区间的Y轴高度
        let height1 = this.listHeight[i];
        // 获取下一个区间的Y轴高度
        let height2 = this.listHeight[i + 1];
        // 如果当前是最后一个不元素，那下一个元素回事undefined，则需要判断操作
        // 如果当前滑动的Y轴刚好落到当前区间的范围内，则进行下一步操作
        if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
          return i;
        };
      };
      return 0;
    }
  },
  created () {
    this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];

    axios.get('http://192.168.10.125:8080/api/goods')
    .then((res) => {
      if (res.data.errno === ERR_OK) {
        this.goods = res.data.data;
        this.$nextTick(() => {
          this._initScroll();
          // 计算每个分类区间的距离
          this._calculateHeight();
        });
      };
    });
  },
  methods: {
    _initScroll () {
      // vue里面获取dom对象,better-scroll会封装一些普通操作事件，如果需要启动，则需要传参
      this.meunScroll = new BScroll(this.$refs.menuWrapper, {
        click: true
      });
      this.foodScroll = new BScroll(this.$refs.foodWrapper, {
        probeType: 3
      });

      this.foodScroll.on('scroll', (pos) => {
        // 实时获取滑动的y轴位置
        this.scrollY = Math.abs(Math.round(pos.y));
      });
    },
    _calculateHeight () {
      // 活得每个li标签
      let foodList = this.$refs.foodWrapper.querySelectorAll('.food-list-hook');
      let height = 0;
      this.listHeight.push(height);
      for (let i = 0; i < foodList.length; i++) {
        let item = foodList[i];
        // 获取视口的高度
        height += item.clientHeight;
        this.listHeight.push(height);
      };
    },
    selectMenu (index, event) {
      // 浏览器自带的事件没有_constructed 这个属性，better-scroll组件派发的事件带有_constructed属性
      if (!event._constructed) {
        return;
      };
      let foodList = this.$refs.foodWrapper.querySelectorAll('.food-list-hook');
      let el = foodList[index];
      this.foodScroll.scrollToElement(el, 300);
    }
  }
};
</script>

<style lang='stylus' rel='stylesheet/stylus'>
@import '../../common/stylus/mixin.styl';
.goods
  display flex
  position absolute
  top 174px
  bottom 46px
  width 100%
  overflow hidden
  .menu-wrapper
    flex 0 0 80px
    width 80px
    background #f3f5f7
    .menu-item
      display table
      height 56px
      padding 0 12px
      line-height 14px
      &.current
        position relative
        z-index 10
        margin-top -1px
        font-weight 700
        background-color #fff
        .text
          border-none()
      .icon
        display inline-block
        width 16px
        height 16px
        vertical-align top
        margin-right 2px
        background-size 16px 16px
        background-repeat no-repeat
        &.decrease
          bg-image('decrease_3')
        &.discount
          bg-image('discount_3')
        &.guarantee
          bg-image('guarantee_3')
        &.invoice
          bg-image('invoice_3')
        &.special
          bg-image('special_3')
      .text
        display table-cell
        width 56px
        vertical-align middle
        font-size 12px
        border-1px(rgba(7, 17, 27, 0.1))
  .foods-wrapper
    flex 1
    .title
      padding-left 14px
      height 26px
      line-height 26px
      border-left 2px solid #d9dde1
      font-size 12px
      color rgb(147,153,159)
      background #f3f5f7
    .food-item
      display flex
      margin 18px
      padding-bottom 18px
      border-1px(rgba(7, 17, 27, 0.1))
      &:last-child
        border-none()
        margin-bottom 0
      .icon
        flex 0 0 57px
        margin-right 10px
      .content
        flex 1
        .name
          margin 2px 0 8px 0
          height 14px
          font-size 14px
          color rgb(7,17,27)
        .desc, .extra
          line-height 10px
          font-size 10px
          color rgb(147,153,159)
        .desc
          line-height 12px
        .extra
          margin-top 8px
          .count
            margin-right 12px
        .price
          line-height 24px
          .now
            margin-right 8px
            font-size 14px
            font-weight 700
            color rgb(240,20,20)
          .old
            text-decoration line-through
            font-size 10px
            font-weight 700
            color rgb(147,153,159)
</style>
