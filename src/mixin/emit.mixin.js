const mixin = {
  methods: {
    mixin_emit(event) {
      this.$emit(event, ...Array.from(arguments).slice(1));
    }
  }
}

export default  mixin;
