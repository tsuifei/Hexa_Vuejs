// 載入CDN
import {
  createApp
} from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';
import pagination from './pagination.js';

const apiUrl = 'https://vue3-course-api.hexschool.io/api/';
const apiPath = 'moitw';

const app = createApp({
  data() {
    return {
      products: [],
      tempProduct: {
        imagesUrl: [],
      },
      productCount: 0,
      isNew: false,
      pagination: {},
    }
  },
  components: {
    pagination,
  },
  mounted() {
    // 取出token
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    if (!token || token === '') {
      alert('你尚未登入，請重新登入');
      window.location = "login.html";
    }
    axios.defaults.headers.common['Authorization'] = token;
    this.getProduct();
  },
  methods: {
    // 取得產品列表
    getProduct(page = 1) {
      const url = `${apiUrl}${apiPath}/admin/products?page=${page}`;
      axios.get(url)
        .then((response) => {
          if (response.data.success) {
            this.products = response.data.products;
            this.productCount = this.products.length;
            this.pagination = response.data.pagination;
          } else {
            alert(response.data.message)
            window.location = 'login.html';
          }
        })
        .catch((error) => {
          console.log(error);
        })
    },
    // Modal 狀態切換
    openModal(isNew, item) { // 參數帶(狀態,產品)
      // 狀態: new
      if (isNew === 'new') {
        // 新增清空暫存物件
        this.tempProduct = {
          imagesUrl: [],
        };
        this.isNew = true;
      } else if (isNew === 'edit') {
        // 以解構 淺拷貝一份出來修改，不然會直接修改原資料
        this.tempProduct = {
          ...item
        };
        this.isNew = false;
        this.$refs.productModal.openModal()
      }
    },
    // 刪除產品
    deleteProduct(product) {
      if (confirm(`確認刪除此${product.title}產品?`)) {
        const url = `${apiUrl}${apiPath}/admin/product/${product.id}`;
        axios.delete(url).then((response) => {
            console.log(response.data.message);
            if (response.data.success) {
              // alert(response.data.message);
              this.getProduct();
            } else {
              alert(response.data.message);
            }
          })
          .catch((error) => {
            console.log(error, response.data.message);
          })
      }
    }
  },
});
// product Modal 元件，新增、編輯產品
app.component('productModal', {
  template: '#productModal',
  props: {
    product: {
      type: Object,
      default () {
        return {
          imagesUrl: [],
        }
      },
    },
    isNew: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      modal: null
    };
  },
  // 生命週期
  mounted() {
    // 實體化 Modal(新增 /編輯)
    this.productModal = new bootstrap.Modal(this.$refs.productModal, {
      keyboard: false,
      backdrop: 'static'
    });
  },
  // 方法
  methods: {
    // 新增/更新產品
    updateProduct(product) {
      // 新增
      let url = `${apiUrl}${apiPath}/admin/product`;
      let httpMethod = 'post';
      if (!this.isNew) {
        url = `${apiUrl}${apiPath}/admin/product/${this.product.id}`;
        httpMethod = 'put'
        this.$emit('emitUpdate')
      }
      // 使用[]物件取值
      axios[httpMethod](url, {
        data: this.product
      }).then((response) => {
        if (response.data.success) {
          alert(response.data.message)
          this.hideModal();
          this.$emit('emitUpdate')
        } else {
          alert(response.data.message)
        }
      }).catch((error) => {
        console.log(error);
      });
    },
    // 新增多圖片陣列
    createImages() {
      this.product.imagesUrl = []; // 複數
      this.product.imagesUrl.push('');
    },
    openModal() {
      this.productModal.show();
    },
    hideModal() {
      this.productModal.hide();
    },
  },
});

app.mount('#app');