new Vue({
   el:"#app",
   data: {
       totalMoney: 0,
       productList: [],
       checkAllProduct: false,
       delFlag: false,
       curProduct: ''
   },
   filters: {
        // 局部过滤器
       formatMoney: function (value) {
           return "$ "+value.toFixed(2);
       }
   },
   mounted: function () {
       this.$nextTick(function () {
           // 代码保证 this.$el 在 document 中
           this.cartView();
       });
   },
   methods: {
       cartView: function () {
           let _this = this;
           this.$http.get("data/cartData.json", {"id": 123}).then(res => {
               this.productList = res.data.result.list;
               //this.totalMoney = res.body.result.totalMoney;
           });
       },
       changeQuantity: function (product, way) {
           if (way > 0) {
               product.productQuantity++;
           } else {
               product.productQuantity--;
               if (product.productQuantity < 1) {
                   product.productQuantity = 1;
               }
           }
       },
       selectProduct: function (item) {
           if (typeof item.checked == "undefined") {
               Vue.set(item, "checked", true);
           } else {
               item.checked = !item.checked;
           }
           this.calcTotalPrice();
       },
       checkAll: function (flag) {
           this.checkAllProduct = flag;
           let _this = this;
           this.productList.forEach(function (item, index) {
               if (typeof item.checked == "undefined") {
                   _this.$set(item, "checked", _this.checkAllProduct);
               } else {
                   item.checked = _this.checkAllProduct;
               }
           });
           this.calcTotalPrice();
       },
       calcTotalPrice: function () {
           let _this = this;
           // 每次计算总额应该清0
           this.totalMoney = 0;
           this.productList.forEach(function (item, index) {
               if (item.checked) {
                   _this.totalMoney += item.productPrice*item.productQuantity;
               }
           });
       },
       delConfirm: function (item) {
           this.delFlag = true;
           this.curProduct = item;
       },
       delProduct: function () {
           let index = this.productList.indexOf(this.curProduct);
           /*console.log(index);//-1*/
           this.productList.splice(index, 1);
           this.delFlag = false;
           this.calcTotalPrice();
       }
   }
});
// 全局过滤器
Vue.filter('money', function (value, type) {
    return "$ "+value.toFixed(2)+type;
});