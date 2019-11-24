<template>
    <div style="z-index:999999999999">
        <input v-model="name" ref="input" @focus="handleOnFocus" @blur="hanleOnBlur" id="renameInput" autofocus="autofocus"/>
    </div>
</template>
<script>

export default {
  components: {
  },
  data() {
    return {
        name: "",

    };
  },
  props: {
  },
  computed: {
    
  }, 
  updated: function() {
    this.$emit("updateTem", "VDom加载完成！");
  },
  mounted() {
    let self = this
    setTimeout(function() {
        self.$refs.input.focus()
    },1);
  },
  methods: {
     handleOnFocus() {
       console.log('获取了焦点')
      //  this.$store.commit('setInputIsFocus', true)
     },
     hanleOnBlur() {
      //  this.$store.commit('setInputIsFocus', false)
       console.log('input失去了焦点')
       this.$store.commit('setTestfocus')
       this.rename_is_effective = false
     }
  }
};
</script>

<style lang="less" scoped>
</style>

