import productModal from './productModal.js';
import pagination from './pagination.js';

// 表單驗證訊息語系
VeeValidateI18n.loadLocaleFromURL('./json/zh_TW.json');
// Activate the locale
VeeValidate.configure({
  generateMessage: VeeValidateI18n.localize('zh_TW'),
  validateOnInput: true, // 調整為輸入字元立即進行驗證
});
// 表單驗證所有規則
Object.keys(VeeValidateRules).forEach(rule => {
  if (rule !== 'default') {
    VeeValidate.defineRule(rule, VeeValidateRules[rule]);
  }
});

const apiUrl = 'https://vue3-course-api.hexschool.io/api/';
const apiPath = 'moitw';

const app = Vue.createApp({
  data() {
    return {
      products: [],
      product: {},
      cartsData: {},
      isLoading: true,
      pagination: {},
      form: {
        user: {
          email: '',
          name: '',
          tel: '',
          address: '',
        },
        message: '',
      },
    }
  },
  components: {
    productModal,
    pagination,
  },
  methods: {
    // Get 所有商品
    getProducts(page = 1) {
      const url = `${apiUrl}${apiPath}/products?page=${page}`;
      axios.get(url)
        .then((res) => {
          if (res.data.success) {
            this.products = res.data.products
            this.isLoading = false
            this.pagination = res.data.pagination;
          } else {
            alert(res.data.message)
          }
        }).catch((err) => {
          console.log(err);
        })
    },
    // Get 單一商品(Modal)
    getModalProduct(id) {
      const url = `${apiUrl}${apiPath}/product/${id}`;
      axios.get(url)
        .then((res) => {
          if (res.data.success) {
            this.product = res.data.product;
            this.$refs.productModal.showModal();
          } else {
            alert(res.data.message)
          }
        }).catch((err) => {
          console.log(err);
        })
    },
    // Post 增加購物車
    addToCart(id, qty = 1) {
      this.isLoading = true;
      const url = `${apiUrl}${apiPath}/cart`;
      let cart = {
        "product_id": id,
        "qty": qty,
      }
      axios.post(url, {
          data: cart
        })
        .then((res) => {
          if (res.data.success) {
            alert(res.data.message);
            this.isLoading = false;
            this.$refs.productModal.hideModal();
            this.getAllCart();
          } else {
            alert(res.data.message)
          }
        }).catch((err) => {
          console.log(err);
        })
    },
    // Put 修改購物車 待補充 未完
    updateCart(item) {
      this.isLoading = true;
      console.log('updateCart_OK');
      const url = `${apiUrl}${apiPath}/cart/${item.id}`;
      let newQty = {
        product_id: item.id,
        qty: item.qty,
      };
      axios.put(url, {
          data: newQty
        })
        .then((res) => {
          if (res.data.success) {
            alert(res.data.message);
            this.isLoading = false;
            this.getAllCart();
          } else {
            alert(res.data.message)
          }
        }).catch((err) => {
          console.log(err);
        })
    },
    // Delete 全部刪除購物車
    deleteAllCarts() {
      this.isLoading = true;
      const url = `${apiUrl}${apiPath}/carts`;
      axios.delete(url)
        .then((res) => {
          if (res.data.success) {
            this.isLoading = false;
            this.getAllCart();
          } else {
            alert(res.data.message)
          }
        }).catch((err) => {
          console.log(err);
        })
    },
    // get 取得全部購物車
    getAllCart() {
      // console.log('getAllCart_OK');
      const url = `${apiUrl}${apiPath}/cart`;
      axios.get(url)
        .then((res) => {
          if (res.data.success) {
            this.cartsData = res.data.data;
          } else {
            alert(res.data.message)
          }
        }).catch((err) => {
          console.log(err);
        })
    },
    // delete 刪除單筆購物車
    deleteCart(id) {
      this.isLoading = true;
      const url = `${apiUrl}${apiPath}/cart/${id}`;
      axios.delete(url)
        .then((res) => {
          if (res.data.success) {
            this.isLoading = false
            alert(res.data.message);
            this.getAllCart();
          } else {
            alert(res.data.message)
          }
        }).catch((err) => {
          console.log(err);
        })
    },
    // post 新增訂單/送出表單
    addOrder() {
      this.isLoading = true
      const url = `${apiUrl}${apiPath}/order`;
      const order = this.form;
      console.log(order);
      axios.post(url, {
          data: order
        })
        .then((res) => {
          if (res.data.success) {
            this.isLoading = false
            alert(res.data.message);
            console.log(this.form);
            this.$refs.form.resetForm(); // 為什麼一定要 $refs
            this.form.message = '';
            this.getAllCart();
          } else {
            alert(res.data.message)
          }
        }).catch((err) => {
          console.log(err);
        })
    },
  },
  // 生命週期
  created() {
    this.getProducts();
    this.getAllCart();
  },
});
// 元件註冊('自定義名稱',載入的元件內容)
// Modal 單產品
app.component('productModal', productModal);
// 驗證元件
app.component('VForm', VeeValidate.Form);
app.component('VField', VeeValidate.Field);
app.component('ErrorMessage', VeeValidate.ErrorMessage);
// Loading 元件
app.component('loading', VueLoading);

app.mount('#app');