export default {

  // 父層取資料 props
  props: ['product'],
  data() {
    return {
      tempProduct: {},
      modal: '',
      qty: 1,
    }
  },
  watch: { // 待查正確使用方法
    product() {
      this.tempProduct = this.product;

    },
  },
  mounted() {
    console.log('有到這裡嗎？');
    // 實例化 Modal
    this.modal = new bootstrap.Modal(this.$refs.productModal, {
      keyboard: false,
      backdrop: 'static'
    });
  },
  methods: {
    showModal() {
      this.modal.show();
    },
    hideModal() {
      this.modal.hide();
    },
    // 待寫
    modifyQty(action) {
      // console.log('modifyQtyOK');
      if (action === "decrease") {
        if (this.qty > 1) {
          this.qty--
        } else return

      } else if (action === "add") {
        this.qty++
      }
    },
  },
  template: `<div class="modal fade" id="productModal" ref="productModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
  aria-hidden="true" >
  <div class="modal-dialog modal-xl" role="document">
    <div class="modal-content border-0">
      <div class="modal-header bg-dark text-white">
        <h5 class="modal-title" id="exampleModalLabel">
          <span>{{tempProduct.title}}</span>
        </h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <div class="row">
          <div class="col-sm-6">
            <img class="img-fluid" :src="tempProduct.imageUrl" alt="">
            <div class="row mt-2">
              <div class="col-4" v-for="(img, index) in tempProduct.imagesUrl"
                :key="img">
                <img :src="img" class="img-fluid" :alt="tempProduct.title">
              </div>
            </div>
          </div>
          <div class="col-sm-6">
            <span class="badge bg-primary rounded-pill">{{tempProduct.category}}</span>
            <p>{{tempProduct.description}}</p>
            <p>商品內容：{{tempProduct.content}}</p>
            <del class="h6">原價：{{tempProduct.origin_price}} 元</del>
            <div class="h5">優惠價：{{tempProduct.price}}</div>
            <div>
          <div class="row flex-row-reverse mt-3">
            <div class="col-6">
              <div class="input-group">
                <div @click="modifyQty('decrease')" class="btn_modify_qty_cart border"> - </div>
                <input type="number" class="form-control m-0 p-1 text-center fw-bold border" v-model.number="qty" min="1">
                <div @click="modifyQty('add')"  class="btn_modify_qty_cart border"> + </div>

                <button @click="$emit('add-to-cart', tempProduct.id,qty)" type="button" class="btn btn-primary">加入購物車</button>
              </div>
            </div>
          </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>`,
}