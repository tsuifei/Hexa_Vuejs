// 載入CDN
import {
  createApp
} from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';

// Bootstrap Modal 視窗用
let productModal = '';
let delProductModal = '';

createApp({
  data() {
    return {
      apiUrl: 'https://vue3-course-api.hexschool.io/api/',
      apiPath: 'moitw',
      products: [],
      productCount: 0,
      isNew: false, // 是否新增產品
      tempProduct: { // 暫時拿出來修改或新增的物件
        imagesUrl: [],
      },
    }
  },
  mounted() { // 元件產生時，如init
    // 實體化 Modal(新增/編輯)和(刪除)視窗
    productModal = new bootstrap.Modal(document.querySelector("#productModal"), {
      keyboard: false
    });
    delProductModal = new bootstrap.Modal(document.querySelector("#delProductModal"), {
      keyboard: false
    });
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
      const url = `${this.apiUrl}${this.apiPath}/admin/products?page=${page}`;
      axios.get(url)
        .then((response) => {
          if (response.data.success) {
            this.products = response.data.products;
            this.productCount = this.products.length;
          } else {
            alert(response.data.message)
          }
        })
        .catch((error) => {
          console.log(error);
        })
    },
    // 新增/更新產品
    updateProduct() {
      // 新增
      let url = `${this.apiUrl}${this.apiPath}/admin/product`;
      let httpMethod = 'post';
      // 編輯
      if (!this.isNew) {
        url = `${this.apiUrl}${this.apiPath}/admin/product/${this.tempProduct.id}`;
        httpMethod = 'put'
      }
      // 因是變數故使用[]物件取值
      axios[httpMethod](url, {
        data: this.tempProduct
      }).then((response) => {
        if (response.data.success) {
          alert(response.data.message)
          productModal.hide();
          this.getProduct()
        } else {
          alert(response.data.message)
        }
      }).catch((error) => {
        console.log(error);
      });
    },
    // 刪除產品
    delProduct() {
      const url = `${this.apiUrl}${this.apiPath}/admin/product/${this.tempProduct.id}`;

      axios.delete(url).then((response) => {
          console.log(response.data.message);
          if (response.data.success) {
            alert(response.data.message);
            delProductModal.hide();
            this.getProduct();
          } else {
            alert(response.data.message);
          }
        })
        .catch((error) => {
          console.log(error, response.data.message);
        })
    },
    // 打開 Modal 視窗
    openModal(isNew, item) { // 參數帶(狀態,產品)
      // 狀態: new
      if (isNew === 'new') {
        // 新增需清空暫存物件
        this.tempProduct = {
          imagesUrl: [],
        };
        this.isNew = true;
        productModal.show();
      } else if (isNew === 'edit') {
        // 以解構 淺拷貝一份出來修改，不然會直接修改原資料
        this.tempProduct = {
          ...item
        };
        this.isNew = false;
        productModal.show();
      } else if (isNew === 'delete') {
        this.tempProduct = {
          ...item
        };
        console.log('Temp: ', this.tempProduct);
        delProductModal.show();
      }
    },
    // 新增多圖片陣列
    createImages() {
      this.tempProduct.imagesUrl = []; // 複數
      this.tempProduct.imagesUrl.push('');
    },
  },
}).mount('#app');